'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Settings, Plus, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    label: 'New Evaluation',
    href: '/evaluation',
    icon: Plus,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-sidebar text-sidebar-foreground h-screen flex flex-col">
      {/* Logo/Brand Section */}
      <div className="px-6 py-8 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
            A
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">Acquire</span>
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

      {/* Profile Button at Bottom */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-3 justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
        >
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">Profile</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60">© 2024 Acquire</p>
      </div>
    </aside>
  )
}
