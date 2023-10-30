import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="flex flex-col-reverse justify-between md:flex-row md:items-start">
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          <Skeleton className="aspect-square w-36 rounded-full" />
          <div className="mt-3">
            <Skeleton className="h-8 w-56 rounded-xl" />
            <Skeleton className="mt-2 h-4 w-32 rounded-xl" />
            <div className="mt-3 flex h-8 w-[300px] gap-3.5">
              {Array.from({ length: 3 })
                .map((_, i) => i)
                .map((item) => (
                  <Skeleton key={item} className="grow" />
                ))}
            </div>
            <Skeleton className="mt-5 h-20 w-56" />
          </div>
        </div>
        <Skeleton className="ml-auto h-14 w-52" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 })
          .map((_, i) => i)
          .map((item) => (
            <Skeleton key={item} className="h-32" />
          ))}
      </div>

      <div className="mt-12 flex flex-col gap-5">
        {Array.from({ length: 10 })
          .map((_, i) => i)
          .map((item) => {
            return <Skeleton key={item} className="h-28 rounded-xl" />;
          })}
      </div>
    </section>
  );
};

export default Loading;
