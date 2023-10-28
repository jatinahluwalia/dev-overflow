"use client";

import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formQueryURL, removeQueryKeys } from "@/lib/utils";

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState(searchParams.get("filter") || "");

  const handleFilterClick = (item: string) => {
    if (item === active) {
      setActive("");
      const queries = removeQueryKeys({
        params: searchParams.toString(),
        keys: ["filter"],
      });
      router.push(`${pathname}?${queries}`);
    } else {
      setActive(item);
      const queries = formQueryURL({
        params: searchParams.toString(),
        key: "filter",
        value: item,
      });
      router.push(`${pathname}?${queries}`);
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleFilterClick(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 dark:bg-dark-400"
              : "bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-500"
          }`}
        >
          <span
            className={active === item.value ? "primary-text-gradient" : ""}
          >
            {item.name}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
