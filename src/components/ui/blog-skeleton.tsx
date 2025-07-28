import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const BlogCardSkeleton = () => {
  return (
    <Card className="group transition-all duration-700 overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
      {/* Image skeleton */}
      <div className="aspect-video w-full overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          {/* Title skeleton */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          {/* Badge skeleton */}
          <Skeleton className="h-6 w-16 shrink-0" />
        </div>
        
        {/* Date skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Read more skeleton */}
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
};

export const BlogGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
};