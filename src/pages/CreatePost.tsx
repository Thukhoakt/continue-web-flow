import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingPostId(editId);
      fetchPostForEdit(editId);
    }
  }, [searchParams]);

  const fetchPostForEdit = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setExcerpt(data.excerpt || '');
      setContent(data.content);
      setFeaturedImage(data.featured_image || '');
      setPublished(data.published);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải bài viết để chỉnh sửa",
        variant: "destructive"
      });
      navigate('/');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `featured-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFeaturedImage(data.publicUrl);
      
      toast({
        title: "Thành công",
        description: "Ảnh đại diện đã được tải lên!"
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      if (editingPostId) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({
            title,
            content,
            excerpt,
            featured_image: featuredImage || null,
            published
          })
          .eq('id', editingPostId);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert({
            title,
            content,
            excerpt,
            featured_image: featuredImage || null,
            author_id: user.id,
            published
          });

        if (error) throw error;
      }

      toast({
        title: "Thành công",
        description: `Bài viết đã được ${published ? 'xuất bản' : 'lưu nháp'}!`
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể ${editingPostId ? 'cập nhật' : 'tạo'} bài viết. Vui lòng thử lại.`,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:bg-muted/50 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              {editingPostId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
            </h1>
            <p className="text-muted-foreground mt-1">{editingPostId ? 'Cập nhật nội dung bài viết' : 'Chia sẻ câu chuyện của bạn với thế giới'}</p>
          </div>
        </div>

        <Card className="shadow-elegant border-0 bg-card/50 backdrop-blur-sm animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="text-2xl font-display">Thông tin bài viết</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-medium">Tiêu đề</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                  className="text-lg p-4 border-2 focus:border-primary transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="excerpt" className="text-base font-medium">Mô tả ngắn</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Nhập mô tả ngắn về bài viết..."
                  rows={4}
                  className="resize-none border-2 focus:border-primary transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="featured-image" className="text-base font-medium">Ảnh đại diện</Label>
                <div className="relative">
                  <Input
                    id="featured-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="file:bg-gradient-primary file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:shadow-glow transition-all duration-300"
                  />
                  {isUploading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {featuredImage && (
                  <div className="mt-4 relative group">
                    <img 
                      src={featuredImage} 
                      alt="Preview" 
                      className="w-full max-w-md h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg"></div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Nội dung</Label>
                <div className="border-2 rounded-lg focus-within:border-primary transition-all duration-300">
                  <RichTextEditor content={content} onChange={setContent} />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                  className="data-[state=checked]:bg-gradient-primary"
                />
                <Label htmlFor="published" className="text-base cursor-pointer">
                  {published ? '🚀 Xuất bản ngay' : '📝 Lưu nháp'}
                </Label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-[1.02] px-8 py-3 text-base"
                >
                  <Save className="h-5 w-5" />
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang lưu...
                    </div>
                  ) : editingPostId ? (published ? 'Cập nhật & Xuất bản' : 'Cập nhật nháp') : (published ? 'Xuất bản' : 'Lưu nháp')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="px-8 py-3 text-base hover:bg-muted/50 transition-all duration-300"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;