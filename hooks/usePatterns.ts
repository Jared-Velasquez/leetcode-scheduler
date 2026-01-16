'use client';

import { useMemo } from 'react';
import {
  PATTERNS,
  PatternDefinition,
  SubpatternDefinition,
  getPatternById,
  getSubpatternsForPattern,
} from '@/lib/constants/patterns';

export function usePatterns() {
  return useMemo(
    () => ({
      patterns: PATTERNS,
      getPatternById,
      getSubpatternsForPattern,
    }),
    []
  );
}

export function usePattern(patternId: string | undefined) {
  return useMemo(() => {
    if (!patternId) return { pattern: undefined, subpatterns: [] };

    const pattern = getPatternById(patternId);
    const subpatterns = getSubpatternsForPattern(patternId);

    return { pattern, subpatterns };
  }, [patternId]);
}

export function usePatternOptions() {
  return useMemo(
    () =>
      PATTERNS.map((p) => ({
        value: p.id,
        label: p.label,
      })),
    []
  );
}

export function useSubpatternOptions(patternId: string | undefined) {
  return useMemo(() => {
    if (!patternId) return [];

    const subpatterns = getSubpatternsForPattern(patternId);
    return subpatterns.map((s) => ({
      value: s.id,
      label: s.label,
    }));
  }, [patternId]);
}
