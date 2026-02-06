'use client'

import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Topbar() {
  return (
    <header className="border-b border-border bg-white h-16 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Acquire</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
