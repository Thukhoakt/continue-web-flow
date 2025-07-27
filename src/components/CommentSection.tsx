import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, Send, Trash2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchComments();
    
    // Real-time subscription for comments
    const channel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles separately to avoid relation issues
      const userIds = [...new Set(data?.map(c => c.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', userIds);

      const commentsWithProfiles = data?.map(comment => ({
        ...comment,
        profiles: profiles?.find(p => p.id === comment.user_id) || null
      })) || [];

      setComments(commentsWithProfiles);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải bình luận: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Thành công",
        description: "Bình luận đã được đăng!"
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể đăng bình luận: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string, commentUserId: string) => {
    if (!user) return;
    
    // Check if user can delete (own comment or admin)
    if (user.id !== commentUserId && !isAdmin) {
      toast({
        title: "Không có quyền",
        description: "Bạn chỉ có thể xóa bình luận của mình",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Bình luận đã được xóa"
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bình luận: " + error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Bình luận ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                placeholder="Viết bình luận của bạn..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none border-2 focus:border-primary transition-all duration-300"
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/20">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              <Button 
                variant="link" 
                onClick={() => window.location.href = '/auth'}
                className="text-primary"
              >
                Đăng nhập
              </Button>
              để bình luận
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <Card className="bg-muted/10">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {comment.profiles?.full_name || comment.profiles?.username || 'Người dùng ẩn danh'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true,
                            locale: vi 
                          })}
                        </p>
                      </div>
                      
                      {(user?.id === comment.user_id || isAdmin) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id, comment.user_id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;