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
    <aside className="w-64 border-r border-border bg-sidebar text-sidebar-foreground h-screen flex flex-col">
      {/* Logo/Brand Section */}
      <div className="px-6 py-8 border-b border-sidebar-border">
        <Link href="/" className="flex items-center">
          <span className="font-sora font-light text-2xl text-sidebar-foreground">acquire</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Username at Bottom Left */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-sm font-medium text-sidebar-foreground">{PLACEHOLDER_USERNAME}</p>
      </div>

      {/* Footer */}
      <div className="px-6 py-2 pb-4">
        <p className="text-xs text-sidebar-foreground/60">© 2024 Acquire</p>
      </div>
    </aside>
  )
}
