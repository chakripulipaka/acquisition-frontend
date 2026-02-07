'use client'

import { useRouter, useParams } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, ExternalLink } from 'lucide-react'

// Mock data for company evaluations
const COMPANY_DATA: Record<number, any> = {
  1: {
    id: 1,
    name: 'Tech Innovations Inc',
    riskLevel: 'Medium',
    status: 'Completed',
  },
  2: {
    id: 2,
    name: 'Global Finance Corp',
    riskLevel: 'Low',
    status: 'Completed',
  },
  3: {
    id: 3,
    name: 'Energy Solutions Ltd',
    riskLevel: 'High',
    status: 'In Review',
  },
  4: {
    id: 4,
    name: 'Retail Group International',
    riskLevel: 'Medium',
    status: 'Completed',
  },
  5: {
    id: 5,
    name: 'Healthcare Ventures Co',
    riskLevel: 'Low',
    status: 'Completed',
  },
  6: {
    id: 6,
    name: 'Manufacturing Plus',
    riskLevel: 'High',
    status: 'In Review',
  },
}

// Rubric items with ratings and sources
const RUBRIC_ITEMS = [
  {
    category: 'Financial Stability',
    rating: 'Strong',
    score: 8.5,
    sources: [
      { name: 'Bloomberg Financial Report', url: 'https://bloomberg.com' },
      { name: 'SEC Filings Database', url: 'https://sec.gov' },
    ],
  },
  {
    category: 'Regulatory Compliance',
    rating: 'Compliant',
    score: 9.0,
    sources: [
      { name: 'FDA Regulatory Updates', url: 'https://fda.gov' },
      { name: 'Legal News Database', url: 'https://legalnewsdb.com' },
    ],
  },
  {
    category: 'Debt Management',
    rating: 'Excellent',
    score: 8.7,
    sources: [
      { name: 'Moody\'s Credit Analysis', url: 'https://moodys.com' },
      { name: 'S&P Global Ratings', url: 'https://spglobal.com' },
    ],
  },
  {
    category: 'Market Position',
    rating: 'Strong',
    score: 8.2,
    sources: [
      { name: 'Market Research Reports', url: 'https://marketresearch.com' },
      { name: 'Industry Analyst Coverage', url: 'https://analysts.com' },
    ],
  },
  {
    category: 'Management Quality',
    rating: 'Strong',
    score: 8.1,
    sources: [
      { name: 'Executive Profile Database', url: 'https://executives.com' },
      { name: 'Leadership Track Record', url: 'https://leadtrack.com' },
    ],
  },
  {
    category: 'Environmental Risk',
    rating: 'Moderate',
    score: 6.8,
    sources: [
      { name: 'Environmental Impact Reports', url: 'https://epa.gov' },
      { name: 'Sustainability News', url: 'https://sustainabilitynews.com' },
    ],
  },
  {
    category: 'Supply Chain Resilience',
    rating: 'Strong',
    score: 7.9,
    sources: [
      { name: 'Supply Chain Risk Analysis', url: 'https://scra.com' },
      { name: 'Logistics Industry Report', url: 'https://logistics.com' },
    ],
  },
  {
    category: 'Operational Efficiency',
    rating: 'Strong',
    score: 8.3,
    sources: [
      { name: 'Operational Audit Report', url: 'https://audit.com' },
      { name: 'Industry Benchmarks', url: 'https://benchmarks.com' },
    ],
  },
  {
    category: 'Customer Satisfaction',
    rating: 'Excellent',
    score: 8.6,
    sources: [
      { name: 'Customer Review Aggregator', url: 'https://reviews.com' },
      { name: 'Consumer Reports Database', url: 'https://consumerreports.com' },
    ],
  },
  {
    category: 'Technology Investment',
    rating: 'Strong',
    score: 8.0,
    sources: [
      { name: 'Tech Innovation Index', url: 'https://techindex.com' },
      { name: 'Patent Database', url: 'https://patents.gov' },
    ],
  },
  {
    category: 'Geographic Diversification',
    rating: 'Moderate',
    score: 6.5,
    sources: [
      { name: 'International Business Review', url: 'https://ibr.com' },
      { name: 'Geographic Risk Analysis', url: 'https://georisk.com' },
    ],
  },
  {
    category: 'R&D Capability',
    rating: 'Strong',
    score: 8.1,
    sources: [
      { name: 'R&D Investment Tracker', url: 'https://rdtracker.com' },
      { name: 'Innovation News', url: 'https://innovationnews.com' },
    ],
  },
  {
    category: 'Brand Value',
    rating: 'Strong',
    score: 8.4,
    sources: [
      { name: 'Brand Valuation Report', url: 'https://brandvalue.com' },
      { name: 'Brand Health Index', url: 'https://brandhealth.com' },
    ],
  },
  {
    category: 'Employee Retention',
    rating: 'Excellent',
    score: 8.8,
    sources: [
      { name: 'HR Analytics Database', url: 'https://hranalytics.com' },
      { name: 'Employee Satisfaction Survey', url: 'https://empsat.com' },
    ],
  },
  {
    category: 'Legal Disputes',
    rating: 'Clean',
    score: 9.2,
    sources: [
      { name: 'Legal Case Database', url: 'https://caselaw.com' },
      { name: 'Litigation Risk Report', url: 'https://litigation.com' },
    ],
  },
  {
    category: 'Insurance Coverage',
    rating: 'Adequate',
    score: 7.7,
    sources: [
      { name: 'Insurance Information Institute', url: 'https://iii.org' },
      { name: 'Coverage Analysis Report', url: 'https://coverage.com' },
    ],
  },
  {
    category: 'Dividend History',
    rating: 'Consistent',
    score: 8.2,
    sources: [
      { name: 'Dividend History Database', url: 'https://dividends.com' },
      { name: 'Investor Relations', url: 'https://ir.com' },
    ],
  },
  {
    category: 'Credit Rating',
    rating: 'Investment Grade',
    score: 8.5,
    sources: [
      { name: 'Credit Rating Agencies', url: 'https://ratings.com' },
      { name: 'Credit Market News', url: 'https://creditnews.com' },
    ],
  },
  {
    category: 'Cybersecurity Posture',
    rating: 'Strong',
    score: 8.0,
    sources: [
      { name: 'Cybersecurity Assessment', url: 'https://cybersec.com' },
      { name: 'Security Breach Database', url: 'https://breachdb.com' },
    ],
  },
  {
    category: 'ESG Score',
    rating: 'Strong',
    score: 7.8,
    sources: [
      { name: 'ESG Rating Agencies', url: 'https://esgraters.com' },
      { name: 'Sustainability Reporting', url: 'https://susreporting.com' },
    ],
  },
]

function getRatingColor(score: number) {
  if (score >= 8.5) return 'text-success'
  if (score >= 7.5) return 'text-secondary'
  if (score >= 6.5) return 'text-warning'
  return 'text-primary'
}

export default function CompanyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)
  const company = COMPANY_DATA[id]

  if (!company) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <p className="text-muted-foreground">Company not found</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-primary mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{company.name}</h1>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <span className={`text-sm font-semibold ${
                  company.riskLevel === 'Low' ? 'text-success' :
                  company.riskLevel === 'Medium' ? 'text-warning' :
                  'text-primary'
                }`}>
                  {company.riskLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="text-sm font-semibold text-secondary">{company.status}</span>
              </div>
            </div>
          </div>

          {/* Rubric Table */}
          <Card className="border-l-4 border-l-primary rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-b-2 border-b-secondary">
                    <TableHead className="font-semibold text-foreground">Evaluation Category</TableHead>
                    <TableHead className="font-semibold text-primary">Rating</TableHead>
                    <TableHead className="font-semibold text-secondary">Score</TableHead>
                    <TableHead className="font-semibold text-foreground">Cited Sources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RUBRIC_ITEMS.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/5 border-b border-border">
                      <TableCell className="font-medium text-foreground">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {item.rating}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        <span className={getRatingColor(item.score)}>
                          {item.score}/10
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col gap-1">
                          {item.sources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:text-primary transition-colors inline-flex items-center gap-1"
                            >
                              {source.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-l-4 border-l-primary">
              <p className="text-sm text-muted-foreground mb-2">Average Score</p>
              <p className="text-3xl font-bold text-foreground">
                {(RUBRIC_ITEMS.reduce((sum, item) => sum + item.score, 0) / RUBRIC_ITEMS.length).toFixed(1)}
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-secondary">
              <p className="text-sm text-muted-foreground mb-2">Categories Evaluated</p>
              <p className="text-3xl font-bold text-foreground">{RUBRIC_ITEMS.length}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-warning">
              <p className="text-sm text-muted-foreground mb-2">Total Sources Cited</p>
              <p className="text-3xl font-bold text-foreground">
                {RUBRIC_ITEMS.reduce((sum, item) => sum + item.sources.length, 0)}
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
