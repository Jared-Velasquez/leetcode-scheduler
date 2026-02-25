-- Move segment_tree subpattern from trees pattern to intervals pattern
UPDATE problems
SET pattern_id = 'intervals'
WHERE pattern_id = 'trees' AND subpattern_id = 'segment_tree';
