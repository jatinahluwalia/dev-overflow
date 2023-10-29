"use client";

import { GlobalSearchFilters } from "@/constants/filters";
import { formQueryURL, removeQueryKeys } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get("type");

  const [active, setActive] = useState(type || "");

  const handleTypeClick = (type: string) => {
    if (type === active) {
      setActive("");
      const queries = removeQueryKeys({
        params: searchParams.toString(),
        keys: ["type"],
      });
      router.push(`${pathname}?${queries}`);
    } else {
      setActive(type);
      const queries = formQueryURL({
        params: searchParams.toString(),
        key: "type",
        value: type,
      });
      router.push(`${pathname}?${queries}`);
    }
  };
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium ">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 
            ${
              active === item.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:hover:text-primary-500"
            }
            `}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
