'use client'

import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const RISK_LEVELS = {
  Low: { color: 'bg-success/10', textColor: 'text-success', borderColor: 'border-success/20' },
  Medium: { color: 'bg-warning/10', textColor: 'text-warning', borderColor: 'border-warning/20' },
  High: { color: 'bg-primary/10', textColor: 'text-primary', borderColor: 'border-primary/20' },
}

export default function EvaluationResult() {
  const router = useRouter()

  const company = 'TechCorp Industries'
  const riskLevel = 'Low' as keyof typeof RISK_LEVELS
  const confidence = 94
  const greenFlags = 12
  const redFlags = 2
  const unknownFlags = 3

  const riskConfig = RISK_LEVELS[riskLevel]

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
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-secondary hover:text-primary mb-6 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Evaluations
            </button>

            {/* Main Header Section - Risk Assessment Card */}
            <Card className={`p-8 mb-8 border-l-4 border-l-primary shadow-sm rounded-2xl`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left: Company Info */}
                <div className="flex-1">
                  <p className="text-sm text-primary font-medium uppercase tracking-wide mb-2">
                    Evaluation Result
                  </p>
                  <h1 className="text-4xl font-bold text-foreground mb-4">{company}</h1>

                  {/* Satisfaction Rating Badge */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`${riskConfig.color} ${riskConfig.textColor} px-4 py-2 rounded-lg font-bold text-lg`}
                    >
                      {riskLevel} Satisfaction
                    </div>
                    <div
                      className={`${riskConfig.color} ${riskConfig.textColor} px-4 py-2 rounded-lg font-bold text-lg`}
                    >
                      {confidence}% Confidence
                    </div>
                  </div>
                </div>

                {/* Right: Visual Indicator */}
                <div className="flex flex-col items-center justify-center md:items-end">
                  <div
                    className={`w-24 h-24 rounded-full ${riskConfig.color} flex items-center justify-center mb-3`}
                  >
                    {riskLevel === 'Low' && (
                      <CheckCircle2 className={`w-12 h-12 ${riskConfig.textColor}`} />
                    )}
                    {riskLevel === 'Medium' && (
                      <AlertCircle className={`w-12 h-12 ${riskConfig.textColor}`} />
                    )}
                    {riskLevel === 'High' && (
                      <AlertCircle className={`w-12 h-12 ${riskConfig.textColor}`} />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${riskConfig.textColor}`}>
                    {riskLevel === 'Low' && 'Recommended'}
                    {riskLevel === 'Medium' && 'Requires Review'}
                    {riskLevel === 'High' && 'Not Recommended'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Green Flags Card */}
              <Card className="p-6 border-2 border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Green Flags</h3>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-700" />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-4xl font-bold text-green-700 mb-2">{greenFlags}</p>
                  <p className="text-sm text-green-600">Positive indicators identified</p>
                </div>
              </Card>

              {/* Red Flags Card */}
              <Card className="p-6 border-2 border-red-200 bg-red-50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Red Flags</h3>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-700" />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-4xl font-bold text-red-700 mb-2">{redFlags}</p>
                  <p className="text-sm text-red-600">Concerns identified</p>
                </div>
              </Card>

              {/* Unknown Info Card */}
              <Card className="p-6 border-2 border-amber-200 bg-amber-50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Unknown Info</h3>
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-amber-700" />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-4xl font-bold text-amber-700 mb-2">{unknownFlags}</p>
                  <p className="text-sm text-amber-600">Data gaps or uncertainties</p>
                </div>
              </Card>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detailed Analysis */}
              <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-foreground mb-3">Detailed Analysis</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  View comprehensive breakdown of financial metrics, market position, and risk factors.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  View Full Report
                </Button>
              </Card>

              {/* Export & Share */}
              <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-foreground mb-3">Export & Share</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Download as PDF or share this evaluation with your team members.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Export PDF
                </Button>
              </Card>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Evaluation completed on{' '}
                <span className="font-medium">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <Button
                onClick={() => router.push('/')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                New Evaluation
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
