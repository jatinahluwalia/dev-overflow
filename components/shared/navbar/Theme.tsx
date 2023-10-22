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

const Theme = () => {
  const [localTheme, setLocalTheme] = useState("");
  useEffect(() => {
    setLocalTheme(localStorage.theme);
  }, []);
  const { mode, setMode } = useTheme();
  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          {mode === "light" ? (
            <Image
              src={"/assets/icons/sun.svg"}
              alt="sun"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src={"/assets/icons/moon.svg"}
              alt="sun"
              width={20}
              height={20}
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300">
          {themes.map((theme) => (
            <MenubarItem
              key={theme.value}
              className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400"
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
                alt={theme.value}
                height={16}
                width={16}
                className={`${localTheme === theme.value && "active-theme"}`}
              />
              <p
                className={`body-semibold text-light-500 ${
                  localTheme === theme.value
                    ? "text-primary-500"
                    : "text-dark100_light900"
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
