'use client';

import { Input } from '@/components/ui/input';
import { formQueryURL, removeQueryKeys } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import GlobalSearchModal from './GlobalSearchModal';

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query || '');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleGlobalClick = (e: any) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearch('');
      }
    };

    setOpen(false);

    document.addEventListener('click', handleGlobalClick);

    return () => document.removeEventListener('click', handleGlobalClick);
  }, [pathname]);

  useEffect(() => {
    const debouncer = setTimeout(() => {
      if (search) {
        const queryString = formQueryURL({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        });
        router.push(`${pathname}?${queryString}`);
      } else {
        const queryString = removeQueryKeys({
          params: searchParams.toString(),
          keys: ['global', 'type'],
        });
        router.push(`${pathname}?${queryString}`);
      }
    }, 300);

    return () => clearTimeout(debouncer);
  }, [query, search, router, pathname, searchParams]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src={'/assets/icons/search.svg'}
          width={24}
          height={24}
          className="cursor-pointer"
          alt="search"
        />
        <Input
          type="text"
          value={search}
          placeholder="Search globally"
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
            if (e.target.value === '' && open) setOpen(false);
          }}
          className="no-focus paragraph-regular placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {open && <GlobalSearchModal />}
    </div>
  );
};

export default GlobalSearch;
