import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBrain,
  IconCalendarEvent,
  IconCategory,
  IconChartBar,
  IconCode,
  IconRepeat,
} from "@tabler/icons-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <IconCode className="size-6 text-primary" />
            <span className="text-lg font-semibold">Leetcode Scheduler</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Master LeetCode problems with{" "}
          <span className="text-primary">spaced repetition</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Leetcode Scheduler automatically schedules your problem reviews at
          optimal intervals, helping you build lasting knowledge for technical
          interviews.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">Get started for free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign in to your account</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to retain what you learn
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete system for tracking, scheduling, and mastering LeetCode
              problems.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconRepeat className="size-5 text-primary" />
                </div>
                <CardTitle>Spaced Repetition</CardTitle>
                <CardDescription>
                  The SM-2 algorithm calculates optimal review intervals based
                  on how well you remember each problem, maximizing retention
                  with minimal effort.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconCalendarEvent className="size-5 text-primary" />
                </div>
                <CardTitle>Smart Queue</CardTitle>
                <CardDescription>
                  See exactly which problems are due for review. Problems are
                  organized into overdue and upcoming queues, so you always know
                  what to practice next.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconCategory className="size-5 text-primary" />
                </div>
                <CardTitle>Pattern Organization</CardTitle>
                <CardDescription>
                  Organize problems by 16 common patterns like Two Pointers,
                  Sliding Window, Dynamic Programming, and more to build
                  systematic problem-solving skills.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconChartBar className="size-5 text-primary" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Track your solve history, difficulty ratings, and improvement
                  over time. See your stats at a glance on your personal
                  dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <IconBrain className="size-5 text-primary" />
                </div>
                <CardTitle>Difficulty Ratings</CardTitle>
                <CardDescription>
                  Rate how difficult each problem felt after solving. Your
                  ratings fine-tune the algorithm to focus more on problems you
                  find challenging.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to never forget a LeetCode solution again.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold">Add problems</h3>
              <p className="text-muted-foreground">
                Paste a LeetCode URL and the problem is automatically added to
                your library with all its details.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold">Solve and rate</h3>
              <p className="text-muted-foreground">
                After solving a problem, rate how difficult it felt. This
                feedback trains the scheduling algorithm.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold">Review on schedule</h3>
              <p className="text-muted-foreground">
                Check your queue daily. The algorithm schedules reviews at the
                perfect time to cement your knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to ace your technical interviews?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join developers who are building lasting problem-solving skills with
            spaced repetition.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Create your free account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
