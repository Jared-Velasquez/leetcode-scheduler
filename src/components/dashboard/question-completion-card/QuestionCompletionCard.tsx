import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Difficulty } from "@/domain/problem";
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react";

export function QuestionCompletionCard({ difficultyType, uniqueCompleted, totalCompleted }: { difficultyType: Difficulty, uniqueCompleted: number, totalCompleted: number }) {
    const title = difficultyType === "EASY" ? "Easy Questions Completed" : difficultyType === "MEDIUM" ? "Medium Questions Completed" : "Hard Questions Completed";
    const diffColor = difficultyType === "EASY" ? "text-green-500" : difficultyType === "MEDIUM" ? "text-yellow-500" : "text-red-500";
    const progress = totalCompleted > 0 ? Math.min((uniqueCompleted / totalCompleted) * 100, 100) : 0;
    return (
        <Card className="relative w-full max-w-sm p-4 rounded-2xl shadow-sm border border-border bg-card overflow-hidden">

            <CardHeader className="pt-4">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <CardAction>
                    <Badge
                        variant="secondary"
                        className="
                            flex items-center gap-1
                            text-xs px-2 py-1
                            whitespace-nowrap
                        "
                    >
                        <TrendingUp className="h-4 w-4 shrink-0" />
                        <span>+12.5%</span>
                    </Badge>
                </CardAction>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                {/* Counts */}
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{uniqueCompleted}</span>
                    <span className="text-sm text-muted-foreground">/ {totalCompleted} total</span>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                <p className="text-xs text-muted-foreground">
                    You've uniquely completed{" "}
                    <span className="font-medium">{uniqueCompleted}</span>{" "}
                    {difficultyType.toLowerCase()} questions out of{" "}
                    <span className="font-medium">{totalCompleted}</span> successful submissions.
                </p>
            </CardFooter>
        </Card>
    );
}