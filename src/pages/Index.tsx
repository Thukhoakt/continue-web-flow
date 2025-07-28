import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar';
import { BlogGridSkeleton } from '@/components/ui/blog-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ParticleBackground, 
  AnimatedLines,
  FloatingShapes,
  ScrollReveal, 
  MagneticButton, 
  TextReveal,
  ParallaxContainer,
  AnimatedBorder
} from '@/components/LusionEffects';
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
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Lusion Effects */}
      <ParticleBackground />
      <AnimatedLines />
      <FloatingShapes />
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Cathedral */}
      <section className="relative h-96 overflow-hidden">
        <ParallaxContainer speed={0.3} className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{
              backgroundImage: `url('/src/assets/phero-cathedral.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          </div>
        </ParallaxContainer>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <ScrollReveal delay={300}>
            <div className="text-center text-white">
              <div className="text-6xl md:text-7xl font-display font-bold mb-4">
                <TextReveal text="John" delay={500} />
                {' '}
                <TextReveal text="Deus" delay={800} />
              </div>
              <div className="w-32 h-1 bg-white/80 mx-auto rounded-full animate-fade-up" style={{animationDelay: '1.2s'}}></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        {loading ? (
          <ScrollReveal>
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="text-3xl font-display font-bold mb-4">
                  <Skeleton className="h-9 w-48 mx-auto" />
                </div>
                <Skeleton className="h-1 w-24 mx-auto rounded-full" />
              </div>
              <BlogGridSkeleton count={6} />
            </div>
          </ScrollReveal>
        ) : posts.length === 0 ? (
          <ScrollReveal>
            <Card className="text-center py-20 max-w-2xl mx-auto shadow-elegant animate-scale-in backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle className="text-3xl font-display">
                  <TextReveal text="Chưa có bài viết nào" />
                </CardTitle>
                <CardDescription className="text-lg">
                  {isAdmin 
                    ? "Hãy tạo bài viết đầu tiên của bạn!" 
                    : "Chưa có bài viết nào được xuất bản."
                  }
                </CardDescription>
              </CardHeader>
              {isAdmin && (
                <CardContent>
                  <AnimatedBorder>
                    <MagneticButton>
                      <Button 
                        onClick={() => navigate('/create-post')}
                        className="flex items-center gap-2 mx-auto bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="h-4 w-4" />
                        Tạo bài viết đầu tiên
                      </Button>
                    </MagneticButton>
                  </AnimatedBorder>
                </CardContent>
              )}
            </Card>
          </ScrollReveal>
        ) : (
          <>
            <ScrollReveal delay={200}>
              <AnimatedBorder>
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-display font-bold mb-4">
                    <TextReveal text="Bài viết mới nhất" delay={0} />
                  </h3>
                  <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
                </div>
              </AnimatedBorder>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ScrollReveal 
                  key={post.id} 
                  delay={index * 100}
                >
                  <AnimatedBorder className="h-full">
                    <MagneticButton className="h-full">
                      <BlogCard post={post} />
                    </MagneticButton>
                  </AnimatedBorder>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </main>
      
      {/* Ambient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none z-0"></div>
    </div>
  );
};

export default Index;
