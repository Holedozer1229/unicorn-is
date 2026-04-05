"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface ChartData {
  date: string
  ideas: number
  plans: number
}

interface AnalyticsChartProps {
  data: ChartData[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar
            dataKey="ideas"
            name="Ideas Created"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="plans"
            name="Content Planned"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
