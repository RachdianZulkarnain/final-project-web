"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMonthlyAnalytics } from "@/app/dashboard/_hooks/useGetMonthlyChart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(`${currentYear}`);

  const { data: chartData = [], isLoading } = useGetMonthlyAnalytics(selectedYear);

  const years = React.useMemo(() => {
    return Array.from({ length: currentYear - 2000 + 1 }, (_, i) =>
      String(currentYear - i)
    );
  }, [currentYear]);

  return (
    <Card className="border-4 border-gray-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] @container/card">
      <CardHeader className="px-6 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <CardTitle className="text-xl font-black text-gray-900 tracking-wide">
            Revenue Overview
          </CardTitle>
          <CardAction>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32 h-10 border-2 border-gray-900 rounded-none bg-white text-sm font-bold text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="text-sm font-semibold"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-6 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-sm font-medium fill-gray-700"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 120000000]}
              tickFormatter={(value) => `${value / 1_000_000}M`}
              tickMargin={8}
              className="text-sm font-medium fill-gray-700"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value) =>
                    `${Number(value).toLocaleString("en-US")} IDR`
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--primary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
