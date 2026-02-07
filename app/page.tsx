'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
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
import { Plus, Search, ChevronUp, ChevronDown } from 'lucide-react'

const EVALUATION_DATA = [
  {
    id: 1,
    company: 'TechCorp Industries',
    riskLevel: 'Low',
    status: 'Completed',
    rubricScore: 'High',
    ourScore: 'High',
    finalScore: 'High',
    lastUpdated: '2024-12-18',
  },
  {
    id: 2,
    company: 'Global Finance Ltd',
    riskLevel: 'Medium',
    status: 'In Review',
    rubricScore: 'Medium',
    ourScore: 'Low',
    finalScore: 'Medium',
    lastUpdated: '2024-12-17',
  },
  {
    id: 3,
    company: 'Retail Solutions Inc',
    riskLevel: 'High',
    status: 'Pending',
    rubricScore: 'Low',
    ourScore: 'Medium',
    finalScore: 'Low',
    lastUpdated: '2024-12-16',
  },
  {
    id: 4,
    company: 'Energy Holdings Group',
    riskLevel: 'Medium',
    status: 'Completed',
    rubricScore: 'High',
    ourScore: 'Medium',
    finalScore: 'Medium',
    lastUpdated: '2024-12-15',
  },
  {
    id: 5,
    company: 'Healthcare Ventures Co',
    riskLevel: 'Low',
    status: 'Completed',
    rubricScore: 'High',
    ourScore: 'High',
    finalScore: 'High',
    lastUpdated: '2024-12-14',
  },
  {
    id: 6,
    company: 'Manufacturing Plus',
    riskLevel: 'High',
    status: 'In Review',
    rubricScore: 'Medium',
    ourScore: 'High',
    finalScore: 'Medium',
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
  const [sortBy, setSortBy] = useState<'rubricScore' | 'ourScore' | 'finalScore' | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [rubricFilter, setRubricFilter] = useState<string>('')
  const [ourScoreFilter, setOurScoreFilter] = useState<string>('')
  const [finalScoreFilter, setFinalScoreFilter] = useState<string>('')

  const scoreOrder = { High: 3, Medium: 2, Low: 1 }

  const handleSort = (column: 'rubricScore' | 'ourScore' | 'finalScore') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  let filteredData = EVALUATION_DATA.filter((item) =>
    item.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (rubricFilter === '' || item.rubricScore === rubricFilter) &&
    (ourScoreFilter === '' || item.ourScore === ourScoreFilter) &&
    (finalScoreFilter === '' || item.finalScore === finalScoreFilter)
  )

  if (sortBy) {
    filteredData.sort((a, b) => {
      const aValue = scoreOrder[a[sortBy] as keyof typeof scoreOrder] || 0
      const bValue = scoreOrder[b[sortBy] as keyof typeof scoreOrder] || 0
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })
  }


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navbar */}
      <Sidebar />

      {/* Main Content */}
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

            {/* Filters Section */}
            <Card className="p-4 mb-8 rounded-2xl shadow-sm border border-secondary/20">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Rubric Score:</label>
                  <select
                    value={rubricFilter}
                    onChange={(e) => setRubricFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-secondary/30 bg-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Our Score:</label>
                  <select
                    value={ourScoreFilter}
                    onChange={(e) => setOurScoreFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-secondary/30 bg-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Final Score:</label>
                  <select
                    value={finalScoreFilter}
                    onChange={(e) => setFinalScoreFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-secondary/30 bg-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
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
                      <TableHead 
                        className="font-semibold text-secondary cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                        onClick={() => handleSort('rubricScore')}
                      >
                        Rubric Score
                        {sortBy === 'rubricScore' && (
                          sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="font-semibold text-secondary cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                        onClick={() => handleSort('ourScore')}
                      >
                        Our Score
                        {sortBy === 'ourScore' && (
                          sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="font-semibold text-secondary cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                        onClick={() => handleSort('finalScore')}
                      >
                        Final Score
                        {sortBy === 'finalScore' && (
                          sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow 
                          key={item.id} 
                          className="hover:bg-muted/10 cursor-pointer transition-colors"
                          onClick={() => router.push(`/company/${item.id}`)}
                        >
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
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              item.rubricScore === 'High' ? 'bg-blue-100 text-blue-700' :
                              item.rubricScore === 'Medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.rubricScore}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              item.ourScore === 'High' ? 'bg-blue-100 text-blue-700' :
                              item.ourScore === 'Medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.ourScore}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              item.finalScore === 'High' ? 'bg-blue-100 text-blue-700' :
                              item.finalScore === 'Medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.finalScore}
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
                          colSpan={6}
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
  )
}
