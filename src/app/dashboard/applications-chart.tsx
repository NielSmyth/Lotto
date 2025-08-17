"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ApplicationsPerDay } from "@/lib/types"

interface ApplicationsChartProps {
    data: ApplicationsPerDay[];
}

export default function ApplicationsChart({ data }: ApplicationsChartProps) {
    const chartConfig = {
        applications: {
            label: "Applications",
            color: "hsl(var(--primary))",
        },
    }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-applications)" radius={4} />
        </BarChart>
    </ChartContainer>
  )
}
