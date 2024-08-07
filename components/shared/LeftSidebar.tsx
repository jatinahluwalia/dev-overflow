'use client';

import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { SignedOut, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            pathname !== '/' && item.route === '/'
              ? false
              : pathname.includes(item.route);

          if (!userId && item.route === '/profile') return null;

          if (item.route === '/profile') {
            item.route = `/profile/${userId}`;
          }

          return (
            <Link
              key={item.route}
              href={item.route}
              className={`${
                isActive
                  ? 'primary-gradient text-light-900'
                  : 'text-dark300_light900'
              } flex items-center justify-start gap-4 rounded-lg bg-transparent p-4 transition-transform hover:bg-primary-500/5 active:scale-90`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p
                className={`${
                  isActive ? 'base-bold' : 'base-medium'
                } max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href={'/sign-in'}>
            <Button className="btn-secondary small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src={'/assets/icons/account.svg'}
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log in
              </span>
            </Button>
          </Link>

          <Link href={'/sign-up'}>
            <Button className="btn-tertiary text-dark400_light900 light-border-2 small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src={'/assets/icons/sign-up.svg'}
                alt="signup"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default MobileNav;
