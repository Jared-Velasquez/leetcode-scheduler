export interface PatternDefinition {
  id: string;
  label: string;
  subpatterns: SubpatternDefinition[];
}

export interface SubpatternDefinition {
  id: string;
  label: string;
}

export const PATTERNS: PatternDefinition[] = [
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
      { id: 'segment_tree', label: 'Segment Tree' },
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

export function getPatternById(id: string): PatternDefinition | undefined {
  return PATTERNS.find((p) => p.id === id);
}

export function getSubpatternsForPattern(
  patternId: string
): SubpatternDefinition[] {
  return getPatternById(patternId)?.subpatterns ?? [];
}

export function getAllPatternIds(): string[] {
  return PATTERNS.map((p) => p.id);
}

export function isValidSubpattern(
  patternId: string,
  subpatternId: string
): boolean {
  const subpatterns = getSubpatternsForPattern(patternId);
  return subpatterns.some((s) => s.id === subpatternId);
}
