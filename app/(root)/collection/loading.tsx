import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section>
      <h1 className="text-dark100_light900 h1-bold">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
        <Skeleton className="h-[56px] w-full rounded-[10px]" />
        <Skeleton className="h-[56px] sm:min-w-[170px]" />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        {Array.from({ length: 10 })
          .map((_, i) => i)
          .map((item) => (
            <Skeleton key={item} className="!h-40 rounded-[10px]" />
          ))}
      </div>
    </section>
  );
};

export default Loading;
