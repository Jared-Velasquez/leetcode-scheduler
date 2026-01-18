"use client";

import * as React from "react";
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
import { recordSolveAction } from "@/app/actions/solves";
import { PersonalDifficulty } from "@/types";
import { PERSONAL_DIFFICULTIES } from "@/lib/constants/difficulties";

interface RecordAttemptDialogProps {
  problemId: string;
  problemTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordAttemptDialog({
  problemId,
  problemTitle,
  open,
  onOpenChange,
}: RecordAttemptDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [date, setDate] = React.useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [understanding, setUnderstanding] = React.useState<string>("");
  const [timeComplexity, setTimeComplexity] = React.useState("");
  const [spaceComplexity, setSpaceComplexity] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const resetForm = () => {
    setUnderstanding("");
    setTimeComplexity("");
    setSpaceComplexity("");
    setNotes("");
    setError(null);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!understanding || !timeComplexity || !spaceComplexity) {
      setError("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      const result = await recordSolveAction({
        problemId,
        solvedAt: new Date(date),
        personalDifficulty: parseInt(understanding) as PersonalDifficulty,
        timeComplexity,
        spaceComplexity,
        notes: notes || undefined,
      });

      if (result.success) {
        resetForm();
        onOpenChange(false);
      } else {
        setError(result.error ?? "Failed to record attempt");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Record Attempt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Attempt</DialogTitle>
          <DialogDescription>
            Record your attempt for &quot;{problemTitle}&quot;
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
              <Label htmlFor="attempt-date">Date of Attempt</Label>
              <Input
                id="attempt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="attempt-understanding">
                How difficult was this for you? *
              </Label>
              <Select
                value={understanding}
                onValueChange={setUnderstanding}
                disabled={isPending}
              >
                <SelectTrigger id="attempt-understanding">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {PERSONAL_DIFFICULTIES.map((difficulty) => (
                    <SelectItem
                      key={difficulty.value}
                      value={String(difficulty.value)}
                    >
                      {difficulty.label} - {difficulty.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="attempt-tc">Time Complexity *</Label>
                <Input
                  id="attempt-tc"
                  placeholder="e.g., O(n)"
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="attempt-sc">Space Complexity *</Label>
                <Input
                  id="attempt-sc"
                  placeholder="e.g., O(1)"
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="attempt-notes">Notes (optional)</Label>
              <textarea
                id="attempt-notes"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:opacity-50"
                placeholder="Any notes about your approach, learnings, or areas for improvement..."
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
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Attempt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
