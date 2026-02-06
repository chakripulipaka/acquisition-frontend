'use client'

import { useState } from 'react'
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
      return 'bg-green-50 text-green-700'
    case 'Medium':
      return 'bg-yellow-50 text-yellow-700'
    case 'High':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-green-50 text-green-700'
    case 'In Review':
      return 'bg-blue-50 text-blue-700'
    case 'Pending':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

export default function Page() {
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
              <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                New Evaluation
              </Button>
            </div>

            {/* Search Section */}
            <Card className="p-6 mb-8 border-0 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Card>

            {/* Table Section */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-b hover:bg-gray-50">
                      <TableHead className="font-semibold">Company</TableHead>
                      <TableHead className="font-semibold">Risk Level</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50/50">
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
                            {new Date(item.lastUpdated).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
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
