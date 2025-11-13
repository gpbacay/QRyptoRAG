"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { docsConfig } from "@/lib/docs-config"
import { cn } from "@/lib/utils"

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="w-full">
      {docsConfig.sidebarNav.map((item, index) => (
        <div key={index} className={cn("pb-4")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold tracking-tight">
            {item.title}
          </h4>
          {item.items ? (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          ) : null}
        </div>
      ))}
    </div>
  )
}

interface DocsSidebarNavItemsProps {
  items: {
    title: string;
    href: string;
    disabled?: boolean;
  }[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => {
        const isActive = pathname === item.href || (pathname === '/docs' && item.href === '/docs');
        return !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex w-full items-center rounded-md p-2 hover:bg-muted/50",
              isActive ? "bg-muted font-semibold" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground opacity-60"
          >
            {item.title}
          </span>
        )
      })}
    </div>
  ) : null
}
