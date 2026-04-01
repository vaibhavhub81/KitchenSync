'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { MenuItem, Order, calculateKitchenContribution } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Minus, Trash2, ShoppingCart, UserPlus } from 'lucide-react'

interface WalkInOrderPanelProps {
  restaurantId: string
  restaurantName: string
  menu: MenuItem[]
}

export function WalkInOrderPanel({ restaurantId, restaurantName, menu }: WalkInOrderPanelProps) {
  const { addOrder, addAuditLog, showToast, user } = useApp()
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})
  const [isOpen, setIsOpen] = useState(false)

  const availableMenu = menu.filter(item => item.available)

  const handleAddItem = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newCount = (prev[itemId] || 0) - 1
      if (newCount <= 0) {
        const { [itemId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: newCount }
    })
  }

  const handleClearItem = (itemId: string) => {
    setSelectedItems(prev => {
      const { [itemId]: _, ...rest } = prev
      return rest
    })
  }

  const getTotal = () => {
    return Object.entries(selectedItems).reduce((sum, [itemId, qty]) => {
      const item = menu.find(i => i.id === itemId)
      return sum + (item ? item.price * qty : 0)
    }, 0)
  }

  const getCartItems = () => {
    return Object.entries(selectedItems)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = menu.find(i => i.id === itemId)!
        return { menuItem: item, quantity: qty }
      })
  }

  const handleCreateOrder = () => {
    const cartItems = getCartItems()
    if (cartItems.length === 0) return

    const tokenNumber = `W-${String(Math.floor(Math.random() * 900) + 100)}`
    
    const newOrder: Order = {
      id: `ord-walk-${Date.now()}`,
      tokenNumber,
      restaurantId,
      restaurantName,
      items: cartItems,
      total: getTotal(),
      status: 'accepted', // Walk-ins are auto-accepted
      createdAt: new Date().toISOString(),
      acceptedAt: new Date().toISOString(),
      customerId: 'walk-in',
      notifyOnArrival: false,
      hasArrived: true, // They're already here
      estimatedPrepTime: calculateKitchenContribution(cartItems),
      paymentCompleted: true
    }

    addOrder(newOrder)
    addAuditLog({
      type: 'walk_in_created',
      message: `Walk-in order ${tokenNumber} created`,
      orderId: newOrder.id,
      restaurantId
    })
    showToast(`Walk-in order created: ${tokenNumber}`, 'success')
    setSelectedItems({})
    setIsOpen(false)
  }

  const itemCount = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Walk-In Order
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Walk-In Order
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 overflow-y-auto space-y-2">
          {availableMenu.map(item => {
            const qty = selectedItems[item.id] || 0
            return (
              <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {qty > 0 ? (
                    <>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleRemoveItem(item.id)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{qty}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleAddItem(item.id)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleClearItem(item.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleAddItem(item.id)}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {itemCount > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between font-medium">
              <span>Total ({itemCount} items)</span>
              <span className="text-primary">${getTotal().toFixed(2)}</span>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleCreateOrder}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Generate Token
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
