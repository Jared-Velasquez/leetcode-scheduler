import { NextResponse } from "next/server";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

interface LeetcodeGraphQLResponse {
  data?: {
    question?: {
      questionFrontendId: string;
      title: string;
      difficulty: string;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function POST(request: Request) {
  try {
    const { titleSlug } = await request.json();

    if (!titleSlug || typeof titleSlug !== "string") {
      return NextResponse.json(
        { error: "titleSlug is required" },
        { status: 400 }
      );
    }

    const query = `
      query getQuestionDetail($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionFrontendId
          title
          difficulty
        }
      }
    `;

    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { titleSlug },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch problem details from LeetCode" },
        { status: 502 }
      );
    }

    const result: LeetcodeGraphQLResponse = await response.json();

    if (result.errors?.length) {
      return NextResponse.json(
        { error: result.errors[0].message },
        { status: 400 }
      );
    }

    const question = result.data?.question;
    if (!question?.questionFrontendId || !question?.title || !question?.difficulty) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      questionId: question.questionFrontendId,
      title: question.title,
      difficulty: question.difficulty.toLowerCase(),
    });
  } catch (error) {
    console.error("Error fetching LeetCode problem:", error);
    return NextResponse.json(
      { error: "Failed to fetch problem details" },
      { status: 500 }
    );
  }
}
