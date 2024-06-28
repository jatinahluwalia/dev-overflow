import { cn } from '@/lib/utils';
import * as React from 'react';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-muted animate-pulse rounded-md bg-slate-900/10 dark:bg-slate-50/10',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
