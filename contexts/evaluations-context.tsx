'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchEvaluations } from '@/lib/api'

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
}

const EvaluationsContext = createContext<EvaluationsContextType | undefined>(undefined)

export function EvaluationsProvider({ children }: { children: React.ReactNode }) {
  const [evaluations, setEvaluations] = useState<SupabaseEvaluation[]>([])
  const [loading, setLoading] = useState(true)

  const refreshEvaluations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchEvaluations()
      setEvaluations(data)
    } catch (error) {
      console.error('Failed to fetch evaluations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshEvaluations()
  }, [refreshEvaluations])

  const getEvaluation = (id: string) => evaluations.find((e) => e.id === id)

  return (
    <EvaluationsContext.Provider
      value={{ evaluations, loading, refreshEvaluations, getEvaluation }}
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
