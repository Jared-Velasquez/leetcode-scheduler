import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900 px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Leetcode
          <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Scheduler
          </span>
        </h1>

        <p className="mb-10 text-lg text-zinc-400">
          Track your LeetCode progress with spaced repetition. Never forget a
          solution again.
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600"
            asChild
          >
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
