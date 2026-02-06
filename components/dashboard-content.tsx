import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, FileText, ArrowRight } from 'lucide-react'

export function DashboardContent() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Welcome Section */}
          <div>
            <p className="text-muted-foreground mb-2">Welcome back</p>
            <h2 className="text-3xl font-bold text-foreground">Ready to evaluate new opportunities?</h2>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Active Evaluations</CardTitle>
                <FileText className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <TrendingUp className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">Active users</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Recent Evaluations</CardTitle>
              <CardDescription>Latest submissions from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Acme Corporation', status: 'Pending Review', date: 'Feb 5, 2024' },
                  { name: 'TechStart Inc', status: 'Approved', date: 'Feb 4, 2024' },
                  { name: 'Global Finance Ltd', status: 'In Progress', date: 'Feb 3, 2024' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Pending Review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Ready to get started?
              </CardTitle>
              <CardDescription>Create a new evaluation and start assessing opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create New Evaluation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
