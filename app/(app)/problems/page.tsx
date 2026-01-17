import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getProblems } from "@/services/problems.service";
import { getSolvesForProblem } from "@/services/solves.service";
import { PatternCombobox } from "@/components/pattern-combobox";
import { ProblemsTable, type Problem } from "@/components/problems-table";
import { AddProblemDialog } from "@/components/add-problem-dialog";
import { Skeleton } from "@/components/ui/skeleton";

function PatternComboboxFallback() {
  return <Skeleton className="h-9 w-full md:w-[300px]" />;
}

function ProblemsTableFallback() {
  return (
    <div className="flex flex-col gap-4 xl:max-w-6xl mx-auto w-full">
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}

interface ProblemsContentProps {
  patternFilter: string | null;
  subpatternFilter: string | null;
}

async function ProblemsContent({ patternFilter, subpatternFilter }: ProblemsContentProps) {
  const supabase = await createClient();

  // Fetch problems with optional filters
  const problems = await getProblems(supabase, {
    patternId: patternFilter ?? undefined,
    subpatternId: subpatternFilter ?? undefined,
  });

  // Fetch solves for each problem to get the latest solve data
  const problemsWithSolves = await Promise.all(
    problems.map(async (problem) => {
      const solves = await getSolvesForProblem(supabase, problem.id);
      const latestSolve = solves[0]; // Already sorted by solved_at desc

      return {
        _id: problem.id,
        problem_id: problem.leetcodeNumber,
        title: problem.title,
        difficulty: (problem.leetcodeDifficulty.charAt(0).toUpperCase() +
          problem.leetcodeDifficulty.slice(1)) as "Easy" | "Medium" | "Hard",
        pattern: problem.patternId,
        subpattern: problem.subpatternId ?? null,
        understanding: latestSolve?.personalDifficulty ?? null,
        time_complexity: latestSolve?.timeComplexity ?? null,
        space_complexity: latestSolve?.spaceComplexity ?? null,
        last_attempted: latestSolve?.solvedAt.toISOString() ?? null,
        total_attempts: solves.length,
        url: problem.url ?? `https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, "-")}/`,
      } satisfies Problem;
    })
  );

  return <ProblemsTable data={problemsWithSolves} />;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProblemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const patternFilter = typeof params.pattern === "string" ? params.pattern : null;
  const subpatternFilter = typeof params.subpattern === "string" ? params.subpattern : null;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="xl:max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <Suspense fallback={<PatternComboboxFallback />}>
              <PatternCombobox />
            </Suspense>
            <AddProblemDialog />
          </div>
        </div>
        <div className="flex-1 px-4 lg:px-6">
          <Suspense fallback={<ProblemsTableFallback />}>
            <ProblemsContent
              patternFilter={patternFilter}
              subpatternFilter={subpatternFilter}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
