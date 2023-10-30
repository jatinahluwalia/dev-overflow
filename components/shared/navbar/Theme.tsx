"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { themes } from "@/constants";
import { Button } from "@/components/ui/button";

const Theme = () => {
  const [localTheme, setLocalTheme] = useState<string | undefined>("");
  useEffect(() => {
    setLocalTheme(localStorage.theme);
  }, []);
  const { mode, setMode } = useTheme();
  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button className="no-focus cursor-pointer bg-light-900 transition-all hover:bg-light-800 data-[state=open]:bg-light-800 dark:bg-dark-200 dark:hover:bg-dark-400 dark:data-[state=open]:bg-dark-400">
            {mode === "light" ? (
              <Image
                src={"/assets/icons/sun.svg"}
                alt="sun"
                width={20}
                height={20}
                className="active-theme"
              />
            ) : (
              <Image
                src={"/assets/icons/moon.svg"}
                alt="sun"
                width={20}
                height={20}
                className="active-theme"
              />
            )}
          </Button>
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-light-900 px-0 py-2 dark:border-dark-400 dark:bg-dark-300">
          {themes.map((theme) => (
            <MenubarItem
              key={theme.value}
              className="flex cursor-pointer items-center gap-[4px] px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
              onClick={() => {
                localStorage.theme = theme.value;
                setLocalTheme(theme.value);
                theme.value !== "system"
                  ? setMode(theme.value)
                  : window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? setMode("dark")
                  : setMode("light");
              }}
            >
              <Image
                src={theme.icon}
                alt={`${theme.value}`}
                height={19}
                width={19}
                className={`${
                  localTheme === theme.value && "active-theme"
                } p-[3px]`}
              />
              <p
                className={`body-semibold text-light-500 ${
                  localTheme === theme.value
                    ? "text-primary-500"
                    : "text-dark-100 dark:text-light-500"
                }`}
              >
                {theme.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
