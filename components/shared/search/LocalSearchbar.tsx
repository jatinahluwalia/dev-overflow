"use client";

import Image from "next/image";
import React from "react";
import { Input } from "../../ui/input";

interface Props {
  route: string;
  iconPosition: "left" | "right";
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  placeholder,
  imgSrc,
  otherClasses,
  iconPosition,
}: Props) => {
  return (
    <div
      className={`background-light800_darkgradient flex items-center gap-4 rounded-[10px] border border-light-700 p-4 dark:border-none ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        onChange={() => {}}
        placeholder={placeholder}
        className="no-focus paragraph-regular placeholder:text-light400_light500 h-max grow border-none bg-transparent p-0 shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
