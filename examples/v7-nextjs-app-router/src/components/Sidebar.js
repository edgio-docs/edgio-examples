'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const relevanceItems = [
  {
    name: 'Trending',
    filter: 'trending',
  },
  {
    name: 'Price: Low to High',
    filter: 'price-low-to-high',
  },
  {
    name: 'Price: High to Low',
    filter: 'price-high-to-low',
  },
];

const Sidebar = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') ?? 'trending';
  const [listingItems, setListingItems] = useState([]);

  console.log('router', router);
  useEffect(() => {
    fetch('/edgio-api/categories/all')
      .then((res) => res.json())
      .then((res) => {
        setListingItems(res);
      });
  }, []);
  return (
    <div className="flex w-full flex-col">
      <h2 className="text-md font-light text-[#FFFFFF75]">Relevance</h2>
      {relevanceItems.map((item) => (
        <a
          key={item.name}
          className={classNames(
            'text-md mt-2 cursor-pointer',
            { 'font-light text-[#FFFFFF75]': filter !== item.filter },
            { 'font-medium text-[#FFFFFF]': filter === item.filter }
          )}
          onClick={(e) => {
            e.preventDefault();
            if (typeof window !== undefined) {
              router.push(`${pathname}?filter=${item.filter}`);
            }
          }}
        >
          {item.name}
        </a>
      ))}
      <Link
        passHref
        className={classNames(
          'text-md mt-7',
          { 'font-light text-[#FFFFFF75]': pathname !== `/commerce` },
          { 'font-medium text-[#FFFFFF]': pathname === `/commerce` }
        )}
        href={`/commerce`}
      >
        Shop All
      </Link>
      {listingItems.map((item) => (
        <Link
          className={classNames(
            'text-md mt-2',
            {
              'font-light text-[#FFFFFF75]':
                pathname !== `/commerce/${item.slug}`,
            },
            {
              'font-medium text-[#FFFFFF]':
                pathname === `/commerce/${item.slug}`,
            }
          )}
          key={item.slug}
          passHref
          href={`/commerce/${item.slug}`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
