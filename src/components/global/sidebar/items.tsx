import { SIDEBAR_MENU } from '@/constants/menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  page: string
  slug: string
}

const Items = ({ page, slug }: Props) => {
  return SIDEBAR_MENU.map((item) => {
    const href = item.label === 'dashboard' 
      ? `/dashboard/${slug}`
      : `/dashboard/${slug}/${item.label}`

    return (
      <Link
        key={item.id}
        href={href}
        className={cn(
          'capitalize flex gap-x-2 rounded-full p-3',
          page === item.label && 'bg-[#0f0f0f]',
          page === slug && item.label === 'dashboard'
            ? 'bg-[#0f0f0f]'
            : 'text-[#9B9CA0]'
        )}
      >
        {item.icon}
        {item.label}
      </Link>
    )
  })
}

export default Items
