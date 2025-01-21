import { SIDEBAR_MENU } from '@/constants/menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

type Props = {
  page: string
  slug: string
}

const Items = ({ page, slug }: Props) => {
  const pathname = usePathname();
  
  return SIDEBAR_MENU.map((item) => {
    const itemPath = `/dashboard/${slug}${item.label === 'home' ? '' : `/${item.label}`}`;
    const isActive = item.label === 'home' ? pathname === itemPath : pathname.includes(`/${item.label}`);
    
    return (
      <Link
        key={item.id}
        href={itemPath}
        className={cn(
          'capitalize flex gap-x-2 rounded-full p-3 text-[#9B9CA0] hover:text-white transition-colors',
          isActive && 'bg-[#0f0f0f] text-white'
        )}
      >
        {item.icon}
        {item.label}
      </Link>
    );
  });
}

export default Items
