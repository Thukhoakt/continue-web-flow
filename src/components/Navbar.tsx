import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  ChevronDown, 
  LogOut, 
  User, 
  Plus,
  Menu,
  X,
  Users,
  FileText,
  Video,
  BookOpen,
  Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!"
    });
  };

  const menuItems = [
    { name: 'HOME', path: '/', icon: null },
    { name: 'BLOG', path: '/blog', dropdown: true, icon: FileText },
    { name: 'YOUTUBE', path: '/youtube', icon: Video },
    { name: 'Email', path: '/email', icon: null },
    { name: 'TÀI LIỆU', path: '/documents', icon: BookOpen },
    { name: 'E-learning', path: '/e-learning', icon: Layers },
  ];

  const blogDropdownItems = [
    { name: 'Tất cả bài viết', path: '/' },
    { name: 'Công nghệ', path: '/blog/tech' },
    { name: 'Lập trình', path: '/blog/programming' },
    { name: 'Tutorial', path: '/blog/tutorial' },
    { name: 'Reviews', path: '/blog/reviews' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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
                {item.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                          isActivePath(item.path) ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                        {item.name}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-background/95 backdrop-blur-sm border border-border/50">
                      {blogDropdownItems.map((dropdownItem) => (
                        <DropdownMenuItem
                          key={dropdownItem.name}
                          onClick={() => navigate(dropdownItem.path)}
                          className={`cursor-pointer transition-colors ${
                            isActivePath(dropdownItem.path) ? 'bg-primary/10 text-primary' : ''
                          }`}
                        >
                          {dropdownItem.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                      isActivePath(item.path) ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchModalOpen(true)}
              className="hover:bg-muted/50"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <Button 
                      onClick={() => navigate('/create-post')}
                      size="sm"
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tạo bài
                    </Button>
                    <Button 
                      onClick={() => navigate('/admin/users')}
                      size="sm"
                      variant="outline"
                      className="hover:bg-muted/50"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      User
                    </Button>
                  </>
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
                <div key={item.name}>
                  {item.dropdown ? (
                    <div className="space-y-2">
                      <div className={`px-3 py-2 text-sm font-medium ${
                        isActivePath(item.path) ? 'text-primary' : 'text-foreground'
                      }`}>
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-2">
                        {blogDropdownItems.map((dropdownItem) => (
                          <button
                            key={dropdownItem.name}
                            onClick={() => {
                              navigate(dropdownItem.path);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`block text-left w-full px-3 py-2 text-sm transition-colors duration-200 hover:text-primary ${
                              isActivePath(dropdownItem.path) ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          >
                            {dropdownItem.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                        isActivePath(item.path) ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
              
              <div className="border-t pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <>
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
                        <Button 
                          onClick={() => {
                            navigate('/admin/users');
                            setIsMobileMenuOpen(false);
                          }}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Quản lý User
                        </Button>
                      </>
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
      
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;