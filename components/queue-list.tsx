'use client';

import { useState } from 'react';
import { ExternalLink, Eye, CheckCircle } from 'lucide-react';
import { QueueItem } from '@/types';
import { getPatternById } from '@/lib/constants/patterns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SolveDrawer } from '@/components/solve-drawer';

interface QueueListProps {
  items: QueueItem[];
  onSolveRecorded?: () => void;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-700 dark:text-green-400';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    case 'hard':
      return 'bg-red-500/20 text-red-700 dark:text-red-400';
    default:
      return '';
  }
}

function getReviewStatusText(item: QueueItem): string {
  if (item.isOverdue) {
    const daysOverdue = Math.abs(item.daysUntilDue);
    return daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`;
  }
  if (item.daysUntilDue === 0) {
    return 'Due today';
  }
  return item.daysUntilDue === 1
    ? 'Due tomorrow'
    : `Due in ${item.daysUntilDue} days`;
}

function getPatternLabel(patternId: string, subpatternId?: string): string {
  const pattern = getPatternById(patternId);
  if (!pattern) return patternId;

  if (subpatternId) {
    const subpattern = pattern.subpatterns.find((s) => s.id === subpatternId);
    if (subpattern) {
      return `${pattern.label} > ${subpattern.label}`;
    }
  }
  return pattern.label;
}

export function QueueList({ items, onSolveRecorded }: QueueListProps) {
  const [solveDrawerOpen, setSolveDrawerOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<QueueItem | null>(
    null
  );

  const handleMarkSolved = (item: QueueItem) => {
    setSelectedProblem(item);
    setSolveDrawerOpen(true);
  };

  const handleSolveSuccess = () => {
    setSolveDrawerOpen(false);
    setSelectedProblem(null);
    onSolveRecorded?.();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No problems in your review queue.</p>
        <p className="text-muted-foreground text-sm mt-1">
          Add problems and solve them to start building your queue.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-20">Difficulty</TableHead>
            <TableHead className="hidden md:table-cell">Pattern</TableHead>
            <TableHead>Review Status</TableHead>
            <TableHead className="hidden sm:table-cell w-24">
              Next Review
            </TableHead>
            <TableHead className="hidden lg:table-cell w-24">
              Last Solved
            </TableHead>
            <TableHead className="hidden sm:table-cell w-16 text-center">
              Solves
            </TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.problem.id}>
              <TableCell className="font-mono text-muted-foreground">
                {item.problem.leetcodeNumber}
              </TableCell>
              <TableCell className="font-medium">
                {item.problem.title}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getDifficultyColor(item.problem.leetcodeDifficulty)}
                >
                  {item.problem.leetcodeDifficulty.charAt(0).toUpperCase() +
                    item.problem.leetcodeDifficulty.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {getPatternLabel(
                  item.problem.patternId,
                  item.problem.subpatternId
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.isOverdue ? 'destructive' : 'outline'}
                  className={
                    item.daysUntilDue === 0 && !item.isOverdue
                      ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
                      : ''
                  }
                >
                  {getReviewStatusText(item)}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {formatDate(item.nextReviewDate)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {item.lastSolve ? formatDate(item.lastSolve.solvedAt) : '-'}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-center text-muted-foreground">
                {item.problem.solves.length}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  {item.problem.url && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      asChild
                      title="Open on LeetCode"
                    >
                      <a
                        href={item.problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Mark as Solved"
                    onClick={() => handleMarkSolved(item)}
                  >
                    <CheckCircle className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" title="View Details">
                    <Eye className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SolveDrawer
        open={solveDrawerOpen}
        onOpenChange={setSolveDrawerOpen}
        problem={selectedProblem?.problem ?? null}
        onSuccess={handleSolveSuccess}
      />
    </>
  );
}
