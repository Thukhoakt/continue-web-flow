import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlogCard from '@/components/BlogCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, LogIn, LogOut, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
  published: boolean;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select('id, title, excerpt, featured_image, created_at, published')
        .order('created_at', { ascending: false });

      // Nếu không phải admin, chỉ hiển thị bài đã xuất bản
      if (!isAdmin) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài viết.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-4xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-3">
              <span className="font-sans font-light">John</span>
              <span className="font-display font-bold">Deus</span>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Button 
                      onClick={() => navigate('/create-post')}
                      className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="h-4 w-4" />
                      Tạo bài viết
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                    <User className="h-4 w-4" />
                    {user.email}
                    {isAdmin && <span className="text-primary font-medium">(Admin)</span>}
                  </div>
                </>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Cathedral */}
      <section className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/src/assets/phero-cathedral.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl md:text-7xl font-display font-bold mb-4 animate-fade-up">
              <span className="font-sans font-light">John</span>{' '}
              <span className="font-display font-bold">Deus</span>
            </div>
            <div className="w-32 h-1 bg-white/80 mx-auto rounded-full animate-fade-up" style={{animationDelay: '0.3s'}}></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-20 max-w-2xl mx-auto shadow-elegant animate-scale-in">
            <CardHeader>
              <CardTitle className="text-3xl font-display">Chưa có bài viết nào</CardTitle>
              <CardDescription className="text-lg">
                {isAdmin 
                  ? "Hãy tạo bài viết đầu tiên của bạn!" 
                  : "Chưa có bài viết nào được xuất bản."
                }
              </CardDescription>
            </CardHeader>
            {isAdmin && (
              <CardContent>
                <Button 
                  onClick={() => navigate('/create-post')}
                  className="flex items-center gap-2 mx-auto bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  Tạo bài viết đầu tiên
                </Button>
              </CardContent>
            )}
          </Card>
        ) : (
          <>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display font-bold mb-4">Bài viết mới nhất</h3>
              <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="animate-fade-up" 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
