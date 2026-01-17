"use client";

import * as React from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconExternalLink,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPatternById,
  type PatternIdType,
} from "@/lib/constants/patterns";
import { RecordAttemptDialog } from "@/components/record-attempt-dialog";

export const problemSchema = z.object({
  problem_id: z.number(),
  title: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  pattern: z.string().nullable(),
  subpattern: z.string().nullable(),
  understanding: z.number().min(1).max(5).nullable(),
  time_complexity: z.string().nullable(),
  space_complexity: z.string().nullable(),
  last_attempted: z.string().nullable(),
  total_attempts: z.number(),
  url: z.string(),
});

export type Problem = z.infer<typeof problemSchema>;

function getDifficultyColor(difficulty: "Easy" | "Medium" | "Hard") {
  switch (difficulty) {
    case "Easy":
      return "text-green-600 dark:text-green-400";
    case "Medium":
      return "text-yellow-600 dark:text-yellow-400";
    case "Hard":
      return "text-red-600 dark:text-red-400";
  }
}

function PatternBadges({
  patternId,
  subpatternId,
}: {
  patternId: string | null;
  subpatternId: string | null;
}) {
  if (!patternId) {
    return <span className="text-muted-foreground">—</span>;
  }

  const pattern = getPatternById(patternId as PatternIdType);
  if (!pattern) {
    return <span className="text-muted-foreground">—</span>;
  }

  const subpattern = subpatternId
    ? pattern.subpatterns.find((s) => s.id === subpatternId)
    : null;

  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className="w-fit text-xs">
        {pattern.label}
      </Badge>
      {subpattern && (
        <Badge variant="secondary" className="w-fit text-xs">
          {subpattern.label}
        </Badge>
      )}
    </div>
  );
}

function formatRelativeDate(dateString: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function UnderstandingDots({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 w-2 rounded-full ${
              level <= value ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs">{value}/5</span>
    </div>
  );
}

const columns: ColumnDef<Problem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Problem",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-1.5 ${getDifficultyColor(row.original.difficulty)}`}
      >
        {row.original.difficulty}
      </Badge>
    ),
  },
  {
    accessorKey: "pattern",
    header: "Pattern",
    cell: ({ row }) => (
      <PatternBadges
        patternId={row.original.pattern}
        subpatternId={row.original.subpattern}
      />
    ),
  },
  {
    accessorKey: "understanding",
    header: "Understanding",
    cell: ({ row }) => <UnderstandingDots value={row.original.understanding} />,
  },
  {
    accessorKey: "time_complexity",
    header: "Time",
    cell: ({ row }) => (
      <code className="text-muted-foreground text-xs">
        {row.original.time_complexity ?? "—"}
      </code>
    ),
  },
  {
    accessorKey: "space_complexity",
    header: "Space",
    cell: ({ row }) => (
      <code className="text-muted-foreground text-xs">
        {row.original.space_complexity ?? "—"}
      </code>
    ),
  },
  {
    accessorKey: "last_attempted",
    header: "Last Attempted",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatRelativeDate(row.original.last_attempted)}
      </span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.last_attempted;
      const b = rowB.original.last_attempted;
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      return new Date(a).getTime() - new Date(b).getTime();
    },
  },
  {
    accessorKey: "total_attempts",
    header: () => <div className="text-right">Attempts</div>,
    cell: ({ row }) => (
      <div className="text-right text-muted-foreground">
        {row.original.total_attempts}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell problem={row.original} />,
  },
];

function ActionsCell({ problem }: { problem: Problem }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <RecordAttemptDialog
        problem={problem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <IconExternalLink className="size-4" />
              View on LeetCode
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>Edit Problem</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function useProblemsTable(data: Problem[]) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.problem_id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return table;
}

export function ProblemsTable({ data }: { data: Problem[] }) {
  const table = useProblemsTable(data);

  return (
    <div className="flex flex-col gap-4 xl:max-w-6xl mx-auto w-full">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No problems found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableCellViewer({ item }: { item: Problem }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.title}</DrawerTitle>
          <DrawerDescription>Problem #{item.problem_id}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" defaultValue={item.title} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select defaultValue={item.difficulty}>
                  <SelectTrigger id="difficulty" className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="understanding">Understanding (1-5)</Label>
                <Select
                  defaultValue={item.understanding?.toString() ?? undefined}
                >
                  <SelectTrigger id="understanding" className="w-full">
                    <SelectValue placeholder="Not attempted" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="time_complexity">Time Complexity</Label>
                <Input
                  id="time_complexity"
                  defaultValue={item.time_complexity ?? ""}
                  placeholder="e.g., O(n)"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="space_complexity">Space Complexity</Label>
                <Input
                  id="space_complexity"
                  defaultValue={item.space_complexity ?? ""}
                  placeholder="e.g., O(1)"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="url">LeetCode URL</Label>
              <Input id="url" defaultValue={item.url} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label>Total Attempts</Label>
                <Input value={item.total_attempts} disabled />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Last Attempted</Label>
                <Input
                  value={formatRelativeDate(item.last_attempted)}
                  disabled
                />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
