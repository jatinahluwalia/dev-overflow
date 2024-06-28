import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section>
      <Skeleton className="h-12 w-36" />
      <Skeleton className="mt-10 h-12 w-full" />
      <div className="mt-10 flex flex-col gap-5">
        {Array.from({ length: 10 })
          .map((_, i) => i)
          .map((item) => (
            <Skeleton key={item} className="h-32" />
          ))}
      </div>
    </section>
  );
};

export default Loading;
