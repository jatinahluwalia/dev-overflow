"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formQueryURL, removeQueryKeys } from "@/lib/utils";
import { useState } from "react";

interface Props {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, containerClasses, otherClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedFilter, setSelectedFilter] = useState(
    searchParams.get("filter") || undefined,
  );

  const handleFilterChange = (filter: string) => {
    if (filter === "clear") {
      setSelectedFilter(undefined);
      const queries = removeQueryKeys({
        params: searchParams.toString(),
        keys: ["filter"],
      });
      router.push(`${pathname}?${queries}`);
    } else {
      setSelectedFilter(filter);
      const queries = formQueryURL({
        key: "filter",
        params: searchParams.toString(),
        value: filter,
      });
      router.push(`${pathname}?${queries}`);
    }
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select value={selectedFilter} onValueChange={handleFilterChange}>
        <SelectTrigger
          className={`${otherClasses} no-focus background-light800_dark300 light-border body-regular text-dark200_light900 outline-[0.5px] outline-gray-200 transition-all hover:outline`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="background-light900_dark300 dark:border-none">
          <SelectGroup>
            <SelectItem
              placeholder="Filter"
              value="clear"
              className="text-dark200_light900 cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
            >
              Reset
            </SelectItem>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="text-dark200_light900 cursor-pointer hover:bg-light-800 dark:hover:bg-dark-400"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
