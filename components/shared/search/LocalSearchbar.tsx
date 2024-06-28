'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Input } from '../../ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formQueryURL, removeQueryKeys } from '@/lib/utils';

interface Props {
  route: string;
  iconPosition: 'left' | 'right';
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query || '');

  useEffect(() => {
    const debouncer = setTimeout(() => {
      if (search) {
        const queryString = formQueryURL({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        });
        router.push(`${pathname}?${queryString}`);
      } else {
        const queryString = removeQueryKeys({
          params: searchParams.toString(),
          keys: ['q'],
        });
        router.push(`${pathname}?${queryString}`);
      }
    }, 300);

    return () => clearTimeout(debouncer);
  }, [query, search, router, pathname, searchParams]);

  return (
    <div
      className={`background-light800_darkgradient flex items-center gap-4 rounded-[10px] border border-light-700 p-4 dark:border-dark-300 ${otherClasses}`}
    >
      {iconPosition === 'left' && (
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
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder={placeholder}
        className="text-dark100_light900 no-focus paragraph-regular placeholder:text-light400_light500 h-max grow border-none bg-transparent p-0 shadow-none outline-none"
      />

      {iconPosition === 'right' && (
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
