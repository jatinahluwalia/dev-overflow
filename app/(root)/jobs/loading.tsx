import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-11 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job Title, Company, or Keywords"
        />
        <Skeleton />
      </div>
      <div className="mt-10 flex flex-col gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </>
  );
};

export default Loading;
