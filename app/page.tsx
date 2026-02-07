'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Search, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { useEvaluations } from '@/contexts/evaluations-context'

const SCORE_ORDER: Record<string, number> = { High: 3, Medium: 2, Low: 1 }
const SCORE_LEVELS = ['High', 'Medium', 'Low']

function scoreToLevel(score?: number): string {
  if (score == null) return 'Pending'
  if (score >= 7.5) return 'High'
  if (score >= 5.0) return 'Medium'
  return 'Low'
}

interface EvaluationRow {
  id: string | number
  company: string
  industry: string
  rubricScore: string
  ourScore: string
  finalScore: string
  lastUpdated: string
}

type SortDirection = 'desc' | 'asc' | null
type SortColumn = 'rubricScore' | 'ourScore' | 'finalScore' | 'lastUpdated' | null

function getScoreTextColor(score: string) {
  if (score === 'Pending' || score === '--') return 'text-muted-foreground'
  switch (score) {
    case 'High':
      return 'text-green-600'
    case 'Medium':
      return 'text-amber-500'
    case 'Low':
      return 'text-red-600'
    default:
      return 'text-muted-foreground'
  }
}

function getScoreBadgeColor(score: string) {
  switch (score) {
    case 'High':
      return 'bg-green-100 text-green-700'
    case 'Medium':
      return 'bg-amber-100 text-amber-700'
    case 'Low':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-muted/20 text-muted-foreground'
  }
}

export default function Page() {
  const router = useRouter()
  const { evaluations, loading } = useEvaluations()

  const allData: EvaluationRow[] = useMemo(() => {
    return evaluations.map((ev) => {
      const scores = ev.evaluation_results?.[0]?.scores
      return {
        id: ev.id,
        company: ev.company_name,
        industry: ev.company_info?.industry || 'Other',
        rubricScore: scoreToLevel(scores?.yourPolicyAvg),
        ourScore: scoreToLevel(scores?.generalPolicyAvg),
        finalScore: scoreToLevel(scores?.finalScore),
        lastUpdated: ev.created_at?.slice(0, 10) || '',
      }
    })
  }, [evaluations])

  const INDUSTRIES = useMemo(
    () => [...new Set(allData.map((d) => d.industry))].sort(),
    [allData],
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [filterRubric, setFilterRubric] = useState('all')
  const [filterOurScore, setFilterOurScore] = useState('all')
  const [filterFinalScore, setFilterFinalScore] = useState('all')
  const [filterIndustry, setFilterIndustry] = useState('all')

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'desc') setSortDirection('asc')
      else if (sortDirection === 'asc') { setSortColumn(null); setSortDirection(null) }
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const filteredData = allData.filter((item) => {
    if (!item.company.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterRubric !== 'all' && item.rubricScore !== filterRubric) return false
    if (filterOurScore !== 'all' && item.ourScore !== filterOurScore) return false
    if (filterFinalScore !== 'all' && item.finalScore !== filterFinalScore) return false
    if (filterIndustry !== 'all' && item.industry !== filterIndustry) return false
    return true
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0
    if (sortColumn === 'lastUpdated') {
      const diff = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
      return sortDirection === 'desc' ? -diff : diff
    }
    const diff = (SCORE_ORDER[a[sortColumn]] || 0) - (SCORE_ORDER[b[sortColumn]] || 0)
    return sortDirection === 'desc' ? -diff : diff
  })

  const hasActiveFilters = filterRubric !== 'all' || filterOurScore !== 'all' || filterFinalScore !== 'all' || filterIndustry !== 'all'

  const clearFilters = () => {
    setFilterRubric('all')
    setFilterOurScore('all')
    setFilterFinalScore('all')
    setFilterIndustry('all')
    setSearchQuery('')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-[74%] mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold text-foreground">
                Past Evaluations
              </h1>
              <Button
                onClick={() => router.push('/evaluation')}
                className="mt-4 md:mt-0 bg-white hover:bg-gray-50 text-foreground border-2 border-secondary gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                New Evaluation
              </Button>
            </div>

            {/* Search/Filter + Table layout */}
            <div className="flex gap-6">
              {/* Left Panel — Search & Filters */}
              <div className="w-64 shrink-0 space-y-5">
                {/* Search */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      className="pl-9 h-9 rounded-lg text-sm border-secondary/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">Filters</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-foreground mb-1 block">Rubric Score</Label>
                      <Select value={filterRubric} onValueChange={setFilterRubric}>
                        <SelectTrigger className="h-9 text-sm border-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {SCORE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-foreground mb-1 block">Our Score</Label>
                      <Select value={filterOurScore} onValueChange={setFilterOurScore}>
                        <SelectTrigger className="h-9 text-sm border-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {SCORE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-foreground mb-1 block">Final Score</Label>
                      <Select value={filterFinalScore} onValueChange={setFilterFinalScore}>
                        <SelectTrigger className="h-9 text-sm border-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {SCORE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-foreground mb-1 block">Industry</Label>
                      <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                        <SelectTrigger className="h-9 text-sm border-secondary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-secondary hover:text-primary font-medium transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel — Table */}
              <div className="flex-1 min-w-0">
                <Card className="rounded-2xl shadow-sm overflow-hidden border-t-4 border-t-primary">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="border-b-2 border-b-secondary hover:bg-muted/30">
                          <TableHead className="font-semibold text-foreground">Company</TableHead>
                          <TableHead className="font-semibold text-foreground">Industry</TableHead>
                          {(['rubricScore', 'ourScore', 'finalScore'] as const).map((col) => (
                            <TableHead
                              key={col}
                              className="font-semibold text-foreground cursor-pointer select-none hover:text-primary transition-colors"
                              onClick={() => handleSort(col)}
                            >
                              <span className="inline-flex items-center gap-1">
                                {col === 'rubricScore' ? 'Rubric Score' : col === 'ourScore' ? 'Our Score' : 'Final Score'}
                                {sortColumn === col && sortDirection === 'desc' && <ArrowDown className="w-3.5 h-3.5" />}
                                {sortColumn === col && sortDirection === 'asc' && <ArrowUp className="w-3.5 h-3.5" />}
                              </span>
                            </TableHead>
                          ))}
                          <TableHead
                            className="font-semibold text-foreground cursor-pointer select-none hover:text-primary transition-colors"
                            onClick={() => handleSort('lastUpdated')}
                          >
                            <span className="inline-flex items-center gap-1">
                              Date
                              {sortColumn === 'lastUpdated' && sortDirection === 'desc' && <ArrowDown className="w-3.5 h-3.5" />}
                              {sortColumn === 'lastUpdated' && sortDirection === 'asc' && <ArrowUp className="w-3.5 h-3.5" />}
                            </span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading evaluations...
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : sortedData.length > 0 ? (
                          sortedData.map((item) => (
                            <TableRow
                              key={item.id}
                              className="hover:bg-muted/10 cursor-pointer transition-colors"
                              onClick={() => router.push(`/company/${item.id}`)}
                            >
                              <TableCell className="font-medium text-foreground">
                                {item.company}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {item.industry}
                              </TableCell>
                              <TableCell>
                                <span className={`text-sm font-semibold ${getScoreTextColor(item.rubricScore)}`}>
                                  {item.rubricScore}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={`text-sm font-semibold ${getScoreTextColor(item.ourScore)}`}>
                                  {item.ourScore}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getScoreBadgeColor(item.finalScore)}`}>
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
                  Showing {sortedData.length} of {allData.length} evaluations
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  )
}
