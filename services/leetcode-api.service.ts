import { LeetcodeDifficulty } from "@/types";

const LEETCODE_API_BASE_URL = "https://alfa-leetcode-api.onrender.com";

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
 * Fetch problem details from LeetCode using the alfa-leetcode-api
 * Results are cached globally since problem data is static
 */
export async function fetchProblemDetails(
  titleSlug: string,
): Promise<LeetcodeProblemDetails> {
  const response = await fetch(
    `${LEETCODE_API_BASE_URL}/select?titleSlug=${encodeURIComponent(titleSlug)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch problem details from LeetCode");
  }

  const data = await response.json();

  if (!data.questionId || !data.questionTitle || !data.difficulty) {
    throw new Error("Invalid response from LeetCode API");
  }

  const problemDetails: LeetcodeProblemDetails = {
    questionId: data.questionId,
    title: data.questionTitle,
    difficulty: data.difficulty.toLowerCase() as LeetcodeDifficulty,
  };

  return problemDetails;
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
