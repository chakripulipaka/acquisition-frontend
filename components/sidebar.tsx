'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

const PLACEHOLDER_USERNAME = 'James Mitchell'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-full border-b-2 border-b-primary bg-white text-foreground h-16 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Logo Section - Left */}
      <div className="flex items-center flex-shrink-0">
        <Link href="/" className="flex items-center">
          <span className="font-sora font-bold italic text-2xl text-black">acquire</span>
        </Link>
      </div>

      {/* Navigation Items - Center */}
      <div className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium border-b-2',
                isActive
                  ? 'bg-muted/20 text-primary border-b-primary'
                  : 'text-foreground hover:bg-muted/10 hover:text-primary border-b-transparent hover:border-b-secondary'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Username - Right */}
      <div className="flex items-center flex-shrink-0">
        <p className="text-sm font-medium text-foreground">{PLACEHOLDER_USERNAME}</p>
      </div>
    </nav>
  )
}
