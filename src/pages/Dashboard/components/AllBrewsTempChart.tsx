import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useUser } from "@clerk/clerk-react";
import { useActiveBrewery } from "@/context/ActiveBreweryContext";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getBrewTempLogs } from "@/api/brew";
import { useIsMobile } from "@/hooks/use-mobile";

type Brew = {
  id: string;
  recipe_snapshot: { name: string };
};

type BrewTempLog = {
  recorded_at: string;
  temperature_celsius: number;
};

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "var(--primary)",
  },
};

export function AllBrewsTempChart() {
  const { isLoaded } = useUser();
  const { brewery } = useActiveBrewery();
  const isMobile = useIsMobile();

  const [brews, setBrews] = React.useState<Brew[]>([]);
  const [selectedBrewId, setSelectedBrewId] = React.useState<string | null>(
    null
  );
  const [logs, setLogs] = React.useState<BrewTempLog[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch brews
  React.useEffect(() => {
    if (!brewery?.id || !isLoaded) return;

    setBrews([]);
    setLogs([]);
    setSelectedBrewId(null);

    fetch(`${import.meta.env.VITE_API_URL}/brews?brewery_id=${brewery.id}`)
      .then((res) => res.json())
      .then((data: Brew[]) => {
        setBrews(data);
        if (data.length > 0) {
          setSelectedBrewId(data[0].id);
        }
      })
      .catch((err) => console.error("Error fetching brews:", err));
  }, [brewery?.id, isLoaded]);

  // Fetch temperature logs
  React.useEffect(() => {
    if (!selectedBrewId) {
      setLogs([]);
      return;
    }

    setLoading(true);
    getBrewTempLogs(selectedBrewId)
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error fetching logs:", err))
      .finally(() => setLoading(false));
  }, [selectedBrewId]);

  const data = React.useMemo(() => {
    return logs.map((log) => ({
      date: new Date(log.recorded_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: log.temperature_celsius,
    }));
  }, [logs]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>All Brew Logs</CardTitle>
        <CardDescription>
          Select a brew to view temperature logs
        </CardDescription>
        <div className="mt-4 min-h-[40px]">
          {brews.length > 0 ? (
            <Select
              onValueChange={setSelectedBrewId}
              value={selectedBrewId ?? undefined}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Brew" />
              </SelectTrigger>
              <SelectContent>
                {brews.map((brew) => (
                  <SelectItem key={brew.id} value={brew.id}>
                    {brew.recipe_snapshot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted-foreground text-sm">
              No brews available yet.
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="text-muted-foreground text-sm">Loading chart...</div>
        ) : brews.length === 0 ? null : logs.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No temperature data for selected brew.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="fillTemperature"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
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
                stroke="var(--primary)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
