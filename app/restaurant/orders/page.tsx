'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WalkInOrderPanel } from '@/components/walk-in-order-panel'
import { TableRowSkeleton } from '@/components/skeleton'
import { OrderStatus } from '@/lib/mock-data'
import { MapPin, Package } from 'lucide-react'

type FilterStatus = 'all' | OrderStatus

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'waiting_confirmation', label: 'Waiting' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'almost_ready', label: 'Almost Ready' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
]

export default function RestaurantOrdersPage() {
  const { orders, restaurants } = useApp()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [isLoading] = useState(false)

  // Use first restaurant for demo
  const restaurant = restaurants[0]
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurant?.id)

  const filteredOrders = filter === 'all' 
    ? restaurantOrders 
    : restaurantOrders.filter(o => o.status === filter)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
            <p className="text-muted-foreground">View and filter all orders</p>
          </div>
          
          {restaurant && (
            <WalkInOrderPanel 
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              menu={restaurant.menu}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(value)}
              className={filter === value ? 'bg-primary hover:bg-primary/90' : ''}
            >
              {label}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Token</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={5} />
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No orders found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">{order.tokenNumber}</span>
                          {order.hasArrived && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {order.items.map(item => (
                            <p key={item.menuItem.id} className="text-sm text-muted-foreground">
                              {item.quantity}x {item.menuItem.name}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">${order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
