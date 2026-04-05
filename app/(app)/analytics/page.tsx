"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Users,
  MousePointerClick,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Loader2,
  RefreshCw,
  Brain,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Stats {
  total: {
    pageViews: number
    signups: number
    generateClicks: number
    upgrades: number
    conversionRate: string
    upgradeRate: string
  }
  today: {
    pageViews: number
    signups: number
    generateClicks: number
    upgrades: number
  }
  week: {
    pageViews: number
    signups: number
    generateClicks: number
    upgrades: number
  }
  dailyData: Array<{
    date: string
    pageViews: number
    signups: number
    upgrades: number
  }>
}

interface CTAVariant {
  id: string
  text: string
  clicks: number
  conversions: number
}

interface GrowthAnalysis {
  summary: string
  contentSuggestions: Array<{
    angle: string
    reason: string
    priority: string
  }>
  landingPageTweaks: Array<{
    element: string
    suggestion: string
    expectedImpact: string
  }>
  ctaRecommendations: Array<{
    current: string
    suggested: string
    rationale: string
  }>
  urgentActions: string[]
  growthScore: number
}

// Chart colors computed as hex values (not CSS variables)
const CHART_COLORS = {
  primary: "#ec4899",
  accent: "#14b8a6", 
  success: "#22c55e",
  warning: "#eab308",
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [ctaVariants, setCTAVariants] = useState<CTAVariant[]>([])
  const [analysis, setAnalysis] = useState<GrowthAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/growth/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setCTAVariants(data.ctaVariants)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const runAnalysis = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/growth/analyze', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('Failed to run analysis:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const pieData = ctaVariants.map((v, i) => ({
    name: v.text,
    value: v.clicks,
    color: [CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.success, CHART_COLORS.warning][i % 4],
  }))

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Growth Analytics</h1>
          <p className="text-muted-foreground">Track your funnel performance and optimize conversions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="btn-gradient" onClick={runAnalysis} disabled={analyzing}>
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                AI Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cosmic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-3xl font-bold">{stats?.total.pageViews.toLocaleString()}</p>
                <p className="mt-1 flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  +{stats?.week.pageViews} this week
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Eye className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Signups</p>
                <p className="text-3xl font-bold">{stats?.total.signups.toLocaleString()}</p>
                <p className="mt-1 flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  {stats?.total.conversionRate}% conversion
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Generate Clicks</p>
                <p className="text-3xl font-bold">{stats?.total.generateClicks.toLocaleString()}</p>
                <p className="mt-1 flex items-center text-sm text-muted-foreground">
                  <MousePointerClick className="mr-1 h-4 w-4" />
                  +{stats?.week.generateClicks} this week
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                <MousePointerClick className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cosmic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upgrades</p>
                <p className="text-3xl font-bold">{stats?.total.upgrades.toLocaleString()}</p>
                <p className="mt-1 flex items-center text-sm text-green-500">
                  <CreditCard className="mr-1 h-4 w-4" />
                  {stats?.total.upgradeRate}% upgrade rate
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cta">CTA Performance</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Funnel Chart */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Page views, signups, and upgrades over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.dailyData.map(d => ({ ...d, date: formatDate(d.date) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="pageViews"
                        name="Page Views"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS.primary }}
                      />
                      <Line
                        type="monotone"
                        dataKey="signups"
                        name="Signups"
                        stroke={CHART_COLORS.accent}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS.accent }}
                      />
                      <Line
                        type="monotone"
                        dataKey="upgrades"
                        name="Upgrades"
                        stroke={CHART_COLORS.success}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS.success }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Track drop-off at each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Page Views', value: stats?.total.pageViews || 0, percent: 100 },
                    { label: 'Signups', value: stats?.total.signups || 0, percent: parseFloat(stats?.total.conversionRate || '0') },
                    { label: 'Activated (Generated)', value: stats?.total.generateClicks || 0, percent: stats?.total.signups ? (stats.total.generateClicks / stats.total.signups * 100) : 0 },
                    { label: 'Upgraded', value: stats?.total.upgrades || 0, percent: parseFloat(stats?.total.upgradeRate || '0') },
                  ].map((stage, i) => (
                    <div key={i}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{stage.label}</span>
                        <span className="text-muted-foreground">{stage.value.toLocaleString()} ({stage.percent.toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted/30">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                          style={{ width: `${Math.min(stage.percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cta" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* CTA Performance Table */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>CTA A/B Test Results</CardTitle>
                <CardDescription>Compare conversion rates across CTA variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ctaVariants.map((variant, i) => {
                    const cvr = variant.clicks > 0 ? (variant.conversions / variant.clicks * 100) : 0
                    const isWinner = i === ctaVariants.reduce((best, v, idx) => {
                      const bestCvr = ctaVariants[best].clicks > 0 ? ctaVariants[best].conversions / ctaVariants[best].clicks : 0
                      const currCvr = v.clicks > 0 ? v.conversions / v.clicks : 0
                      return currCvr > bestCvr ? idx : best
                    }, 0)

                    return (
                      <div key={variant.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                        <div className="flex items-center gap-3">
                          {isWinner && <Badge className="bg-green-500/20 text-green-500">Winner</Badge>}
                          <span className="font-medium">&quot;{variant.text}&quot;</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground">Clicks</p>
                            <p className="font-bold">{variant.clicks}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Conversions</p>
                            <p className="font-bold">{variant.conversions}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">CVR</p>
                            <p className="font-bold text-primary">{cvr.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CTA Distribution Pie */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Click Distribution</CardTitle>
                <CardDescription>Share of clicks per CTA variant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a2e',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {!analysis ? (
            <Card className="cosmic-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Brain className="mb-4 h-16 w-16 text-primary/50" />
                <h3 className="mb-2 text-xl font-semibold">AI Growth Analysis</h3>
                <p className="mb-6 text-center text-muted-foreground">
                  Run AI analysis to get personalized recommendations for improving your growth metrics.
                </p>
                <Button className="btn-gradient" onClick={runAnalysis} disabled={analyzing}>
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing your data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Run AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Growth Score */}
              <Card className="cosmic-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Growth Health Score</h3>
                      <p className="text-muted-foreground">{analysis.summary}</p>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                      <span className="text-2xl font-bold text-white">{analysis.growthScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Actions */}
              {analysis.urgentActions.length > 0 && (
                <Card className="cosmic-card border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-500">
                      <AlertCircle className="h-5 w-5" />
                      Urgent Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.urgentActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="mt-1 h-4 w-4 text-yellow-500" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Content Suggestions */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle>Content Angles to Explore</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.contentSuggestions.map((suggestion, i) => (
                        <div key={i} className="rounded-lg border border-border/50 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">{suggestion.angle}</span>
                            <Badge variant={suggestion.priority === 'high' ? 'default' : 'secondary'}>
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Landing Page Tweaks */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle>Landing Page Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.landingPageTweaks.map((tweak, i) => (
                        <div key={i} className="rounded-lg border border-border/50 p-4">
                          <p className="mb-1 font-medium">{tweak.element}</p>
                          <p className="mb-2 text-sm">{tweak.suggestion}</p>
                          <p className="flex items-center text-xs text-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {tweak.expectedImpact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Recommendations */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle>CTA Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {analysis.ctaRecommendations.map((rec, i) => (
                      <div key={i} className="rounded-lg border border-border/50 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">{rec.current}</span>
                          <ArrowRight className="h-4 w-4" />
                          <span className="font-medium text-primary">{rec.suggested}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.rationale}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
