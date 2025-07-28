import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Clock, FileText } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
    hasResults,
    hasQuery
  } = useSearch();

  // Focus input khi modal mở
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Clear search khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  const handleResultClick = (postId: string) => {
    navigate(`/post/${postId}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm bài viết
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>
        </div>

        <div className="px-6 pb-6 max-h-96 overflow-y-auto">
          {!hasQuery ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nhập từ khóa để tìm kiếm bài viết</p>
            </div>
          ) : isSearching ? (
            <div className="space-y-3 mt-4">
              {Array.from({ length: 3 }, (_, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hasResults ? (
            <div className="space-y-3 mt-4">
              {searchResults.map((post) => (
                <Card 
                  key={post.id}
                  className="hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => handleResultClick(post.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {post.featured_image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img 
                            src={post.featured_image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          {!post.published && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              Nháp
                            </Badge>
                          )}
                        </div>
                        
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(post.created_at), { 
                            addSuffix: true,
                            locale: vi 
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium mb-1">Không tìm thấy kết quả</p>
              <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;