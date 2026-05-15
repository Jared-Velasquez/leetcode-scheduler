import { LeetcodeDifficulty } from "@/types";

export interface LeetcodeProblemDetails {
  questionId: string;
  title: string;
  difficulty: LeetcodeDifficulty;
}

/**
 * Extract the titleSlug from a LeetCode URL
 * e.g., "https://leetcode.com/problems/two-sum/" -> "two-sum"
 */
export function extractTitleSlug(url: string): string | null {
  const match = url.match(/leetcode\.com\/problems\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Fetch problem details via our API route (to avoid CORS issues)
 */
export async function fetchProblemDetails(
  titleSlug: string,
): Promise<LeetcodeProblemDetails> {
  const response = await fetch("/api/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ titleSlug }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch problem details");
  }

  const data = await response.json();

  return {
    questionId: data.questionId,
    title: data.title,
    difficulty: data.difficulty as LeetcodeDifficulty,
  };
}

/**
 * Fetch problem details from a LeetCode URL
 */
export async function fetchProblemDetailsFromUrl(
  url: string,
): Promise<LeetcodeProblemDetails> {
  const titleSlug = extractTitleSlug(url);

  if (!titleSlug) {
    throw new Error("Invalid LeetCode URL");
  }

  return fetchProblemDetails(titleSlug);
}
