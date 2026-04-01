'use client'

import Link from 'next/link'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { ClipboardList, RotateCcw } from 'lucide-react'

export default function OrderHistoryPage() {
  const { orders, user, addToCart, setCurrentRestaurantId } = useApp()

  const userOrders = orders.filter(o => o.customerId === user?.id)

  const handleReorder = (order: typeof orders[0]) => {
    setCurrentRestaurantId(order.restaurantId)
    order.items.forEach(item => {
      addToCart(item)
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">Start exploring restaurants to place your first order</p>
            <Link href="/customer">
              <Button className="bg-primary hover:bg-primary/90">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{order.restaurantName}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Token: <span className="font-medium text-primary">{order.tokenNumber}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-foreground">${order.total.toFixed(2)}</span>
                        <span className="text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status !== 'completed' && (
                        <Link href={`/customer/order/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order)}
                        className="gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
