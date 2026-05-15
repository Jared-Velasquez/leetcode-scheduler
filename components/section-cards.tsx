import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SolveStatsByDifficulty } from "@/services/solves.service"

interface SectionCardsProps {
  stats: SolveStatsByDifficulty
}

function TrendBadge({
  percentChange,
  borderColor,
}: {
  percentChange: number | null
  borderColor: string
}) {
  if (percentChange === null) {
    return (
      <Badge variant="outline" className={borderColor}>
        New
      </Badge>
    )
  }

  const isPositive = percentChange >= 0
  const Icon = isPositive ? IconTrendingUp : IconTrendingDown
  const sign = isPositive ? "+" : ""

  return (
    <Badge variant="outline" className={borderColor}>
      <Icon />
      {sign}{percentChange}%
    </Badge>
  )
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Easy Solves</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.easy.count}
          </CardTitle>
          <CardAction>
            <TrendBadge
              percentChange={stats.easy.percentChange}
              borderColor="border-green-600"
            />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Medium Solves</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.medium.count}
          </CardTitle>
          <CardAction>
            <TrendBadge
              percentChange={stats.medium.percentChange}
              borderColor="border-yellow-500"
            />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Hard Solves</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.hard.count}
          </CardTitle>
          <CardAction>
            <TrendBadge
              percentChange={stats.hard.percentChange}
              borderColor="border-red-600"
            />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
