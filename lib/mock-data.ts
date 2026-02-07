import type { SupabaseEvaluation } from '@/contexts/evaluations-context'
import type { RubricItem, Source, PolicyGrounding } from '@/lib/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function fixedDate(day: 6 | 7, hour: number) {
  return `2026-02-0${day}T${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00.000Z`
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function randScore(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10
}

// ── Category / Source Pools ──────────────────────────────────────────────────

const CATEGORIES = [
  'Data Privacy & Protection',
  'Anti-Money Laundering (AML)',
  'Know Your Customer (KYC)',
  'Cybersecurity Controls',
  'Financial Reporting Transparency',
  'Regulatory Compliance History',
  'Environmental Compliance',
  'Corporate Governance',
  'Sanctions Screening',
  'Beneficial Ownership Disclosure',
  'Supply Chain Due Diligence',
  'Fraud Prevention Controls',
  'Consumer Protection Standards',
  'Workplace Safety Compliance',
  'Tax Compliance',
]

const RATINGS_HIGH = ['Compliant', 'Fully Compliant', 'Strong']
const RATINGS_MED = ['Partially Compliant', 'Adequate', 'Needs Improvement']
const RATINGS_LOW = ['Non-Compliant', 'Insufficient', 'Critical Gap']

function ratingForScore(score: number) {
  if (score >= 7.5) return pick(RATINGS_HIGH)
  if (score >= 5.0) return pick(RATINGS_MED)
  return pick(RATINGS_LOW)
}

interface SourceTemplate {
  name: string
  url: string
  publisher: string
  excerpt: string
}

const SOURCE_TEMPLATES: SourceTemplate[] = [
  {
    name: 'SEC Filing 10-K Annual Report',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar',
    publisher: 'U.S. Securities and Exchange Commission',
    excerpt:
      'The company maintains internal controls over financial reporting in accordance with Section 404 of the Sarbanes-Oxley Act. Management has assessed the effectiveness of these controls and found them to be operating as designed.',
  },
  {
    name: 'GDPR Compliance Assessment Report',
    url: 'https://gdpr-info.eu/art-30-gdpr',
    publisher: 'European Data Protection Board',
    excerpt:
      'Data processing activities are documented as required under Article 30. The controller maintains records of processing activities including purposes, categories of data subjects, and anticipated time limits for erasure.',
  },
  {
    name: 'Bloomberg Industry Analysis',
    url: 'https://www.bloomberg.com/research',
    publisher: 'Bloomberg LP',
    excerpt:
      'The company has demonstrated consistent revenue growth of 12% year-over-year with a strong balance sheet position. Debt-to-equity ratio remains within industry benchmarks at 0.45x.',
  },
  {
    name: 'Dun & Bradstreet Business Profile',
    url: 'https://www.dnb.com/business-directory',
    publisher: 'Dun & Bradstreet',
    excerpt:
      'Business credit score of 82 out of 100 indicates low financial risk. Payment history shows consistent on-time payments with no delinquencies reported in the past 24 months.',
  },
  {
    name: 'Reuters Market Intelligence Report',
    url: 'https://www.reuters.com/markets',
    publisher: 'Reuters',
    excerpt:
      'Market analysts note the firm has maintained a strong competitive position in its core markets. Regulatory filings indicate no pending enforcement actions or material litigation.',
  },
  {
    name: 'FinCEN BSA Filing Review',
    url: 'https://www.fincen.gov/resources/filing-information',
    publisher: 'Financial Crimes Enforcement Network',
    excerpt:
      'Bank Secrecy Act compliance review indicates proper filing of Currency Transaction Reports (CTRs) and Suspicious Activity Reports (SARs). No deficiencies noted in the most recent examination cycle.',
  },
  {
    name: 'OFAC Sanctions Screening Results',
    url: 'https://sanctionssearch.ofac.treas.gov',
    publisher: 'U.S. Department of the Treasury',
    excerpt:
      'Screening against the Specially Designated Nationals (SDN) list and all OFAC sanctions programs returned no matches. All beneficial owners and key management personnel cleared.',
  },
  {
    name: 'ISO 27001 Certification Report',
    url: 'https://www.iso.org/isoiec-27001-information-security',
    publisher: 'International Organization for Standardization',
    excerpt:
      'The organization has achieved ISO 27001:2022 certification for its information security management system. The scope covers all critical business operations and data processing facilities.',
  },
  {
    name: 'EPA Environmental Compliance Record',
    url: 'https://echo.epa.gov/facilities',
    publisher: 'U.S. Environmental Protection Agency',
    excerpt:
      'Facility inspection records show compliance with all applicable environmental regulations. No significant violations reported in the past five years. All required permits are current.',
  },
  {
    name: 'OSHA Workplace Safety Audit',
    url: 'https://www.osha.gov/establishments',
    publisher: 'Occupational Safety and Health Administration',
    excerpt:
      'Most recent workplace safety inspection found no serious violations. The company maintains a Total Recordable Incident Rate (TRIR) of 1.2, well below the industry average of 3.1.',
  },
  {
    name: 'Moody\'s Credit Assessment',
    url: 'https://www.moodys.com/research',
    publisher: 'Moody\'s Investors Service',
    excerpt:
      'Current credit rating of Baa1 with a stable outlook. Strong cash flow generation and prudent capital allocation support the rating. Liquidity position remains adequate with $450M in available credit facilities.',
  },
  {
    name: 'PwC Annual Audit Report',
    url: 'https://www.pwc.com/audit-assurance',
    publisher: 'PricewaterhouseCoopers',
    excerpt:
      'In our opinion, the financial statements present fairly, in all material respects, the financial position of the company. No material weaknesses in internal controls were identified.',
  },
  {
    name: 'World Bank Governance Indicators',
    url: 'https://info.worldbank.org/governance/wgi',
    publisher: 'The World Bank Group',
    excerpt:
      'The jurisdiction of incorporation scores in the 85th percentile for rule of law and 78th percentile for control of corruption, indicating a favorable regulatory environment.',
  },
  {
    name: 'S&P Global ESG Assessment',
    url: 'https://www.spglobal.com/esg',
    publisher: 'S&P Global',
    excerpt:
      'ESG score of 72 out of 100 places the company in the top quartile of its industry peers. Notable strengths in governance practices and environmental management programs.',
  },
  {
    name: 'Transparency International CPI Report',
    url: 'https://www.transparency.org/en/cpi',
    publisher: 'Transparency International',
    excerpt:
      'Operations are primarily located in jurisdictions with a Corruption Perceptions Index score above 65, indicating relatively low levels of perceived public sector corruption.',
  },
]

const POLICY_QUOTES = [
  {
    doc: 'Customer Acquisition Policy v4.2',
    quote: 'All prospective customers must undergo enhanced due diligence screening prior to onboarding, including verification of beneficial ownership structure and source of funds.',
    context: 'Section 3.1 — Customer Due Diligence Requirements',
  },
  {
    doc: 'AML/KYC Compliance Manual',
    quote: 'Transaction monitoring systems shall flag any activity that deviates from established customer profiles, including unusual transaction volumes, frequency, or geographic patterns.',
    context: 'Section 5.4 — Ongoing Monitoring',
  },
  {
    doc: 'Data Protection & Privacy Policy',
    quote: 'Personal data collected during the onboarding process must be processed in accordance with applicable data protection regulations and retained only for the minimum period required by law.',
    context: 'Section 2.3 — Data Minimization',
  },
  {
    doc: 'Third-Party Risk Management Framework',
    quote: 'Critical third-party relationships must be subject to annual risk assessments, including financial stability review, cybersecurity posture evaluation, and compliance verification.',
    context: 'Section 4.1 — Vendor Assessment',
  },
  {
    doc: 'Enterprise Risk Management Policy',
    quote: 'Risk appetite statements shall be reviewed quarterly by the Board Risk Committee and updated to reflect changes in the operating environment and strategic objectives.',
    context: 'Section 1.2 — Risk Governance',
  },
  {
    doc: 'Information Security Policy',
    quote: 'All systems processing sensitive data must implement multi-factor authentication, encryption at rest and in transit, and maintain audit logs for a minimum of twelve months.',
    context: 'Section 6.1 — Technical Controls',
  },
  {
    doc: 'Corporate Governance Charter',
    quote: 'The board shall maintain an independent audit committee comprising at least three non-executive directors with relevant financial expertise.',
    context: 'Section 2.5 — Board Composition',
  },
  {
    doc: 'Environmental & Social Responsibility Policy',
    quote: 'Supply chain partners must demonstrate compliance with internationally recognized labor standards and environmental management practices as a condition of continued engagement.',
    context: 'Section 3.3 — Supply Chain Standards',
  },
]

// ── Builder Functions ────────────────────────────────────────────────────────

function buildSource(companyName: string): Source {
  const tpl = pick(SOURCE_TEMPLATES)
  return {
    id: uuid(),
    name: tpl.name,
    url: tpl.url,
    publisher: tpl.publisher,
    publishedDate: fixedDate(Math.random() > 0.5 ? 7 : 6, Math.floor(Math.random() * 24)),
    excerptText: tpl.excerpt,
    highlights: [{ startIndex: 0, endIndex: Math.min(60, tpl.excerpt.length) }],
    pageNumber: Math.floor(Math.random() * 20) + 1,
  }
}

function buildPolicyGrounding(): PolicyGrounding {
  const pq = pick(POLICY_QUOTES)
  return {
    documentName: pq.doc,
    quote: pq.quote,
    context: pq.context,
    pageNumber: Math.floor(Math.random() * 15) + 1,
    extendedContext: {
      pages: [
        {
          pageNumber: Math.floor(Math.random() * 15) + 1,
          content: `${pq.context}\n\n${pq.quote}\n\nThis requirement applies to all business units and must be implemented in accordance with the timelines specified in Appendix A. Exceptions require written approval from the Chief Compliance Officer.`,
        },
      ],
      highlightPageIndex: 0,
    },
  }
}

function buildRubricItems(
  companyName: string,
  count: number,
  scoreMin: number,
  scoreMax: number,
): RubricItem[] {
  const cats = pickN(CATEGORIES, count)
  return cats.map((category) => {
    const score = randScore(scoreMin, scoreMax)
    const sourceCount = Math.floor(Math.random() * 3) + 2
    return {
      category,
      rating: ratingForScore(score),
      score,
      sources: Array.from({ length: sourceCount }, () => buildSource(companyName)),
      policyGrounding: Math.random() > 0.3 ? buildPolicyGrounding() : undefined,
    }
  })
}

function buildEvaluation(
  companyName: string,
  industry: string,
  website: string,
  policyScoreRange: [number, number],
  generalScoreRange: [number, number],
  day: 6 | 7,
  hour: number,
): SupabaseEvaluation {
  const evalId = uuid()
  const rubricId = uuid()
  const resultId = uuid()
  const createdAt = fixedDate(day, hour)

  const yourPolicyItems = buildRubricItems(companyName, 5 + Math.floor(Math.random() * 3), policyScoreRange[0], policyScoreRange[1])
  const generalPolicyItems = buildRubricItems(companyName, 5 + Math.floor(Math.random() * 3), generalScoreRange[0], generalScoreRange[1])

  const yourPolicyAvg = Math.round((yourPolicyItems.reduce((s, i) => s + i.score, 0) / yourPolicyItems.length) * 10) / 10
  const generalPolicyAvg = Math.round((generalPolicyItems.reduce((s, i) => s + i.score, 0) / generalPolicyItems.length) * 10) / 10
  const finalScore = Math.round(((yourPolicyAvg + generalPolicyAvg) / 2) * 10) / 10

  return {
    id: evalId,
    company_name: companyName,
    company_info: { website, industry, additionalInfo: '' },
    policy_rubric_id: rubricId,
    status: 'completed',
    created_at: createdAt,
    completed_at: createdAt,
    policy_rubrics: {
      id: rubricId,
      name: `${companyName} Compliance Policy`,
      created_at: createdAt,
    },
    evaluation_results: [
      {
        id: resultId,
        rubric_results: {
          yourPolicyConcerns: yourPolicyItems,
          generalPolicyConcerns: generalPolicyItems,
        },
        scores: {
          yourPolicyAvg,
          generalPolicyAvg,
          finalScore,
          recommendation:
            finalScore >= 7.5 ? 'Low Risk — Proceed with standard onboarding' :
            finalScore >= 5.0 ? 'Medium Risk — Proceed with enhanced monitoring' :
            'High Risk — Escalate to compliance review',
        },
        created_at: createdAt,
      },
    ],
  }
}

// ── Seed Data ────────────────────────────────────────────────────────────────

export const MOCK_EVALUATIONS: SupabaseEvaluation[] = [
  // Feb 7 evaluations
  buildEvaluation('Ramp', 'Financial Services', 'https://ramp.com', [8.0, 9.5], [7.5, 9.0], 7, 14),
  buildEvaluation('Anduril Industries', 'Technology', 'https://anduril.com', [5.5, 7.5], [5.0, 7.8], 7, 13),
  buildEvaluation('Cerebras Systems', 'Technology', 'https://cerebras.net', [3.0, 5.5], [2.5, 5.0], 7, 11),
  buildEvaluation('Flexport', 'Transportation', 'https://flexport.com', [7.8, 9.8], [7.5, 9.5], 7, 10),
  buildEvaluation('Abridge', 'Healthcare', 'https://abridge.com', [5.0, 7.0], [5.5, 7.5], 7, 9),
  buildEvaluation('Faire', 'Retail', 'https://faire.com', [8.0, 9.5], [7.5, 9.0], 7, 8),
  buildEvaluation('Samsara', 'Manufacturing', 'https://samsara.com', [3.5, 5.5], [3.0, 5.0], 7, 7),
  buildEvaluation('Wiz', 'Technology', 'https://wiz.io', [8.5, 9.8], [8.0, 9.5], 7, 6),
  // Feb 6 evaluations
  buildEvaluation('Rippling', 'Technology', 'https://rippling.com', [7.5, 9.0], [8.0, 9.5], 6, 16),
  buildEvaluation('Brex', 'Financial Services', 'https://brex.com', [3.0, 5.0], [3.5, 5.5], 6, 15),
  buildEvaluation('Nuvocargo', 'Transportation', 'https://nuvocargo.com', [5.5, 7.5], [6.0, 8.0], 6, 13),
  buildEvaluation('Hims & Hers', 'Healthcare', 'https://forhims.com', [8.0, 9.5], [7.5, 9.0], 6, 11),
  buildEvaluation('Watershed', 'Energy', 'https://watershed.com', [5.0, 7.0], [5.5, 7.5], 6, 10),
  buildEvaluation('Loft Orbital', 'Manufacturing', 'https://loftorbital.com', [7.5, 9.0], [8.0, 9.5], 6, 9),
  buildEvaluation('Nowports', 'Transportation', 'https://nowports.com', [5.5, 7.5], [5.0, 7.0], 6, 8),
]

// ── Fake Policy Documents ────────────────────────────────────────────────────

export interface MockDocument {
  id: string
  name: string
  size: number
  uploadedAt: string
}

export const MOCK_DOCUMENTS: MockDocument[] = [
  { id: 'doc-001', name: 'Customer Acquisition Policy v4.2.pdf', size: 2458624, uploadedAt: '2/6/2026' },
  { id: 'doc-002', name: 'AML-KYC Compliance Manual 2026.pdf', size: 1843200, uploadedAt: '2/6/2026' },
  { id: 'doc-003', name: 'Third-Party Risk Management Framework.pdf', size: 3145728, uploadedAt: '2/6/2026' },
  { id: 'doc-004', name: 'Data Protection & Privacy Policy.docx', size: 987136, uploadedAt: '2/6/2026' },
  { id: 'doc-005', name: 'Enterprise Risk Management Policy.pdf', size: 1572864, uploadedAt: '2/6/2026' },
  { id: 'doc-006', name: 'Vendor Due Diligence Checklist.pdf', size: 524288, uploadedAt: '2/7/2026' },
  { id: 'doc-007', name: 'Information Security Policy v3.1.pdf', size: 2097152, uploadedAt: '2/7/2026' },
  { id: 'doc-008', name: 'Sanctions Screening Procedures.docx', size: 768000, uploadedAt: '2/7/2026' },
]

// ── Generator for new evaluations ────────────────────────────────────────────

export function generateFakeEvaluation(
  companyName: string,
  companyInfo: { website?: string; industry?: string; additionalInfo?: string },
): SupabaseEvaluation {
  const industry = companyInfo.industry || 'Other'
  const website = companyInfo.website || ''

  // Generate varied scores — slight randomness in the range
  const basePolicyMin = 4.5 + Math.random() * 3
  const basePolicyMax = basePolicyMin + 2 + Math.random() * 1.5
  const baseGeneralMin = 4.0 + Math.random() * 3
  const baseGeneralMax = baseGeneralMin + 2 + Math.random() * 1.5

  return buildEvaluation(
    companyName,
    industry,
    website,
    [basePolicyMin, Math.min(basePolicyMax, 10)],
    [baseGeneralMin, Math.min(baseGeneralMax, 10)],
    7,
    new Date().getHours(),
  )
}
