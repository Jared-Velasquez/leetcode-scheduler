import { Suspense } from "react";
import { PatternCombobox } from "@/components/pattern-combobox";
import { Skeleton } from "@/components/ui/skeleton";

function PatternComboboxFallback() {
  return <Skeleton className="h-9 w-full md:w-[300px]" />;
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
          {/* Problems list will go here */}
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Problems list filtered by selected pattern
          </div>
        </div>
      </div>
    </div>
  );
}
