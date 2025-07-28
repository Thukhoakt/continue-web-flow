import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onClose?: () => void;
  className?: string;
  showNavigation?: boolean;
}

const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onClose, 
  className = "",
  showNavigation = false 
}: SwipeableCardProps) => {
  const { swipeHandlers } = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    threshold: 100
  });

  return (
    <Card 
      className={`relative touch-pan-y select-none ${className}`}
      {...swipeHandlers}
    >
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      {showNavigation && (
        <>
          {onSwipeRight && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwipeRight}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {onSwipeLeft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwipeLeft}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
      
      <CardContent className="p-0">
        {children}
      </CardContent>
      
      {/* Swipe indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        <div className="w-8 h-1 bg-muted-foreground/30 rounded-full"></div>
      </div>
    </Card>
  );
};

export default SwipeableCard;