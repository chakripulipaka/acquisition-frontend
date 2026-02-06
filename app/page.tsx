'use client'

import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Users } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Acquire</h2>
              <p className="text-muted-foreground">Manage your financial evaluations and portfolio insights</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Evaluations</p>
                    <p className="text-3xl font-bold text-foreground">12</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
                    <p className="text-3xl font-bold text-foreground">$2.4M</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Clients</p>
                    <p className="text-3xl font-bold text-foreground">8</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { title: 'Q4 Financial Review', date: 'Today at 2:30 PM', status: 'Completed' },
                  { title: 'Portfolio Rebalancing', date: 'Yesterday at 11:00 AM', status: 'In Progress' },
                  { title: 'Client Strategy Session', date: 'Dec 4, 2024', status: 'Completed' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      activity.status === 'Completed' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
