'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Search } from 'lucide-react'

const EVALUATION_DATA = [
  {
    id: 1,
    company: 'TechCorp Industries',
    riskLevel: 'Low',
    status: 'Completed',
    lastUpdated: '2024-12-18',
  },
  {
    id: 2,
    company: 'Global Finance Ltd',
    riskLevel: 'Medium',
    status: 'In Review',
    lastUpdated: '2024-12-17',
  },
  {
    id: 3,
    company: 'Retail Solutions Inc',
    riskLevel: 'High',
    status: 'Pending',
    lastUpdated: '2024-12-16',
  },
  {
    id: 4,
    company: 'Energy Holdings Group',
    riskLevel: 'Medium',
    status: 'Completed',
    lastUpdated: '2024-12-15',
  },
  {
    id: 5,
    company: 'Healthcare Ventures Co',
    riskLevel: 'Low',
    status: 'Completed',
    lastUpdated: '2024-12-14',
  },
  {
    id: 6,
    company: 'Manufacturing Plus',
    riskLevel: 'High',
    status: 'In Review',
    lastUpdated: '2024-12-13',
  },
]

function getRiskBadgeColor(risk: string) {
  switch (risk) {
    case 'Low':
      return 'bg-success/10 text-success'
    case 'Medium':
      return 'bg-warning/10 text-warning'
    case 'High':
      return 'bg-primary/10 text-primary'
    default:
      return 'bg-muted/20 text-muted-foreground'
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-success/10 text-success'
    case 'In Review':
      return 'bg-secondary/10 text-secondary'
    case 'Pending':
      return 'bg-muted/20 text-muted-foreground'
    default:
      return 'bg-muted/20 text-muted-foreground'
  }
}

export default function Page() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = EVALUATION_DATA.filter((item) =>
    item.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Financial Risk Evaluations
                </h1>
                <p className="text-muted-foreground">
                  Manage and track company risk assessments
                </p>
              </div>
              <Button 
                onClick={() => router.push('/evaluation')}
                className="mt-4 md:mt-0 bg-white hover:bg-gray-50 text-foreground border-2 border-secondary gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                New Evaluation
              </Button>
            </div>

            {/* Search Section */}
            <Card className="p-6 mb-8 rounded-2xl shadow-sm border-l-4 border-l-secondary">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-secondary" />
                <Input
                  placeholder="Search companies..."
                  className="pl-10 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Card>

            {/* Table Section */}
            <Card className="rounded-2xl shadow-sm overflow-hidden border-t-4 border-t-primary">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-b-2 border-b-secondary hover:bg-muted/30">
                      <TableHead className="font-semibold text-foreground">Company</TableHead>
                      <TableHead className="font-semibold text-primary">Satisfaction Level</TableHead>
                      <TableHead className="font-semibold text-secondary">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/10">
                          <TableCell className="font-medium text-foreground">
                            {item.company}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-sm font-medium px-3 py-1 rounded-full ${getRiskBadgeColor(
                                item.riskLevel,
                              )}`}
                            >
                              {item.riskLevel}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusBadgeColor(
                                item.status,
                              )}`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {item.lastUpdated}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No evaluations found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredData.length} of {EVALUATION_DATA.length} evaluations
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
