import Link from 'next/link'
import { Restaurant, getWaitTimeLabel } from '@/lib/mock-data'
import { StatusBadge } from './status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Utensils } from 'lucide-react'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const waitLabel = getWaitTimeLabel(restaurant.status, restaurant.waitTime)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-36 bg-muted flex items-center justify-center">
        <Utensils className="w-12 h-12 text-muted-foreground/40" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
            <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
          </div>
          <StatusBadge status={restaurant.status} />
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{waitLabel}</span>
        </div>

        <Link href={`/customer/restaurant/${restaurant.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90">
            View Menu
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
