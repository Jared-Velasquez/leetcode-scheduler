"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Problem } from "@/domain/problem"

const problemList: ProblemRow[] = [
    {
        id: 1,
        title: "Two Sum",
        url: "https://leetcode.com/problems/two-sum",
        difficulty: "EASY",
        topics: ["Array", "Hash Table"],
        latest_proficiency_level: 4,
        number_of_solves: 5,
    },
    {
        id: 2,
        title: "Reverse Linked List",
        url: "https://leetcode.com/problems/reverse-linked-list",
        difficulty: "EASY",
        topics: ["Linked List"],
        latest_proficiency_level: 3,
        number_of_solves: 3,
    },
    {
        id: 3,
        title: "Binary Tree Inorder Traversal",
        url: "https://leetcode.com/problems/binary-tree-inorder-traversal",
        difficulty: "EASY",
        topics: ["Tree", "DFS", "Stack"],
        latest_proficiency_level: 2,
        number_of_solves: 4,
    },
    {
        id: 4,
        title: "Add Two Numbers",
        url: "https://leetcode.com/problems/add-two-numbers",
        difficulty: "MEDIUM",
        topics: ["Linked List", "Math"],
        latest_proficiency_level: 2,
        number_of_solves: 2,
    },
    {
        id: 5,
        title: "Longest Substring Without Repeating Characters",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
        difficulty: "MEDIUM",
        topics: ["String", "Sliding Window"],
        latest_proficiency_level: 1,
        number_of_solves: 3,
    },
    {
        id: 6,
        title: "Group Anagrams",
        url: "https://leetcode.com/problems/group-anagrams",
        difficulty: "MEDIUM",
        topics: ["String", "Hash Table", "Sorting"],
        latest_proficiency_level: 3,
        number_of_solves: 2,
    },
    {
        id: 7,
        title: "Product of Array Except Self",
        url: "https://leetcode.com/problems/product-of-array-except-self",
        difficulty: "MEDIUM",
        topics: ["Array", "Prefix Sum"],
        latest_proficiency_level: 4,
        number_of_solves: 6,
    },
    {
        id: 8,
        title: "3Sum",
        url: "https://leetcode.com/problems/3sum",
        difficulty: "MEDIUM",
        topics: ["Array", "Two Pointers", "Sorting"],
        latest_proficiency_level: 2,
        number_of_solves: 4,
    },
    {
        id: 9,
        title: "Merge Intervals",
        url: "https://leetcode.com/problems/merge-intervals",
        difficulty: "MEDIUM",
        topics: ["Array", "Sorting"],
        latest_proficiency_level: 3,
        number_of_solves: 3,
    },
    {
        id: 10,
        title: "Word Ladder",
        url: "https://leetcode.com/problems/word-ladder",
        difficulty: "HARD",
        topics: ["Graph", "BFS"],
        latest_proficiency_level: 1,
        number_of_solves: 1,
    },
    {
        id: 11,
        title: "Median of Two Sorted Arrays",
        url: "https://leetcode.com/problems/median-of-two-sorted-arrays",
        difficulty: "HARD",
        topics: ["Array", "Binary Search"],
        latest_proficiency_level: 0,
        number_of_solves: 1,
    },
    {
        id: 12,
        title: "Sudoku Solver",
        url: "https://leetcode.com/problems/sudoku-solver",
        difficulty: "HARD",
        topics: ["Backtracking"],
        latest_proficiency_level: 1,
        number_of_solves: 2,
    },
    {
        id: 13,
        title: "Longest Valid Parentheses",
        url: "https://leetcode.com/problems/longest-valid-parentheses",
        difficulty: "HARD",
        topics: ["Stack", "DP"],
        latest_proficiency_level: 1,
        number_of_solves: 1,
    },
    {
        id: 14,
        title: "Coin Change",
        url: "https://leetcode.com/problems/coin-change",
        difficulty: "MEDIUM",
        topics: ["DP"],
        latest_proficiency_level: 3,
        number_of_solves: 5,
    },
    {
        id: 15,
        title: "Diameter of Binary Tree",
        url: "https://leetcode.com/problems/diameter-of-binary-tree",
        difficulty: "EASY",
        topics: ["Tree", "DFS"],
        latest_proficiency_level: 4,
        number_of_solves: 4,
    },
];


type ProblemRow = Problem & {
    latest_proficiency_level?: number;
    number_of_solves?: number;
}

export const columns: ColumnDef<ProblemRow>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Problem ID
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="max-w-sm truncate">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "title",
        header: "Problem Title",
        cell: ({ row }) => (
            <div className="max-w-sm truncate">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "difficulty",
        header: "Difficulty",
        cell: ({ row }) => (
            <div className="max-w-sm truncate">{row.getValue("difficulty")}</div>
        ),
    },
    {
        accessorKey: "latest_proficiency_level",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Proficiency Level
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="max-w-sm truncate">
                {row.getValue("latest_proficiency_level") ?? "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "number_of_solves",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    # Solves
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="max-w-sm truncate">
                {row.getValue("number_of_solves") ?? 0}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const problem = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(problem.url)}
                        >
                            Copy Problem URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Add Solve</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
]

export function ProblemList() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: problemList,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        //getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {
                            table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}