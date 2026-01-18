"use client";

import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProblemAction } from "@/app/actions/problems";
import { PATTERNS, getPatternById, type PatternIdType } from "@/lib/constants/patterns";
import { LeetcodeDifficulty } from "@/types";
import {
  extractTitleSlug,
  fetchProblemDetailsFromUrl,
} from "@/services/leetcode-api.service";

export function AddProblemDialog() {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = React.useState(false);
  const [hasFetchedDetails, setHasFetchedDetails] = React.useState(false);

  // Form state - fetched from API (read-only)
  const [leetcodeNumber, setLeetcodeNumber] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<string>("");

  // Form state - user input
  const [url, setUrl] = React.useState("");
  const [pattern, setPattern] = React.useState("");
  const [subpattern, setSubpattern] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Auto-fetch problem details when URL changes
  React.useEffect(() => {
    const titleSlug = extractTitleSlug(url);
    if (!titleSlug) {
      // Clear fetched fields if URL is cleared or invalid
      if (hasFetchedDetails) {
        setLeetcodeNumber("");
        setTitle("");
        setDifficulty("");
        setHasFetchedDetails(false);
      }
      return;
    }

    setIsFetchingDetails(true);
    setError(null);

    fetchProblemDetailsFromUrl(url)
      .then((details) => {
        setLeetcodeNumber(details.questionId);
        setTitle(details.title);
        setDifficulty(details.difficulty);
        setHasFetchedDetails(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to fetch problem details");
        setLeetcodeNumber("");
        setTitle("");
        setDifficulty("");
        setHasFetchedDetails(false);
      })
      .finally(() => {
        setIsFetchingDetails(false);
      });
  }, [url, hasFetchedDetails]);

  // Get subpatterns for selected pattern
  const selectedPattern = pattern ? getPatternById(pattern as PatternIdType) : null;
  const availableSubpatterns = selectedPattern?.subpatterns ?? [];

  // Reset subpattern when pattern changes
  React.useEffect(() => {
    setSubpattern("");
  }, [pattern]);

  const resetForm = () => {
    setLeetcodeNumber("");
    setTitle("");
    setUrl("");
    setDifficulty("");
    setPattern("");
    setSubpattern("");
    setNotes("");
    setError(null);
    setHasFetchedDetails(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url) {
      setError("Please enter a LeetCode problem URL");
      return;
    }

    if (!hasFetchedDetails || !leetcodeNumber || !title || !difficulty) {
      setError("Please wait for problem details to load");
      return;
    }

    if (!pattern) {
      setError("Please select a pattern");
      return;
    }

    const num = parseInt(leetcodeNumber);
    if (isNaN(num) || num <= 0) {
      setError("Failed to parse LeetCode number from URL");
      return;
    }

    startTransition(async () => {
      const result = await createProblemAction({
        leetcodeNumber: num,
        title,
        url,
        leetcodeDifficulty: difficulty as LeetcodeDifficulty,
        patternId: pattern,
        subpatternId: subpattern || undefined,
        notes: notes || undefined,
      });

      if (result.success) {
        resetForm();
        setOpen(false);
      } else {
        setError(result.error ?? "Failed to create problem");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus className="size-4 mr-2" />
          Add Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
          <DialogDescription>
            Add a LeetCode problem to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Label htmlFor="problem-url">
                LeetCode URL *
                {isFetchingDetails && (
                  <span className="ml-2 text-muted-foreground text-xs">
                    Fetching details...
                  </span>
                )}
              </Label>
              <Input
                id="problem-url"
                type="url"
                placeholder="https://leetcode.com/problems/two-sum/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isPending || isFetchingDetails}
              />
            </div>
            {hasFetchedDetails && (
              <div className="rounded-md border bg-muted/50 p-3">
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Number</span>
                    <span className="text-sm font-medium">{leetcodeNumber}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-xs text-muted-foreground">Title</span>
                    <span className="text-sm font-medium">{title}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Difficulty</span>
                    <span className={`text-sm font-medium capitalize ${
                      difficulty === 'easy' ? 'text-green-600 dark:text-green-400' :
                      difficulty === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {difficulty}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="problem-pattern">Pattern *</Label>
                <Select
                  value={pattern}
                  onValueChange={setPattern}
                  disabled={isPending}
                >
                  <SelectTrigger id="problem-pattern">
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
                <Label htmlFor="problem-subpattern">Subpattern</Label>
                <Select
                  value={subpattern}
                  onValueChange={setSubpattern}
                  disabled={isPending || availableSubpatterns.length === 0}
                >
                  <SelectTrigger id="problem-subpattern">
                    <SelectValue
                      placeholder={
                        availableSubpatterns.length === 0
                          ? "None available"
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
            <div className="flex flex-col gap-3">
              <Label htmlFor="problem-notes">Notes (optional)</Label>
              <textarea
                id="problem-notes"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:opacity-50"
                placeholder="Any notes about this problem..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Problem"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
