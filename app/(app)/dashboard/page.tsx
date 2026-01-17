import { DataTable } from "@/components/queue";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";

export default function Page() {
  const transformedData = data.map((item) => ({
    ...item,
    difficulty: item.difficulty as "Easy" | "Medium" | "Hard",
    due_date: new Date(item.due_date),
  }));

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <DataTable data={transformedData} />
      </div>
    </div>
  );
}
