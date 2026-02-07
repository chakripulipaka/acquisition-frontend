'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { MOCK_EVALUATIONS } from '@/lib/mock-data'

export interface SupabaseEvaluation {
  id: string
  company_name: string
  company_info: any
  policy_rubric_id: string
  status: string
  created_at: string
  completed_at: string | null
  policy_rubrics?: { id: string; name: string; created_at: string }
  evaluation_results?: Array<{
    id: string
    rubric_results: any
    scores: any
    created_at: string
  }>
}

interface EvaluationsContextType {
  evaluations: SupabaseEvaluation[]
  loading: boolean
  refreshEvaluations: () => Promise<void>
  getEvaluation: (id: string) => SupabaseEvaluation | undefined
  addEvaluation: (evaluation: SupabaseEvaluation) => void
}

const EvaluationsContext = createContext<EvaluationsContextType | undefined>(undefined)

export function EvaluationsProvider({ children }: { children: React.ReactNode }) {
  const [localEvaluations, setLocalEvaluations] = useState<SupabaseEvaluation[]>([])
  const [loading, setLoading] = useState(false)

  const evaluations = [...localEvaluations, ...MOCK_EVALUATIONS]

  const refreshEvaluations = useCallback(async () => {
    // Mock data is always available — no API call needed
    setLoading(false)
  }, [])

  const getEvaluation = (id: string) => evaluations.find((e) => e.id === id)

  const addEvaluation = useCallback((evaluation: SupabaseEvaluation) => {
    setLocalEvaluations((prev) => [evaluation, ...prev])
  }, [])

  return (
    <EvaluationsContext.Provider
      value={{ evaluations, loading, refreshEvaluations, getEvaluation, addEvaluation }}
    >
      {children}
    </EvaluationsContext.Provider>
  )
}

export function useEvaluations() {
  const context = useContext(EvaluationsContext)
  if (!context) {
    throw new Error('useEvaluations must be used within EvaluationsProvider')
  }
  return context
}
