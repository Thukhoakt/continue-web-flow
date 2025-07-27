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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      {post.featured_image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          {!post.published && (
            <Badge variant="secondary">Nháp</Badge>
          )}
        </div>
        <CardDescription>
          {formatDistanceToNow(new Date(post.created_at), { 
            addSuffix: true,
            locale: vi 
          })}
        </CardDescription>
      </CardHeader>
      
      {post.excerpt && (
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default BlogCard;