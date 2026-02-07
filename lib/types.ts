export interface SourceHighlight {
  startIndex: number
  endIndex: number
}

export interface Source {
  id: string
  name: string
  url: string
  publisher: string
  publishedDate: string
  excerptText: string
  highlights: SourceHighlight[]
  pageNumber?: number
  fullText?: string
}

export interface PolicyPage {
  pageNumber: number
  content: string
}

export interface PolicyGrounding {
  documentName: string
  quote: string
  context: string
  pageNumber?: number
  extendedContext?: {
    pages: PolicyPage[]
    highlightPageIndex: number
  }
}

export interface RubricItem {
  category: string
  rating: string
  score: number
  sources: Source[]
  policyGrounding?: PolicyGrounding
}

// Backend rubric types (from API response)
export interface BackendGroundingRef {
  document_id: string
  chunk_id: string
  quote: string
}

export interface BackendEvidenceRequirement {
  id: string
  evidence_type: string
  description: string
  acceptance_criteria: string[]
  missing_data_question: string
  min_count?: number
}

export interface BackendRubricItem {
  id: string
  title: string
  description?: string
  severity: string
  weight: number
  grounding_refs: BackendGroundingRef[]
  evidence_requirements: BackendEvidenceRequirement[]
  followups_if_unknown?: string[]
  category_id?: string
}

export interface BackendRubricCategory {
  id: string
  title: string
  description?: string
  items: BackendRubricItem[]
}

export interface BackendRubric {
  id: string
  name: string
  description?: string
  purpose: string
  target_entity_type: string
  evaluation_type: string
  decision_impact: string
  categories: BackendRubricCategory[]
  sources?: { id: string; label: string }[]
  created_at?: string
}

// Combined evaluation result — what the future agent will consume
export interface EvaluationResult {
  id: string
  company: {
    name: string
    website: string
    industry: string
    additionalInfo: string
  }
  rubric: BackendRubric
  rubricId: string
  runId: string
  documentId: string
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
  error?: string
}
// TartanHacks Tool Evidence Metadata
export interface ToolEvidenceMetadata {
  tool_name: string
  tool_result: {
    status: 'pass' | 'warn' | 'fail' | 'unknown' | 'needs_info'
    finding: string
    details: Record<string, unknown>
    confidence: number
    evidence: Array<{
      source_name: string
      source_url: string
      excerpt: string
    }>
  }
  duration_ms: number
}

export interface ToolResultDisplay {
  toolName: string
  status: 'pass' | 'warn' | 'fail' | 'unknown' | 'needs_info'
  finding: string
  confidence: number
  durationMs: number
  details: Record<string, unknown>
}
