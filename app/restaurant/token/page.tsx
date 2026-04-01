'use client'

import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, ChefHat, Clock } from 'lucide-react'

export default function TokenDisplayPage() {
  const { orders, restaurants } = useApp()

  // Use first restaurant for demo
  const restaurant = restaurants[0]
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurant?.id)

  // Get the current "ready" orders to display
  const readyOrders = restaurantOrders.filter(o => o.status === 'ready')
  const currentOrder = readyOrders[0]

  // Get "almost ready" orders
  const almostReadyOrders = restaurantOrders.filter(o => o.status === 'almost_ready').slice(0, 4)

  // Get preparing orders
  const preparingOrders = restaurantOrders.filter(o => o.status === 'preparing').slice(0, 4)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8 text-center">
        {/* Now Serving */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Bell className="w-8 h-8 text-emerald-600" />
            <p className="text-xl text-emerald-600 uppercase tracking-wider font-semibold">Now Serving</p>
          </div>
          {currentOrder ? (
            <h1 className="text-9xl font-bold text-primary animate-pulse">{currentOrder.tokenNumber}</h1>
          ) : (
            <h1 className="text-6xl font-bold text-muted-foreground/50">---</h1>
          )}
          {readyOrders.length > 1 && (
            <div className="flex justify-center gap-6 mt-4">
              {readyOrders.slice(1, 4).map(order => (
                <span key={order.id} className="text-4xl font-bold text-primary/80">{order.tokenNumber}</span>
              ))}
            </div>
          )}
        </div>

        {/* Almost Ready */}
        {almostReadyOrders.length > 0 && (
          <Card className="mt-8 border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-700 uppercase tracking-wider font-medium">Almost Ready</p>
              </div>
              <div className="flex justify-center gap-8">
                {almostReadyOrders.map(order => (
                  <div key={order.id} className="text-center">
                    <span className="text-3xl font-bold text-amber-700">{order.tokenNumber}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preparing */}
        {preparingOrders.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ChefHat className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Preparing</p>
              </div>
              <div className="flex justify-center gap-8">
                {preparingOrders.map(order => (
                  <div key={order.id} className="text-center">
                    <span className="text-2xl font-bold text-foreground/70">{order.tokenNumber}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {readyOrders.length === 0 && almostReadyOrders.length === 0 && preparingOrders.length === 0 && (
          <div className="py-12">
            <p className="text-xl text-muted-foreground">No active orders</p>
          </div>
        )}

        {/* Branding */}
        <div className="pt-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-2xl">KS</span>
          </div>
          <p className="mt-4 text-muted-foreground">{restaurant?.name || 'KitchenSync'}</p>
        </div>
      </div>
    </div>
  )
}
