'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatus, LoadStatus } from '@/lib/mock-data'
import { 
  Clock, Check, X, ChefHat, Bell, CheckCircle2, 
  Plus, AlertCircle, TrendingUp, MapPin
} from 'lucide-react'

export default function RestaurantDashboardPage() {
  const { 
    orders, updateOrderStatus, restaurants, updateRestaurantWorkload, 
    addExternalLoad, showToast, addAuditLog, systemConfig, 
    arrivalAlerts, dismissArrivalAlert
  } = useApp()
  
  // Use first restaurant for demo
  const restaurant = restaurants[0]
  const [countdown, setCountdown] = useState<Record<string, number>>({})

  // Filter orders for this restaurant
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurant?.id)
  const incomingOrders = restaurantOrders.filter(o => o.status === 'waiting_confirmation')
  const activeOrders = restaurantOrders.filter(o => 
    ['accepted', 'preparing', 'almost_ready', 'ready'].includes(o.status)
  )

  // Track countdown for incoming orders
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdown: Record<string, number> = {}
      incomingOrders.forEach(order => {
        const orderTime = new Date(order.createdAt).getTime()
        const timeoutMs = systemConfig.acceptanceTimeout * 60 * 1000
        const elapsed = Date.now() - orderTime
        const remaining = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000))
        newCountdown[order.id] = remaining
      })
      setCountdown(newCountdown)
    }, 1000)
    return () => clearInterval(interval)
  }, [incomingOrders, systemConfig.acceptanceTimeout])

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted')
    const order = orders.find(o => o.id === orderId)
    if (order) {
      addAuditLog({
        type: 'order_accepted',
        message: `Order ${order.tokenNumber} accepted`,
        orderId,
        restaurantId: restaurant?.id
      })
      showToast(`Order ${order.tokenNumber} accepted`, 'success')
    }
  }

  const handleRejectOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected')
    const order = orders.find(o => o.id === orderId)
    if (order) {
      addAuditLog({
        type: 'order_rejected',
        message: `Order ${order.tokenNumber} rejected - refund initiated`,
        orderId,
        restaurantId: restaurant?.id
      })
      showToast(`Order ${order.tokenNumber} rejected`, 'warning')
    }
  }

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus)
    const order = orders.find(o => o.id === orderId)
    if (order) {
      showToast(`Order ${order.tokenNumber} updated`, 'info')
    }
  }

  const handleAddExternalLoad = (count: number) => {
    if (restaurant) {
      addExternalLoad(restaurant.id, count, 15)
    }
  }

  const handleWorkloadChange = (value: number) => {
    if (restaurant) {
      updateRestaurantWorkload(restaurant.id, value)
    }
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'accepted': return 'preparing'
      case 'preparing': return 'almost_ready'
      case 'almost_ready': return 'ready'
      case 'ready': return 'completed'
      default: return null
    }
  }

  const getStatusAction = (status: OrderStatus) => {
    switch (status) {
      case 'accepted': return { label: 'Start Preparing', icon: ChefHat }
      case 'preparing': return { label: 'Almost Ready', icon: Bell }
      case 'almost_ready': return { label: 'Mark Ready', icon: CheckCircle2 }
      case 'ready': return { label: 'Complete', icon: Check }
      default: return null
    }
  }

  const getWorkloadColor = (percent: number): string => {
    if (percent >= systemConfig.overloadedThreshold) return 'bg-red-500'
    if (percent >= systemConfig.busyThreshold) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const currentLoadStatus: LoadStatus = 
    (restaurant?.workloadPercent || 0) >= systemConfig.overloadedThreshold ? 'overloaded' :
    (restaurant?.workloadPercent || 0) >= systemConfig.busyThreshold ? 'busy' : 'normal'

  const relevantArrivalAlerts = arrivalAlerts.filter(a => 
    restaurantOrders.some(o => o.id === a.orderId)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Manage incoming and active orders</p>
          </div>
        </div>

        {/* Arrival Alerts */}
        {relevantArrivalAlerts.length > 0 && (
          <div className="space-y-2">
            {relevantArrivalAlerts.map(alert => (
              <Card key={alert.orderId} className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-800">Customer Arrived</p>
                      <p className="text-sm text-emerald-700">Token {alert.tokenNumber} has arrived</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => dismissArrivalAlert(alert.orderId)}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Kitchen Load Panel */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Kitchen Load
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Status:</span>
              <StatusBadge status={currentLoadStatus} />
            </div>
            
            {/* Workload Meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Workload</span>
                <span className="font-medium">{restaurant?.workloadPercent || 0}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getWorkloadColor(restaurant?.workloadPercent || 0)}`}
                  style={{ width: `${restaurant?.workloadPercent || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Normal</span>
                <span>{systemConfig.busyThreshold}% Busy</span>
                <span>{systemConfig.overloadedThreshold}% Overloaded</span>
              </div>
            </div>

            {/* Manual Load Adjustment */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Adjust:</span>
              {[25, 50, 75, 90].map(value => (
                <Button
                  key={value}
                  size="sm"
                  variant="outline"
                  onClick={() => handleWorkloadChange(value)}
                  className={restaurant?.workloadPercent === value ? 'border-primary' : ''}
                >
                  {value}%
                </Button>
              ))}
            </div>

            {/* External Orders */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-2">Add External Orders (Zomato/Swiggy)</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 5].map(count => (
                  <Button
                    key={count}
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddExternalLoad(count)}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {count}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Adds to kitchen load without creating tokens
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incoming Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Incoming Orders
                {incomingOrders.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {incomingOrders.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {incomingOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No incoming orders</p>
                </div>
              ) : (
                incomingOrders.map(order => {
                  const remaining = countdown[order.id] || 0
                  const isUrgent = remaining < 120 // Less than 2 minutes

                  return (
                    <Card key={order.id} className={`bg-muted/50 ${isUrgent ? 'border-amber-300' : ''}`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">{order.tokenNumber}</span>
                          <div className="flex items-center gap-2">
                            {order.hasArrived && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                Arrived
                              </span>
                            )}
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          {order.items.map(item => (
                            <p key={item.menuItem.id} className="text-muted-foreground">
                              {item.quantity}x {item.menuItem.name}
                            </p>
                          ))}
                        </div>
                        
                        {/* Auto-cancel countdown */}
                        <div className={`flex items-center gap-1 text-xs ${isUrgent ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          <AlertCircle className="w-3 h-3" />
                          Auto-cancel in {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-semibold">${order.total.toFixed(2)}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectOrder(order.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptOrder(order.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Active Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                Active Orders
                {activeOrders.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {activeOrders.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                    <ChefHat className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No active orders</p>
                </div>
              ) : (
                activeOrders.map(order => {
                  const nextStatus = getNextStatus(order.status)
                  const action = getStatusAction(order.status)
                  const ActionIcon = action?.icon

                  return (
                    <Card key={order.id} className="bg-muted/50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">{order.tokenNumber}</span>
                          <div className="flex items-center gap-2">
                            {order.hasArrived && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Arrived
                              </span>
                            )}
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          {order.items.map(item => (
                            <p key={item.menuItem.id} className="text-muted-foreground">
                              {item.quantity}x {item.menuItem.name}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-semibold">${order.total.toFixed(2)}</span>
                          {nextStatus && action && ActionIcon && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, nextStatus)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <ActionIcon className="w-4 h-4 mr-1" />
                              {action.label}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
