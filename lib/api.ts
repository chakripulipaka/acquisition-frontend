const BACKEND_BASE = '/api/backend'

export interface UploadResult {
  documentId: string
  chunkCount: number
}

export interface GenerateRubricResult {
  rubricId: string
  rubric: unknown
  runId: string
}

export async function uploadDocument(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BACKEND_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Upload failed (${res.status})`)
  }

  const data = await res.json()
  return {
    documentId: data.document_id,
    chunkCount: data.chunk_count,
  }
}

export async function generateRubric(
  docIds: string[],
  purpose: string,
  targetEntityType: string,
): Promise<GenerateRubricResult> {
  const res = await fetch(`${BACKEND_BASE}/rubrics/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doc_ids: docIds,
      purpose,
      target_entity_type: targetEntityType,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Rubric generation failed (${res.status})`)
  }

  const data = await res.json()
  return {
    rubricId: data.rubric_id,
    rubric: data.rubric,
    runId: data.run_id,
  }
}

// ---------- Policy rubric upload (uploads file + generates rubric + stores in Supabase) ----------

export interface PolicyRubricUploadResult {
  policyRubric: {
    id: string
    name: string
    rubric: any
    created_at: string
  }
  duration_ms: number
}

export async function uploadPolicyAndGenerateRubric(
  file: File,
  name?: string,
): Promise<PolicyRubricUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  if (name) formData.append('name', name)

  const res = await fetch(`${BACKEND_BASE}/policy-rubrics/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Policy upload failed (${res.status})`)
  }

  return res.json()
}

// ---------- Evaluations ----------

export interface RunEvaluationResult {
  success: boolean
  evaluation_id: string
  scores: {
    yourPolicyAvg: number
    generalPolicyAvg: number
    finalScore: number
    recommendation: string
  }
  duration_ms: number
}

export async function runEvaluation(params: {
  company_name: string
  company_info: Record<string, any>
  policy_rubric_id: string
}): Promise<RunEvaluationResult> {
  const res = await fetch(`${BACKEND_BASE}/evaluations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Evaluation failed (${res.status})`)
  }

  return res.json()
}

export async function fetchEvaluations(): Promise<any[]> {
  const res = await fetch(`${BACKEND_BASE}/evaluations`)
  if (!res.ok) {
    throw new Error('Failed to fetch evaluations')
  }
  const data = await res.json()
  return data.evaluations || []
}

export async function fetchEvaluationById(id: string): Promise<any> {
  const res = await fetch(`${BACKEND_BASE}/evaluations/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch evaluation')
  }
  const data = await res.json()
  return data.evaluation
}
