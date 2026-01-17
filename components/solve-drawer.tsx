'use client';

import { useState } from 'react';
import { ProblemWithSolves, PersonalDifficulty } from '@/types';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SolveDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: ProblemWithSolves | null;
  onSuccess: () => void;
}

const DIFFICULTY_OPTIONS = [
  { value: '1', label: 'Trivial - Knew it instantly' },
  { value: '2', label: 'Easy - Minor hints needed' },
  { value: '3', label: 'Medium - Significant thinking' },
  { value: '4', label: 'Hard - Struggled considerably' },
  { value: '5', label: 'Impossible - Could not solve' },
];

const COMMON_COMPLEXITIES = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(n³)',
  'O(2^n)',
  'O(n!)',
];

export function SolveDrawer({
  open,
  onOpenChange,
  problem,
  onSuccess,
}: SolveDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personalDifficulty, setPersonalDifficulty] = useState<string>('3');
  const [timeComplexity, setTimeComplexity] = useState<string>('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('O(1)');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/solves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          personalDifficulty: parseInt(personalDifficulty) as PersonalDifficulty,
          timeComplexity,
          spaceComplexity,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record solve');
      }

      // Reset form
      setPersonalDifficulty('3');
      setTimeComplexity('O(n)');
      setSpaceComplexity('O(1)');
      setNotes('');

      onSuccess();
    } catch (error) {
      console.error('Error recording solve:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Record Solve</DrawerTitle>
            <DrawerDescription>
              {problem
                ? `${problem.leetcodeNumber}. ${problem.title}`
                : 'No problem selected'}
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">How difficult was it?</Label>
              <Select
                value={personalDifficulty}
                onValueChange={setPersonalDifficulty}
              >
                <SelectTrigger id="difficulty" className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time Complexity</Label>
                <Select value={timeComplexity} onValueChange={setTimeComplexity}>
                  <SelectTrigger id="time" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_COMPLEXITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="space">Space Complexity</Label>
                <Select
                  value={spaceComplexity}
                  onValueChange={setSpaceComplexity}
                >
                  <SelectTrigger id="space" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_COMPLEXITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Any notes about this solve..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DrawerFooter className="px-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Recording...' : 'Record Solve'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
