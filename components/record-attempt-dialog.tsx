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
import type { Problem } from "@/components/problems-table";

interface RecordAttemptDialogProps {
  problem: Problem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordAttemptDialog({
  problem,
  open,
  onOpenChange,
}: RecordAttemptDialogProps) {
  const [date, setDate] = React.useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [understanding, setUnderstanding] = React.useState<string>("");
  const [timeComplexity, setTimeComplexity] = React.useState("");
  const [spaceComplexity, setSpaceComplexity] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log("Recording attempt:", {
      problem_id: problem.problem_id,
      date,
      understanding: understanding ? parseInt(understanding) : null,
      time_complexity: timeComplexity || null,
      space_complexity: spaceComplexity || null,
      notes: notes || null,
    });
    onOpenChange(false);
    // Reset form
    setUnderstanding("");
    setTimeComplexity("");
    setSpaceComplexity("");
    setNotes("");
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
            Record your attempt for &quot;{problem.title}&quot;
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="attempt-date">Date of Attempt</Label>
              <Input
                id="attempt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="attempt-understanding">
                Understanding Rating (1-5)
              </Label>
              <Select value={understanding} onValueChange={setUnderstanding}>
                <SelectTrigger id="attempt-understanding">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - No understanding</SelectItem>
                  <SelectItem value="2">2 - Partial understanding</SelectItem>
                  <SelectItem value="3">3 - Moderate understanding</SelectItem>
                  <SelectItem value="4">4 - Good understanding</SelectItem>
                  <SelectItem value="5">5 - Complete understanding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="attempt-tc">Time Complexity</Label>
                <Input
                  id="attempt-tc"
                  placeholder="e.g., O(n)"
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="attempt-sc">Space Complexity</Label>
                <Input
                  id="attempt-sc"
                  placeholder="e.g., O(1)"
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="attempt-notes">Notes (optional)</Label>
              <textarea
                id="attempt-notes"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                placeholder="Any notes about your approach, learnings, or areas for improvement..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Attempt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
