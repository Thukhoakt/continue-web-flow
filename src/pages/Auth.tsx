import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Lỗi đăng nhập",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!"
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(email, password);
    
    if (error) {
      toast({
        title: "Lỗi đăng ký",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng kiểm tra email để xác thực tài khoản."
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <Card className="w-full max-w-md shadow-elegant backdrop-blur-sm bg-card/90 border-0 animate-scale-in relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-display">Chào mừng</CardTitle>
          <CardDescription className="text-base">
            Đăng nhập hoặc tạo tài khoản để tiếp tục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                Đăng ký
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang đăng nhập...
                    </div>
                  ) : "Đăng nhập"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Mật khẩu</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang tạo tài khoản...
                    </div>
                  ) : "Đăng ký"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;