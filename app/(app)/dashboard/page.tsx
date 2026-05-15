import { createClient } from "@/lib/supabase/server";
import { getQueueItems } from "@/services/queue.service";
import { getSolveStatsByDifficulty } from "@/services/solves.service";
import { DataTable } from "@/components/queue";
import { SectionCards } from "@/components/section-cards";

export default async function Page() {
  const supabase = await createClient();
  const [queueItems, solveStats] = await Promise.all([
    getQueueItems(supabase),
    getSolveStatsByDifficulty(supabase),
  ]);

  // Transform queue items to match the DataTable schema
  const transformedData = queueItems.map((item) => ({
    _id: item.problem.id,
    problem_id: item.problem.leetcodeNumber,
    title: item.problem.title,
    difficulty: (item.problem.leetcodeDifficulty.charAt(0).toUpperCase() +
      item.problem.leetcodeDifficulty.slice(1)) as "Easy" | "Medium" | "Hard",
    pattern: item.problem.patternId ?? null,
    subpattern: item.problem.subpatternId ?? null,
    understanding: item.lastSolve?.personalDifficulty ?? 1,
    time_complexity: item.lastSolve?.timeComplexity ?? null,
    space_complexity: item.lastSolve?.spaceComplexity ?? null,
    last_attempted: item.lastSolve?.solvedAt?.toISOString() ?? null,
    total_attempts: item.problem.solves.length,
    url: item.problem.url ?? `https://leetcode.com/problems/${item.problem.title.toLowerCase().replace(/\s+/g, "-")}`,
    due_date: item.nextReviewDate,
    days_left: item.daysUntilDue,
  }));

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards stats={solveStats} />
        <DataTable data={transformedData} />
      </div>
    </div>
  );
}
