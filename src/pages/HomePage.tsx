import { ProblemQueue } from "@/components/dashboard/problem-queue/ProblemQueue";
import { QuestionCompletionCard } from "@/components/dashboard/question-completion-card/QuestionCompletionCard";
import { TrackerGraph } from "@/components/dashboard/tracker-graph/TrackerGraph";

export function HomePage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuestionCompletionCard difficultyType="EASY" uniqueCompleted={12} totalCompleted={30} />
                <QuestionCompletionCard difficultyType="MEDIUM" uniqueCompleted={5} totalCompleted={18} />
                <QuestionCompletionCard difficultyType="HARD" uniqueCompleted={2} totalCompleted={9} />
            </div>
            <TrackerGraph />
            <ProblemQueue />
        </div>
    );
}