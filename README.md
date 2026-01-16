## Leetcode Scheduler
### Overview
This repository contains Leetcode Scheduler, a web app that acts as a "personal notebook" and a queue when completing Leetcode problems.
This project was developed out of the idea of spaced repetition, a strategy to improve long-term memory by reviewing information at strategically
increasing intervals.

The main feature of Leetcode Scheduler is the "scheduling queue": after recording a solved Leetcode problem (along with date completed, Leetcode difficulty, and personal difficulty), Leetcode Scheduler will display a queue of upcoming problems you will need to re-solve (ordered by dates you need to complete them by) according to the SM-2 Spaced Repetition Algorithm. If you miss the date you need to re-solve a problem, this problem will be put on an "overdue queue".

Leetcode Scheduler also acts as a general notebook/database for Leetcode problems you solve (or intend to solve); problems are categorized by pattern (e.g. Stack, Dynamic Programming), and subpattern (e.g. Monotonic Stack, 0/1 Knapsack). Once a pattern is selected/queried, you can browse a database of your recorded problems (problems you have solved or intend to solve). 

Each recorded problem is identified by their Leetcode problem number and contains a list of zero or more "solves". Each solve records an instance of your problem completion, including time complexity, space complexity, pseudocode, and any other notes about the problem.

### Architecture
For fast developer velocity, Leetcode Scheduler has a very simple architecture: NextJS for the frontend web app and Supabase for backend-as-a-service (BaaS).