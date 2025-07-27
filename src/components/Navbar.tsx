import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ChevronDown, 
  LogOut, 
  User, 
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!"
    });
  };

  const menuItems = [
    { name: 'HOME', path: '/', active: true },
    { name: 'BLOG', path: '/blog', dropdown: true },
    { name: 'YOUTUBE', path: '/youtube' },
    { name: 'Email', path: '/email' },
    { name: 'TÀI LIỆU', path: '/documents' },
    { name: 'E-learning', path: '/e-learning' },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer flex items-center gap-2"
          >
            <span className="font-sans font-light">John</span>
            <span className="font-display font-bold">Deus</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                    item.active ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tìm kiếm..."
                    className="w-64 transition-all duration-300"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-muted/50"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button 
                    onClick={() => navigate('/create-post')}
                    size="sm"
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Tạo bài
                  </Button>
                )}
                <Button 
                  variant="ghost"
                  onClick={handleSignOut}
                  size="sm"
                  className="hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Đăng xuất
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                  <User className="h-3 w-3" />
                  {isAdmin && <span className="text-primary text-xs font-medium">Admin</span>}
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                size="sm"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Đăng nhập
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                    item.active ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              <div className="border-t pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <Button 
                        onClick={() => {
                          navigate('/create-post');
                          setIsMobileMenuOpen(false);
                        }}
                        size="sm"
                        className="w-full bg-gradient-primary"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Tạo bài viết
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      size="sm"
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    size="sm"
                    className="w-full bg-gradient-primary"
                  >
                    Đăng nhập
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;