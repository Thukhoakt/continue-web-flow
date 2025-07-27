import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import CommentSection from '@/components/CommentSection';
import { ArrowLeft, Calendar, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
  published: boolean;
  author_id: string;
  profiles?: {
    full_name: string | null;
    username: string | null;
  };
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, excerpt, featured_image, created_at, published, author_id')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check if user can view this post
      if (!data.published && (!user || (user.id !== data.author_id && !isAdmin))) {
        toast({
          title: "Không có quyền truy cập",
          description: "Bài viết này chưa được xuất bản",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Fetch author profile separately
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', data.author_id)
        .single();

      setPost({
        ...data,
        profiles: profile
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải bài viết: " + error.message,
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !isAdmin) return;
    
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Bài viết đã được xóa"
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài viết: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
            <Button onClick={() => navigate('/')} className="mt-4">
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/edit-post/${post.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Sửa
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeletePost}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </div>
          )}
        </div>

        <article className="space-y-8">
          {/* Post Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {!post.published && (
                <Badge variant="secondary" className="animate-pulse">
                  Nháp
                </Badge>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDistanceToNow(new Date(post.created_at), { 
                  addSuffix: true,
                  locale: vi 
                })}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight font-display">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            <div className="text-sm text-muted-foreground">
              Tác giả: {post.profiles?.full_name || post.profiles?.username || 'Ẩn danh'}
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-elegant">
            <CardContent className="pt-8">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Comments Section */}
          {post.published && (
            <div className="pt-8 border-t">
              <CommentSection postId={post.id} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default PostDetail;