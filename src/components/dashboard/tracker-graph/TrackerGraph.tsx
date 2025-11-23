import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import colors from "tailwindcss/colors";

interface ChartDataPoint {
    date: string;
    easy: {
        uniqueSolved: number;
        numSolves: number;
    };
    medium: {
        uniqueSolved: number;
        numSolves: number;
    };
    hard: {
        uniqueSolved: number;
        numSolves: number;
    }
}

const chartData: ChartDataPoint[] = [
    { date: "2025-10-18", easy: { uniqueSolved: 1, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-19", easy: { uniqueSolved: 0, numSolves: 1 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-20", easy: { uniqueSolved: 1, numSolves: 3 }, medium: { uniqueSolved: 1, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-21", easy: { uniqueSolved: 0, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 1 } },
    { date: "2025-10-22", easy: { uniqueSolved: 2, numSolves: 3 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-23", easy: { uniqueSolved: 0, numSolves: 2 }, medium: { uniqueSolved: 1, numSolves: 2 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-24", easy: { uniqueSolved: 1, numSolves: 4 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 1, numSolves: 1 } },
    { date: "2025-10-25", easy: { uniqueSolved: 0, numSolves: 0 }, medium: { uniqueSolved: 0, numSolves: 0 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-26", easy: { uniqueSolved: 1, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-27", easy: { uniqueSolved: 0, numSolves: 3 }, medium: { uniqueSolved: 1, numSolves: 2 }, hard: { uniqueSolved: 0, numSolves: 1 } },
    { date: "2025-10-28", easy: { uniqueSolved: 2, numSolves: 3 }, medium: { uniqueSolved: 0, numSolves: 0 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-29", easy: { uniqueSolved: 0, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-30", easy: { uniqueSolved: 1, numSolves: 4 }, medium: { uniqueSolved: 1, numSolves: 2 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-10-31", easy: { uniqueSolved: 0, numSolves: 1 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-01", easy: { uniqueSolved: 1, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 0 }, hard: { uniqueSolved: 1, numSolves: 1 } },
    { date: "2025-11-02", easy: { uniqueSolved: 0, numSolves: 1 }, medium: { uniqueSolved: 0, numSolves: 0 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-03", easy: { uniqueSolved: 2, numSolves: 3 }, medium: { uniqueSolved: 1, numSolves: 2 }, hard: { uniqueSolved: 0, numSolves: 1 } },
    { date: "2025-11-04", easy: { uniqueSolved: 0, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-05", easy: { uniqueSolved: 1, numSolves: 3 }, medium: { uniqueSolved: 0, numSolves: 2 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-06", easy: { uniqueSolved: 0, numSolves: 1 }, medium: { uniqueSolved: 0, numSolves: 0 }, hard: { uniqueSolved: 0, numSolves: 1 } },
    { date: "2025-11-07", easy: { uniqueSolved: 1, numSolves: 4 }, medium: { uniqueSolved: 1, numSolves: 2 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-08", easy: { uniqueSolved: 0, numSolves: 1 }, medium: { uniqueSolved: 0, numSolves: 0 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-09", easy: { uniqueSolved: 1, numSolves: 3 }, medium: { uniqueSolved: 1, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 1 } },
    { date: "2025-11-10", easy: { uniqueSolved: 0, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-11", easy: { uniqueSolved: 2, numSolves: 3 }, medium: { uniqueSolved: 1, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-12", easy: { uniqueSolved: 0, numSolves: 1 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-13", easy: { uniqueSolved: 1, numSolves: 2 }, medium: { uniqueSolved: 1, numSolves: 2 }, hard: { uniqueSolved: 0, numSolves: 1 } },
    { date: "2025-11-14", easy: { uniqueSolved: 0, numSolves: 1 }, medium: { uniqueSolved: 0, numSolves: 0 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-15", easy: { uniqueSolved: 1, numSolves: 3 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
    { date: "2025-11-16", easy: { uniqueSolved: 0, numSolves: 2 }, medium: { uniqueSolved: 0, numSolves: 1 }, hard: { uniqueSolved: 0, numSolves: 0 } },
];



const chartConfig = {
    questions: {
        label: "Questions Solved",
    },
    easy: {
        label: "Easy Questions",
        color: colors.green[500],
    },
    medium: {
        label: "Medium Questions",
        color: colors.yellow[500],
    },
    hard: {
        label: "Hard Questions",
        color: colors.red[500],
    },
} as const satisfies ChartConfig;

export function TrackerGraph() {
    // Type: "7d" | "30d" | "90d"
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("90d");
    // Type: "uniqueSolved" | "numSolves"
    const [chartMetric, setChartMetric] = useState<"uniqueSolved" | "numSolves">("uniqueSolved");

    // First filter by time range
    const filteredByTime = chartData.filter((item) => {
        const date = new Date(item.date);
        const now = new Date();

        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(now.getDate() - days);

        return date >= startDate && date <= now;
    })

    // Then map to chartMetric; output should match what chart expects:
    // { date: string; easy: number; medium: number; hard: number; }[]
    const finalChartData = filteredByTime.map((item) => ({
        date: item.date,
        easy: item.easy[chartMetric],
        medium: item.medium[chartMetric],
        hard: item.hard[chartMetric],
    }));

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Tracker Graph</CardTitle>
                    <CardDescription>Showing number of Leetcode questions solved over time</CardDescription>
                </div>

                {/* Select time range */}
                <Select value={timeRange} onValueChange={(value: string) => setTimeRange(value as "7d" | "30d" | "90d")}>
                    <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select time range">
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Select chart metric */}
                <Select value={chartMetric} onValueChange={(value: string) => setChartMetric(value as "uniqueSolved" | "numSolves")}>
                    <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select chart metric">
                        <SelectValue placeholder="Unique Solved" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="uniqueSolved" className="rounded-lg">
                            Unique Solved
                        </SelectItem>
                        <SelectItem value="numSolves" className="rounded-lg">
                            Number Solved
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={finalChartData}>
                        <defs>
                            <linearGradient id="fillEasy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors.green[500]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={colors.green[500]} stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillMedium" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors.yellow[500]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={colors.yellow[500]} stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillHard" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors.red[500]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={colors.red[500]} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric"
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric"
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="easy"
                            type="natural"
                            fill="url(#fillEasy)"
                            stroke={colors.green[500]}
                            stackId="a"
                        />
                        <Area
                            dataKey="medium"
                            type="natural"
                            fill="url(#fillMedium)"
                            stroke={colors.yellow[500]}
                            stackId="a"
                        />
                        <Area
                            dataKey="hard"
                            type="natural"
                            fill="url(#fillHard)"
                            stroke={colors.red[500]}
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}