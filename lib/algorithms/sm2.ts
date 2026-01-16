import { PersonalDifficulty } from '@/types';
import { SM2Result } from '@/types/solve';
import { addDays } from '@/lib/utils/date';

const DEFAULT_EASINESS_FACTOR = 2.5;
const MIN_EASINESS_FACTOR = 1.3;

/**
 * SM-2 Spaced Repetition Algorithm
 *
 * The SM-2 algorithm calculates optimal review intervals based on
 * how easily you recalled the information.
 *
 * Quality scale (0-5):
 * - 5: Perfect response
 * - 4: Correct response after hesitation
 * - 3: Correct response with difficulty
 * - 2: Incorrect response but easy to recall
 * - 1: Incorrect response, remembered after seeing answer
 * - 0: Complete blackout
 *
 * PersonalDifficulty mapping:
 * - TRIVIAL (1) -> Quality 5
 * - EASY (2) -> Quality 4
 * - MEDIUM (3) -> Quality 3
 * - HARD (4) -> Quality 2
 * - IMPOSSIBLE (5) -> Quality 0
 */
export function calculateSM2(
  quality: number,
  previousEF: number = DEFAULT_EASINESS_FACTOR,
  previousInterval: number = 0,
  previousRepetition: number = 0
): SM2Result {
  // Quality must be between 0 and 5
  const clampedQuality = Math.max(0, Math.min(5, quality));

  // If quality < 3, reset repetition (failed recall)
  if (clampedQuality < 3) {
    return {
      easinessFactor: previousEF,
      interval: 1,
      repetition: 0,
      nextReviewDate: addDays(new Date(), 1),
    };
  }

  // Calculate new easiness factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEF = Math.max(
    MIN_EASINESS_FACTOR,
    previousEF + (0.1 - (5 - clampedQuality) * (0.08 + (5 - clampedQuality) * 0.02))
  );

  // Calculate new interval
  let newInterval: number;
  if (previousRepetition === 0) {
    newInterval = 1;
  } else if (previousRepetition === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(previousInterval * newEF);
  }

  return {
    easinessFactor: newEF,
    interval: newInterval,
    repetition: previousRepetition + 1,
    nextReviewDate: addDays(new Date(), newInterval),
  };
}

/**
 * Convert PersonalDifficulty (1-5) to SM-2 quality (5-0)
 * Inverted: easier personal difficulty = higher quality score
 */
export function personalDifficultyToQuality(pd: PersonalDifficulty): number {
  // TRIVIAL (1) -> 5, EASY (2) -> 4, MEDIUM (3) -> 3, HARD (4) -> 2, IMPOSSIBLE (5) -> 0
  if (pd === PersonalDifficulty.IMPOSSIBLE) {
    return 0;
  }
  return 6 - pd;
}

/**
 * Calculate SM-2 result from PersonalDifficulty
 * Convenience function that combines conversion and calculation
 */
export function calculateSM2FromDifficulty(
  personalDifficulty: PersonalDifficulty,
  previousEF: number = DEFAULT_EASINESS_FACTOR,
  previousInterval: number = 0,
  previousRepetition: number = 0
): SM2Result {
  const quality = personalDifficultyToQuality(personalDifficulty);
  return calculateSM2(quality, previousEF, previousInterval, previousRepetition);
}

/**
 * Get initial SM-2 values for a first-time solve
 */
export function getInitialSM2Values(personalDifficulty: PersonalDifficulty): SM2Result {
  return calculateSM2FromDifficulty(personalDifficulty);
}
