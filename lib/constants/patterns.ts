// Pattern IDs as const for type safety
export const PatternId = {
  UNCATEGORIZED: 'uncategorized',
  ARRAYS: 'arrays',
  TWO_POINTERS: 'two_pointers',
  SLIDING_WINDOW: 'sliding_window',
  STACK: 'stack',
  BINARY_SEARCH: 'binary_search',
  LINKED_LIST: 'linked_list',
  TREES: 'trees',
  GRAPHS: 'graphs',
  DYNAMIC_PROGRAMMING: 'dynamic_programming',
  BACKTRACKING: 'backtracking',
  HEAP: 'heap',
  GREEDY: 'greedy',
  INTERVALS: 'intervals',
  BIT_MANIPULATION: 'bit_manipulation',
  TRIE: 'trie',
  MATH: 'math',
} as const;

export type PatternIdType = (typeof PatternId)[keyof typeof PatternId];

// Subpattern IDs as const for type safety
export const SubpatternId = {
  // Arrays & Hashing
  PREFIX_SUM: 'prefix_sum',
  KADANES: 'kadanes',
  MATRIX: 'matrix',
  // Two Pointers
  OPPOSITE_ENDS: 'opposite_ends',
  SAME_DIRECTION: 'same_direction',
  // Sliding Window
  FIXED_SIZE: 'fixed_size',
  VARIABLE_SIZE: 'variable_size',
  // Stack
  MONOTONIC_STACK: 'monotonic_stack',
  EXPRESSION_PARSING: 'expression_parsing',
  PARENTHESES: 'parentheses',
  // Binary Search
  SEARCH_SPACE: 'search_space',
  ROTATED_ARRAY: 'rotated_array',
  // Linked List
  FAST_SLOW: 'fast_slow',
  REVERSAL: 'reversal',
  // Trees
  BINARY_TREE: 'binary_tree',
  BST: 'bst',
  FENWICK_TREE: 'fenwick_tree',
  // Graphs
  BFS: 'bfs',
  DFS: 'dfs',
  DIJKSTRA: 'dijkstra',
  UNION_FIND: 'union_find',
  TOPOLOGICAL_SORT: 'topological_sort',
  // Dynamic Programming
  KNAPSACK_01: 'knapsack_01',
  KNAPSACK_UNBOUNDED: 'knapsack_unbounded',
  LCS: 'lcs',
  LIS: 'lis',
  MATRIX_DP: 'matrix_dp',
  STATE_MACHINE: 'state_machine',
  INTERVAL_DP: 'interval_dp',
  // Backtracking
  PERMUTATIONS: 'permutations',
  COMBINATIONS: 'combinations',
  SUBSETS: 'subsets',
  // Heap
  TOP_K: 'top_k',
  MERGE_K: 'merge_k',
  TWO_HEAPS: 'two_heaps',
  // Intervals
  MERGE_INTERVALS: 'merge_intervals',
  INSERT_INTERVAL: 'insert_interval',
  NON_OVERLAPPING: 'non_overlapping',
  SEGMENT_TREE: 'segment_tree',
  LINE_SWEEP: 'line_sweep',
} as const;

export type SubpatternIdType = (typeof SubpatternId)[keyof typeof SubpatternId];

export interface PatternDefinition {
  id: PatternIdType;
  label: string;
  subpatterns: SubpatternDefinition[];
}

export interface SubpatternDefinition {
  id: SubpatternIdType;
  label: string;
}

export const PATTERNS: PatternDefinition[] = [
  {
    id: 'uncategorized',
    label: 'Uncategorized',
    subpatterns: [],
  },
  {
    id: 'arrays',
    label: 'Arrays & Hashing',
    subpatterns: [
      { id: 'prefix_sum', label: 'Prefix Sum' },
      { id: 'kadanes', label: "Kadane's Algorithm" },
      { id: 'matrix', label: 'Matrix Traversal' },
    ],
  },
  {
    id: 'two_pointers',
    label: 'Two Pointers',
    subpatterns: [
      { id: 'opposite_ends', label: 'Opposite Ends' },
      { id: 'same_direction', label: 'Same Direction' },
    ],
  },
  {
    id: 'sliding_window',
    label: 'Sliding Window',
    subpatterns: [
      { id: 'fixed_size', label: 'Fixed Size' },
      { id: 'variable_size', label: 'Variable Size' },
    ],
  },
  {
    id: 'stack',
    label: 'Stack',
    subpatterns: [
      { id: 'monotonic_stack', label: 'Monotonic Stack' },
      { id: 'expression_parsing', label: 'Expression Parsing' },
      { id: 'parentheses', label: 'Parentheses Matching' },
    ],
  },
  {
    id: 'binary_search',
    label: 'Binary Search',
    subpatterns: [
      { id: 'search_space', label: 'Search Space Reduction' },
      { id: 'rotated_array', label: 'Rotated Array' },
    ],
  },
  {
    id: 'linked_list',
    label: 'Linked List',
    subpatterns: [
      { id: 'fast_slow', label: 'Fast & Slow Pointers' },
      { id: 'reversal', label: 'In-Place Reversal' },
    ],
  },
  {
    id: 'trees',
    label: 'Trees',
    subpatterns: [
      { id: 'binary_tree', label: 'Binary Tree Traversal' },
      { id: 'bst', label: 'Binary Search Tree' },
      { id: 'fenwick_tree', label: 'Fenwick Tree (BIT)' },
    ],
  },
  {
    id: 'graphs',
    label: 'Graphs',
    subpatterns: [
      { id: 'bfs', label: 'BFS' },
      { id: 'dfs', label: 'DFS' },
      { id: 'dijkstra', label: "Dijkstra's Algorithm" },
      { id: 'union_find', label: 'Union Find' },
      { id: 'topological_sort', label: 'Topological Sort' },
    ],
  },
  {
    id: 'dynamic_programming',
    label: 'Dynamic Programming',
    subpatterns: [
      { id: 'knapsack_01', label: '0/1 Knapsack' },
      { id: 'knapsack_unbounded', label: 'Unbounded Knapsack' },
      { id: 'lcs', label: 'Longest Common Subsequence' },
      { id: 'lis', label: 'Longest Increasing Subsequence' },
      { id: 'matrix_dp', label: 'Matrix DP' },
      { id: 'state_machine', label: 'State Machine DP' },
      { id: 'interval_dp', label: 'Interval DP' },
    ],
  },
  {
    id: 'backtracking',
    label: 'Backtracking',
    subpatterns: [
      { id: 'permutations', label: 'Permutations' },
      { id: 'combinations', label: 'Combinations' },
      { id: 'subsets', label: 'Subsets' },
    ],
  },
  {
    id: 'heap',
    label: 'Heap / Priority Queue',
    subpatterns: [
      { id: 'top_k', label: 'Top K Elements' },
      { id: 'merge_k', label: 'Merge K Sorted' },
      { id: 'two_heaps', label: 'Two Heaps' },
    ],
  },
  {
    id: 'greedy',
    label: 'Greedy',
    subpatterns: [],
  },
  {
    id: 'intervals',
    label: 'Intervals',
    subpatterns: [
      { id: 'merge_intervals', label: 'Merge Intervals' },
      { id: 'insert_interval', label: 'Insert Interval' },
      { id: 'non_overlapping', label: 'Non-overlapping Intervals' },
      { id: 'segment_tree', label: 'Segment Tree' },
      { id: 'line_sweep', label: 'Line Sweep' },
    ],
  },
  {
    id: 'bit_manipulation',
    label: 'Bit Manipulation',
    subpatterns: [],
  },
  {
    id: 'trie',
    label: 'Trie',
    subpatterns: [],
  },
  {
    id: 'math',
    label: 'Math & Geometry',
    subpatterns: [],
  },
];

export function getPatternById(
  id: PatternIdType | string
): PatternDefinition | undefined {
  return PATTERNS.find((p) => p.id === id);
}

export function getSubpatternsForPattern(
  patternId: PatternIdType | string
): SubpatternDefinition[] {
  return getPatternById(patternId)?.subpatterns ?? [];
}

export function getAllPatternIds(): PatternIdType[] {
  return PATTERNS.map((p) => p.id);
}

export function isValidSubpattern(
  patternId: PatternIdType | string,
  subpatternId: SubpatternIdType | string
): boolean {
  const subpatterns = getSubpatternsForPattern(patternId);
  return subpatterns.some((s) => s.id === subpatternId);
}

export function isValidPatternId(id: string): id is PatternIdType {
  return Object.values(PatternId).includes(id as PatternIdType);
}

export function isValidSubpatternId(id: string): id is SubpatternIdType {
  return Object.values(SubpatternId).includes(id as SubpatternIdType);
}
