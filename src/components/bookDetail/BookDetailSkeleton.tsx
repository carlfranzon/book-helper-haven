
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const BookDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-64 h-96 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default BookDetailSkeleton;
