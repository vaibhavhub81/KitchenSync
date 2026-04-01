'use client'

import { useState } from 'react'
import { mockRestaurants, Restaurant } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Store } from 'lucide-react'

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState(mockRestaurants)

  const handleStatusChange = (restaurantId: string, newStatus: Restaurant['status']) => {
    setRestaurants(prev => prev.map(r => 
      r.id === restaurantId ? { ...r, status: newStatus } : r
    ))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Restaurants</h1>
            <p className="text-muted-foreground">Manage all restaurants in the network</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Store className="w-4 h-4 mr-2" />
            Add Restaurant
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Restaurant</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cuisine</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Wait Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(restaurant => (
                  <tr key={restaurant.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">{restaurant.name}</p>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{restaurant.cuisine}</td>
                    <td className="px-4 py-4 text-muted-foreground">{restaurant.waitTime} min</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={restaurant.status} />
                    </td>
                    <td className="px-4 py-4">
                      <Select
                        value={restaurant.status}
                        onValueChange={(value: Restaurant['status']) => handleStatusChange(restaurant.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="overloaded">Overloaded</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
