'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SourcePreviewDialog } from '@/components/source-preview-dialog'
import { ArrowLeft, ExternalLink, LinkIcon, Loader2 } from 'lucide-react'
import { useEvaluations } from '@/contexts/evaluations-context'
import type { RubricItem, Source, PolicyGrounding } from '@/lib/types'

function getRatingColor(score: number) {
  if (score >= 8.5) return 'text-success'
  if (score >= 7.5) return 'text-secondary'
  if (score >= 6.5) return 'text-warning'
  return 'text-primary'
}

function getAvg(items: RubricItem[]) {
  if (items.length === 0) return 0
  return items.reduce((sum, item) => sum + item.score, 0) / items.length
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const pct = (score / 10) * 100
  const color =
    score >= 8.5 ? 'bg-success' :
    score >= 7.5 ? 'bg-secondary' :
    score >= 6.5 ? 'bg-warning' :
    'bg-primary'

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-muted-foreground w-44 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-muted/30 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-lg font-bold tabular-nums w-16 text-right ${getRatingColor(score)}`}>
        {score.toFixed(1)}
      </span>
    </div>
  )
}

function RubricTable({
  items,
  onSourceClick,
  onRowClick,
}: {
  items: RubricItem[]
  onSourceClick: (source: Source) => void
  onRowClick?: (item: RubricItem) => void
}) {
  return (
    <Table>
      <TableHeader className="bg-muted/30">
        <TableRow className="border-b-2 border-b-secondary">
          <TableHead className="py-2.5 font-semibold text-foreground">Category</TableHead>
          <TableHead className="py-2.5 font-semibold text-foreground">Rating</TableHead>
          <TableHead className="py-2.5 font-semibold text-foreground">Score</TableHead>
          <TableHead className="py-2.5 font-semibold text-foreground text-right">Sources</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow
            key={index}
            className={`hover:bg-muted/5 border-b border-border ${onRowClick && item.policyGrounding ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick && item.policyGrounding && onRowClick(item)}
          >
            <TableCell className="py-2 font-medium text-foreground text-sm">
              {item.category}
            </TableCell>
            <TableCell className="py-2 text-sm font-medium">
              {item.rating}
            </TableCell>
            <TableCell className="py-2 text-sm font-semibold">
              <span className={getRatingColor(item.score)}>
                {item.score}/10
              </span>
            </TableCell>
            <TableCell className="py-2 text-right">
              {item.sources && item.sources.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary px-3 py-1.5 rounded-full border border-secondary/20 hover:border-secondary/40 bg-secondary/5 hover:bg-secondary/10 transition-all">
                      <LinkIcon className="w-3 h-3" />
                      {item.sources.length} sources
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sources</p>
                    <div className="space-y-1.5">
                      {item.sources.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => onSourceClick(source)}
                          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-muted/20 w-full text-left"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          {source.name}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function CompanyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { getEvaluation } = useEvaluations()
  const evaluation = getEvaluation(id) ?? null
  const loading = false
  const error = evaluation ? '' : 'Evaluation not found'
  const [previewSource, setPreviewSource] = useState<Source | null>(null)
  const [previewPolicyGrounding, setPreviewPolicyGrounding] = useState<PolicyGrounding | null>(null)

  const handlePolicyItemClick = (item: RubricItem) => {
    if (item.policyGrounding) {
      setPreviewPolicyGrounding(item.policyGrounding)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading evaluation...</span>
          </div>
        </main>
      </div>
    )
  }

  if (error || !evaluation) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-[74%] mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-secondary hover:text-primary mb-6 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <p className="text-muted-foreground">{error || 'Evaluation not found'}</p>
          </div>
        </main>
      </div>
    )
  }

  // Extract data from evaluation
  const results = evaluation.evaluation_results?.[0]
  const yourPolicyItems: RubricItem[] = results?.rubric_results?.yourPolicyConcerns || []
  const generalPolicyItems: RubricItem[] = results?.rubric_results?.generalPolicyConcerns || []
  const scores = results?.scores

  const yourPolicyAvg = scores?.yourPolicyAvg ?? getAvg(yourPolicyItems)
  const generalPolicyAvg = scores?.generalPolicyAvg ?? getAvg(generalPolicyItems)
  const finalScore = scores?.finalScore ?? (yourPolicyAvg + generalPolicyAvg) / 2

  const companyName = evaluation.company_name || 'Unknown Company'
  const status = evaluation.status === 'completed' ? 'Completed' : evaluation.status === 'running' ? 'In Progress' : 'Failed'
  const riskLevel = finalScore >= 7.5 ? 'Low' : finalScore >= 5.0 ? 'Medium' : 'High'

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-[74%] mx-auto">
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
            <h1 className="text-3xl font-bold text-foreground mb-2">{companyName}</h1>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <span className={`text-sm font-semibold ${
                  riskLevel === 'Low' ? 'text-success' :
                  riskLevel === 'Medium' ? 'text-warning' :
                  'text-primary'
                }`}>
                  {riskLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="text-sm font-semibold text-secondary">{status}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Your Policy Concerns */}
          {yourPolicyItems.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-foreground">Your Policy Concerns</h2>
                <span className={`text-sm font-bold ${getRatingColor(yourPolicyAvg)}`}>
                  {yourPolicyAvg.toFixed(1)}/10
                </span>
              </div>
              <Card className="border-l-4 border-l-primary rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <RubricTable
                    items={yourPolicyItems}
                    onSourceClick={setPreviewSource}
                    onRowClick={handlePolicyItemClick}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Section 2: General Policy Concerns */}
          {generalPolicyItems.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-foreground">General Policy Concerns</h2>
                <span className={`text-sm font-bold ${getRatingColor(generalPolicyAvg)}`}>
                  {generalPolicyAvg.toFixed(1)}/10
                </span>
              </div>
              <Card className="border-l-4 border-l-secondary rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <RubricTable items={generalPolicyItems} onSourceClick={setPreviewSource} />
                </div>
              </Card>
            </div>
          )}

          {/* Score Summary */}
          <Card className="rounded-2xl p-6 border-t-4 border-t-primary">
            <h2 className="text-lg font-bold text-foreground mb-4">Score Summary</h2>
            <div className="space-y-3">
              <ScoreBar label="Your Policy Concerns" score={yourPolicyAvg} />
              <ScoreBar label="General Policy Concerns" score={generalPolicyAvg} />
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-foreground w-44 shrink-0">Final Score</span>
                  <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        finalScore >= 8.5 ? 'bg-success' :
                        finalScore >= 7.5 ? 'bg-secondary' :
                        finalScore >= 6.5 ? 'bg-warning' :
                        'bg-primary'
                      } transition-all`}
                      style={{ width: `${(finalScore / 10) * 100}%` }}
                    />
                  </div>
                  <span className={`text-2xl font-bold tabular-nums w-16 text-right ${getRatingColor(finalScore)}`}>
                    {finalScore.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Source Preview Dialog */}
      <SourcePreviewDialog
        source={previewSource}
        policyGrounding={previewPolicyGrounding}
        open={!!previewSource || !!previewPolicyGrounding}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewSource(null)
            setPreviewPolicyGrounding(null)
          }
        }}
      />
    </div>
  )
}
