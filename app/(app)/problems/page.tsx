"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PatternCombobox } from "@/components/pattern-combobox";
import { ProblemsTable, type Problem } from "@/components/problems-table";
import { Skeleton } from "@/components/ui/skeleton";
import problemsData from "./data.json";

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

function ProblemsContent() {
  const searchParams = useSearchParams();
  const patternFilter = searchParams.get("pattern");
  const subpatternFilter = searchParams.get("subpattern");

  const filteredProblems = useMemo(() => {
    let problems = problemsData as Problem[];

    if (patternFilter) {
      problems = problems.filter((p) => p.pattern === patternFilter);

      if (subpatternFilter) {
        problems = problems.filter((p) => p.subpattern === subpatternFilter);
      }
    }

    return problems;
  }, [patternFilter, subpatternFilter]);

  return <ProblemsTable data={filteredProblems} />;
}

export default function ProblemsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center gap-4 px-4 lg:px-6">
          <Suspense fallback={<PatternComboboxFallback />}>
            <PatternCombobox />
          </Suspense>
        </div>
        <div className="flex-1 px-4 lg:px-6">
          <Suspense fallback={<ProblemsTableFallback />}>
            <ProblemsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
