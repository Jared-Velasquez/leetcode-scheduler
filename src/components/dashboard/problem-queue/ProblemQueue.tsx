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
} from '@tanstack/react-table';
import { ArrowUpDown, Badge, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Difficulty } from '@/domain/problem';
import { Shapes, Zap, Flame } from 'lucide-react';
import { useState } from 'react';

export type Problem = {
  id: number;
  title: string;
  url: URL;
  difficulty: Difficulty;
  lastSolveAt: Date;
  nextSolveAt: Date;
};

export const sampleProblems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    url: new URL('https://leetcode.com/problems/two-sum'),
    difficulty: 'EASY',
    lastSolveAt: new Date('2025-11-12'),
    nextSolveAt: new Date('2025-11-15'),
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    url: new URL('https://leetcode.com/problems/valid-parentheses'),
    difficulty: 'EASY',
    lastSolveAt: new Date('2025-11-10'),
    nextSolveAt: new Date('2025-11-14'),
  },
  {
    id: 3,
    title: 'Merge Two Sorted Lists',
    url: new URL('https://leetcode.com/problems/merge-two-sorted-lists'),
    difficulty: 'EASY',
    lastSolveAt: new Date('2025-11-08'),
    nextSolveAt: new Date('2025-11-12'),
  },
  {
    id: 4,
    title: 'Best Time to Buy and Sell Stock',
    url: new URL(
      'https://leetcode.com/problems/best-time-to-buy-and-sell-stock',
    ),
    difficulty: 'EASY',
    lastSolveAt: new Date('2025-10-30'),
    nextSolveAt: new Date('2025-11-05'),
  },

  {
    id: 5,
    title: 'Add Two Numbers',
    url: new URL('https://leetcode.com/problems/add-two-numbers'),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-11-14'),
    nextSolveAt: new Date('2025-11-20'),
  },
  {
    id: 6,
    title: 'Longest Substring Without Repeating Characters',
    url: new URL(
      'https://leetcode.com/problems/longest-substring-without-repeating-characters',
    ),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-11-11'),
    nextSolveAt: new Date('2025-11-18'),
  },
  {
    id: 7,
    title: 'Container With Most Water',
    url: new URL('https://leetcode.com/problems/container-with-most-water'),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-11-01'),
    nextSolveAt: new Date('2025-11-10'),
  },
  {
    id: 8,
    title: '3Sum',
    url: new URL('https://leetcode.com/problems/3sum'),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-10-28'),
    nextSolveAt: new Date('2025-11-08'),
  },

  {
    id: 9,
    title: 'Median of Two Sorted Arrays',
    url: new URL('https://leetcode.com/problems/median-of-two-sorted-arrays'),
    difficulty: 'HARD',
    lastSolveAt: new Date('2025-11-13'),
    nextSolveAt: new Date('2025-11-26'),
  },
  {
    id: 10,
    title: 'Regular Expression Matching',
    url: new URL('https://leetcode.com/problems/regular-expression-matching'),
    difficulty: 'HARD',
    lastSolveAt: new Date('2025-11-03'),
    nextSolveAt: new Date('2025-11-18'),
  },
  {
    id: 11,
    title: 'Trapping Rain Water',
    url: new URL('https://leetcode.com/problems/trapping-rain-water'),
    difficulty: 'HARD',
    lastSolveAt: new Date('2025-10-25'),
    nextSolveAt: new Date('2025-11-15'),
  },
  {
    id: 12,
    title: 'First Missing Positive',
    url: new URL('https://leetcode.com/problems/first-missing-positive'),
    difficulty: 'HARD',
    lastSolveAt: new Date('2025-10-29'),
    nextSolveAt: new Date('2025-11-12'),
  },

  {
    id: 13,
    title: 'Climbing Stairs',
    url: new URL('https://leetcode.com/problems/climbing-stairs'),
    difficulty: 'EASY',
    lastSolveAt: new Date('2025-11-09'),
    nextSolveAt: new Date('2025-11-13'),
  },
  {
    id: 14,
    title: 'Binary Tree Level Order Traversal',
    url: new URL(
      'https://leetcode.com/problems/binary-tree-level-order-traversal',
    ),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-11-07'),
    nextSolveAt: new Date('2025-11-15'),
  },
  {
    id: 15,
    title: 'Course Schedule',
    url: new URL('https://leetcode.com/problems/course-schedule'),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-10-27'),
    nextSolveAt: new Date('2025-11-04'),
  },
  {
    id: 16,
    title: 'Word Ladder',
    url: new URL('https://leetcode.com/problems/word-ladder'),
    difficulty: 'HARD',
    lastSolveAt: new Date('2025-11-05'),
    nextSolveAt: new Date('2025-11-19'),
  },

  {
    id: 17,
    title: 'Invert Binary Tree',
    url: new URL('https://leetcode.com/problems/invert-binary-tree'),
    difficulty: 'EASY',
    lastSolveAt: new Date('2025-11-15'),
    nextSolveAt: new Date('2025-11-18'),
  },
  {
    id: 18,
    title: 'Kth Largest Element in an Array',
    url: new URL(
      'https://leetcode.com/problems/kth-largest-element-in-an-array',
    ),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-11-02'),
    nextSolveAt: new Date('2025-11-11'),
  },
  {
    id: 19,
    title: 'Maximal Rectangle',
    url: new URL('https://leetcode.com/problems/maximal-rectangle'),
    difficulty: 'HARD',
    lastSolveAt: new Date('2025-11-06'),
    nextSolveAt: new Date('2025-11-22'),
  },
  {
    id: 20,
    title: 'LRU Cache',
    url: new URL('https://leetcode.com/problems/lru-cache'),
    difficulty: 'MEDIUM',
    lastSolveAt: new Date('2025-10-31'),
    nextSolveAt: new Date('2025-11-09'),
  },
];

const difficultyBadgeVariants: Record<Difficulty, string> = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800',
};

export const columns: ColumnDef<Problem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center w-10'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center w-10'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <a
        href={row.original.url.toString()}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 hover:underline'
      >
        {row.original.title}
      </a>
    ),
  },
  {
    accessorKey: 'difficulty',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Difficulty
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        className={`px-2 py-1 rounded-full text-sm font-medium ${
          difficultyBadgeVariants[row.original.difficulty]
        }`}
      >
        {row.original.difficulty === 'EASY' && (
          <Shapes className='mr-1 inline-block h-3 w-3' />
        )}
        {row.original.difficulty === 'MEDIUM' && (
          <Zap className='mr-1 inline-block h-3 w-3' />
        )}
        {row.original.difficulty === 'HARD' && (
          <Flame className='mr-1 inline-block h-3 w-3' />
        )}
        {row.original.difficulty.charAt(0) +
          row.original.difficulty.slice(1).toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: 'lastSolveAt',
    header: 'Last Solve',
    cell: ({ row }) => (
      <span>
        {row.original.lastSolveAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'nextSolveAt',
    header: 'Next Solve',
    cell: ({ row }) => (
      <span>
        {row.original.nextSolveAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    ),
  },
];

export function ProblemQueue() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: sampleProblems,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === 'select' ? 'w-10 px-2' : ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === 'select' ? 'w-10 px-2' : ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
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
