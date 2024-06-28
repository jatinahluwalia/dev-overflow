"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { formQueryURL, removeQueryKeys } from "@/lib/utils";

interface Props {
  data: string[];
}

const CountriesFilter = ({ data }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = searchParams.get("location") || "";

  const [active, setActive] = useState(filter);
  const [open, setOpen] = useState(false);

  const handleFilter = (value: string) => {
    setOpen(false);
    if (value === active) {
      setActive("");
      const queries = removeQueryKeys({
        params: searchParams.toString(),
        keys: ["location"],
      });
      router.push(`${pathname}?${queries}`);
    } else {
      setActive(value);
      const queries = formQueryURL({
        params: searchParams.toString(),
        key: "location",
        value,
      });
      router.push(`${pathname}?${queries}`);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="no-focus dark:dark-gradient flex h-full items-center justify-start gap-[10px] border border-light-700 bg-light-800 p-4 dark:border-dark-300">
          <Image
            height={24}
            width={24}
            src={"/assets/icons/location.svg"}
            alt="location"
          />
          <p className="text-light400_light500 paragraph-regular capitalize">
            {active || "Select Location"}
          </p>
          <Image
            height={24}
            width={24}
            src={"/assets/icons/chevron-down.svg"}
            alt="chevron"
            className="ml-auto"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <Command className="border-light-700 p-0 dark:border-dark-300 dark:bg-black">
          <CommandInput
            placeholder="Search for countries..."
            className="bg-transparent"
          />
          <CommandList>
            <CommandGroup className="custom-scrollbar h-52 overflow-y-auto bg-transparent ">
              {data.map((country) => (
                <CommandItem
                  key={country}
                  value={country}
                  className="cursor-pointer data-[selected=true]:!bg-light-800 dark:data-[selected=true]:!bg-dark-400"
                  onSelect={handleFilter}
                >
                  {country}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountriesFilter;
