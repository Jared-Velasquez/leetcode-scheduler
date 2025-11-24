import { Button } from "@/components/ui/button";
import { createProblem, getProblem } from "@/lib/api/problemApi";
import { useState } from "react";
import type { Problem } from "@/domain/problem";

export function ProblemsPage() {
    const [problem, setProblem] = useState<Problem | null>(null);
    const AddProblem = async () => {
        console.log("Adding problem...");
        await createProblem({
            id: 3,
            title: "Two Sum",
            url: "https://leetcode.com/problems/two-sum/",
            difficulty: "EASY",
            topics: ["Array", "Hash Table"],
        });
        const fetchedProblem = await getProblem(1);
        if (!fetchedProblem) {
            console.error("Failed to fetch problem after creation");
            return;
        }
        setProblem(fetchedProblem);
    }
    return (
        <div>
            <button onClick={AddProblem}>Test Button</button>
            {problem && (<div>
                <h2>{problem.title}</h2>
                <p>Difficulty: {problem.difficulty}</p>
                <p>URL: {problem.url}</p>
                <p>Topics: {problem.topics.join(", ")}</p>
            </div>)}
        </div>
    );
}