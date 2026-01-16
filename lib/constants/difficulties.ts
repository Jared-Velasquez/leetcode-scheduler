import { LeetcodeDifficulty, PersonalDifficulty } from '@/types';

export interface DifficultyConfig {
  value: LeetcodeDifficulty;
  label: string;
  color: string;
}

export const LEETCODE_DIFFICULTIES: DifficultyConfig[] = [
  { value: LeetcodeDifficulty.EASY, label: 'Easy', color: 'text-green-500' },
  {
    value: LeetcodeDifficulty.MEDIUM,
    label: 'Medium',
    color: 'text-yellow-500',
  },
  { value: LeetcodeDifficulty.HARD, label: 'Hard', color: 'text-red-500' },
];

export interface PersonalDifficultyConfig {
  value: PersonalDifficulty;
  label: string;
  description: string;
}

export const PERSONAL_DIFFICULTIES: PersonalDifficultyConfig[] = [
  {
    value: PersonalDifficulty.TRIVIAL,
    label: 'Trivial',
    description: 'Knew it instantly',
  },
  {
    value: PersonalDifficulty.EASY,
    label: 'Easy',
    description: 'Minor hints needed',
  },
  {
    value: PersonalDifficulty.MEDIUM,
    label: 'Medium',
    description: 'Significant thinking required',
  },
  {
    value: PersonalDifficulty.HARD,
    label: 'Hard',
    description: 'Struggled considerably',
  },
  {
    value: PersonalDifficulty.IMPOSSIBLE,
    label: 'Impossible',
    description: 'Could not solve without solution',
  },
];

export function getLeetcodeDifficultyConfig(
  difficulty: LeetcodeDifficulty
): DifficultyConfig | undefined {
  return LEETCODE_DIFFICULTIES.find((d) => d.value === difficulty);
}

export function getPersonalDifficultyConfig(
  difficulty: PersonalDifficulty
): PersonalDifficultyConfig | undefined {
  return PERSONAL_DIFFICULTIES.find((d) => d.value === difficulty);
}
