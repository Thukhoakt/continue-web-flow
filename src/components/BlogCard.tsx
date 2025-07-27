import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string | null;
    featured_image: string | null;
    created_at: string;
    published: boolean;
  };
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card 
      className="group hover:shadow-elegant transition-all duration-500 cursor-pointer overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:scale-[1.02] hover:bg-card"
      onClick={() => window.location.href = `/post/${post.id}`}
    >
      {post.featured_image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      )}
      
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-300 font-display leading-tight">
            {post.title}
          </CardTitle>
          {!post.published && (
            <Badge variant="secondary" className="shrink-0 animate-pulse">
              Nháp
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          {formatDistanceToNow(new Date(post.created_at), { 
            addSuffix: true,
            locale: vi 
          })}
        </CardDescription>
      </CardHeader>
      
      {post.excerpt && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all duration-300">
            Đọc thêm
            <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </CardContent>
      )}
      
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Card>
  );
};

export default BlogCard;