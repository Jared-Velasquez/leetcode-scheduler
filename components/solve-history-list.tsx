"use client";

import * as React from "react";
import { getSolvesForProblemAction } from "@/app/actions/solves";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PersonalDifficulty } from "@/types";
import { PERSONAL_DIFFICULTIES } from "@/lib/constants/difficulties";

interface SerializedSolve {
  id: string;
  problemId: string;
  userId: string;
  solvedAt: string;
  personalDifficulty: PersonalDifficulty;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode?: string;
  notes?: string;
  easinessFactor: number;
  interval: number;
  repetition: number;
  createdAt: string;
}

function DifficultyDots({ value }: { value: number }) {
  // Invert the value: 1 (Trivial) shows 5 dots, 5 (Impossible) shows 1 dot
  const invertedValue = 6 - value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 w-2 rounded-full ${
              level <= invertedValue ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs">{invertedValue}/5</span>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDifficultyLabel(value: PersonalDifficulty): string {
  const difficulty = PERSONAL_DIFFICULTIES.find((d) => d.value === value);
  return difficulty?.label ?? "Uncategorized";
}

interface SolveHistoryListProps {
  problemId: string;
}

export function SolveHistoryList({ problemId }: SolveHistoryListProps) {
  const [solves, setSolves] = React.useState<SerializedSolve[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSolves() {
      setIsLoading(true);
      setError(null);

      const result = await getSolvesForProblemAction(problemId);

      if (result.success && result.data) {
        setSolves(result.data as SerializedSolve[]);
      } else {
        setError(result.error ?? "Failed to load solve history");
      }

      setIsLoading(false);
    }

    fetchSolves();
  }, [problemId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        Loading history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (solves.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        No attempts recorded yet
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {solves.map((solve, index) => (
        <div key={solve.id}>
          <div className="flex flex-col gap-2 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {formatDate(solve.solvedAt)}
              </span>
              <span className="text-xs text-muted-foreground">
                {getDifficultyLabel(solve.personalDifficulty)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <DifficultyDots value={solve.personalDifficulty} />
              <code className="text-xs text-muted-foreground">
                {solve.timeComplexity} · {solve.spaceComplexity}
              </code>
            </div>
            {solve.notes && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground line-clamp-2 cursor-default">
                    {solve.notes}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs whitespace-pre-wrap">
                  {solve.notes}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {index < solves.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
