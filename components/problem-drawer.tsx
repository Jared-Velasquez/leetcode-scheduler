"use client";

import * as React from "react";
import { IconExternalLink } from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPatternById,
  PATTERNS,
  type PatternIdType,
} from "@/lib/constants/patterns";
import { updateProblemAction } from "@/app/actions/problems";
import { LeetcodeDifficulty } from "@/types";

function getDifficultyColor(difficulty: "Easy" | "Medium" | "Hard") {
  switch (difficulty) {
    case "Easy":
      return "text-green-600 dark:text-green-400";
    case "Medium":
      return "text-yellow-600 dark:text-yellow-400";
    case "Hard":
      return "text-red-600 dark:text-red-400";
  }
}

function formatRelativeDate(dateString: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export interface ProblemDrawerData {
  _id: string;
  problem_id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string | null;
  subpattern: string | null;
  understanding: number | null;
  time_complexity: string | null;
  space_complexity: string | null;
  last_attempted: string | null;
  total_attempts: number;
  url: string;
}

interface ProblemDrawerProps {
  problem: ProblemDrawerData;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProblemDrawer({
  problem,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProblemDrawerProps) {
  const isMobile = useIsMobile();
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  // Form state - only editable fields
  const [pattern, setPattern] = React.useState(problem.pattern ?? "");
  const [subpattern, setSubpattern] = React.useState(problem.subpattern ?? "");

  // Reset form state when drawer opens or problem changes
  React.useEffect(() => {
    setPattern(problem.pattern ?? "");
    setSubpattern(problem.subpattern ?? "");
    setError(null);
  }, [problem.pattern, problem.subpattern, open]);

  // Get subpatterns for selected pattern
  const selectedPattern = pattern
    ? getPatternById(pattern as PatternIdType)
    : null;
  const availableSubpatterns = selectedPattern?.subpatterns ?? [];

  // Reset subpattern when pattern changes
  React.useEffect(() => {
    if (pattern !== problem.pattern) {
      setSubpattern("");
    }
  }, [pattern, problem.pattern]);

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateProblemAction(problem._id, {
        title: problem.title,
        leetcodeDifficulty:
          problem.difficulty.toLowerCase() as LeetcodeDifficulty,
        patternId: pattern || undefined,
        subpatternId: subpattern || undefined,
        url: problem.url,
      });

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error ?? "Failed to update problem");
      }
    });
  };

  const defaultTrigger = (
    <Button variant="link" className="text-foreground w-fit px-0 text-left">
      {problem.title}
    </Button>
  );

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>{trigger ?? defaultTrigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{problem.title}</DrawerTitle>
          <DrawerDescription>Problem #{problem.problem_id}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">
              {error}
            </div>
          )}
          <form className="flex flex-col gap-4">
            {/* Read-only: Title */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={problem.title} disabled />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Read-only: Difficulty */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="difficulty">Difficulty</Label>
                <div className="flex h-9 items-center">
                  <Badge
                    variant="outline"
                    className={`px-2 ${getDifficultyColor(problem.difficulty)}`}
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="comfort">Comfort Level</Label>
                <Input
                  id="comfort"
                  value={
                    problem.understanding
                      ? `${6 - problem.understanding}/5`
                      : "Not attempted"
                  }
                  disabled
                />
              </div>
            </div>

            {/* Editable: Pattern & Subpattern */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="pattern">Pattern</Label>
                <Select
                  value={pattern}
                  onValueChange={setPattern}
                  disabled={isPending}
                >
                  <SelectTrigger id="pattern" className="w-full">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {PATTERNS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="subpattern">Subpattern</Label>
                <Select
                  value={subpattern}
                  onValueChange={setSubpattern}
                  disabled={isPending || availableSubpatterns.length === 0}
                >
                  <SelectTrigger id="subpattern" className="w-full">
                    <SelectValue
                      placeholder={
                        availableSubpatterns.length === 0
                          ? "None"
                          : "Select subpattern"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubpatterns.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Read-only: Complexity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="time_complexity">Time Complexity</Label>
                <Input
                  id="time_complexity"
                  value={problem.time_complexity ?? ""}
                  placeholder="e.g., O(n)"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="space_complexity">Space Complexity</Label>
                <Input
                  id="space_complexity"
                  value={problem.space_complexity ?? ""}
                  placeholder="e.g., O(1)"
                  disabled
                />
              </div>
            </div>

            {/* Read-only: LeetCode URL with link */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="url">LeetCode URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={problem.url}
                  disabled
                  className="flex-1"
                />
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconExternalLink className="size-4" />
                    <span className="sr-only">Open on LeetCode</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Read-only: Attempts and Last Attempted */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label>Total Attempts</Label>
                <Input value={problem.total_attempts} disabled />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Last Attempted</Label>
                <Input
                  value={formatRelativeDate(problem.last_attempted)}
                  disabled
                />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
