-- Add non_overlapping as a subpattern under the intervals pattern
UPDATE problems
SET pattern_id = 'intervals'
WHERE subpattern_id = 'non_overlapping' AND pattern_id != 'intervals';
