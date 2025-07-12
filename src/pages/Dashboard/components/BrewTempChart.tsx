import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { BrewTempLog } from "@/api/types";
import { getBrewTempLogs } from "@/api/brew";

interface BrewTempChartProps {
  brewId: number;
}

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "var(--primary)",
  },
};

export function BrewTempChart({ brewId }: BrewTempChartProps) {
  const isMobile = useIsMobile();
  const [logs, setLogs] = React.useState<BrewTempLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const data = await getBrewTempLogs(String(brewId));
        if (isMounted) {
          setLogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch temperature logs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [brewId]);

  const data = React.useMemo(() => {
    return logs.map((log) => ({
      date: new Date(log.recorded_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: log.temperature_celsius,
    }));
  }, [logs]);

  if (loading && logs.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Brew Temperature</CardTitle>
        <CardDescription>Session temperature log</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value as string}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="temperature"
              type="natural"
              fill="url(#fillTemperature)"
              stroke="var(--color-temperature)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
