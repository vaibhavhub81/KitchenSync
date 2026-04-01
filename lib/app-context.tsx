'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { 
  User, UserRole, CartItem, Order, OrderStatus, AuditLog, SystemConfig,
  mockOrders, mockUsers, mockAuditLogs, defaultSystemConfig, mockRestaurants,
  LoadStatus, Restaurant
} from './mock-data'

interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

interface AppContextType {
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  loginAs: (role: UserRole) => void
  logout: () => void
  
  // Cart
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  currentRestaurantId: string | null
  setCurrentRestaurantId: (id: string | null) => void
  
  // Orders
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  markOrderArrived: (orderId: string) => void
  
  // Restaurant state
  restaurants: Restaurant[]
  updateRestaurantWorkload: (restaurantId: string, workload: number) => void
  addExternalLoad: (restaurantId: string, orderCount: number, duration: number) => void
  
  // Audit logs
  auditLogs: AuditLog[]
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
  
  // System config
  systemConfig: SystemConfig
  updateSystemConfig: (config: Partial<SystemConfig>) => void
  
  // Toasts
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
  dismissToast: (id: string) => void

  // Arrival alerts (for restaurant)
  arrivalAlerts: { orderId: string; tokenNumber: string }[]
  dismissArrivalAlert: (orderId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(defaultSystemConfig)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [arrivalAlerts, setArrivalAlerts] = useState<{ orderId: string; tokenNumber: string }[]>([])

  const loginAs = (role: UserRole) => {
    const mockUser = mockUsers.find(u => u.role === role)
    if (mockUser) {
      setUser(mockUser)
    }
  }

  const logout = () => {
    setUser(null)
    setCart([])
    setCurrentRestaurantId(null)
  }

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.menuItem.id)
      if (existing) {
        return prev.map(i => 
          i.menuItem.id === item.menuItem.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.menuItem.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev => prev.map(i => 
      i.menuItem.id === itemId ? { ...i, quantity } : i
    ))
  }

  const clearCart = () => {
    setCart([])
    setCurrentRestaurantId(null)
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev])
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const now = new Date().toISOString()
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const updates: Partial<Order> = { status }
      if (status === 'accepted') updates.acceptedAt = now
      if (status === 'preparing') updates.preparingAt = now
      if (status === 'ready' || status === 'almost_ready') updates.readyAt = now
      if (status === 'completed') updates.completedAt = now
      return { ...o, ...updates }
    }))
  }

  const markOrderArrived = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, hasArrived: true } : o
    ))
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setArrivalAlerts(prev => [...prev, { orderId, tokenNumber: order.tokenNumber }])
      showToast(`Token ${order.tokenNumber} has arrived`, 'info')
    }
  }

  const dismissArrivalAlert = (orderId: string) => {
    setArrivalAlerts(prev => prev.filter(a => a.orderId !== orderId))
  }

  const updateRestaurantWorkload = (restaurantId: string, workload: number) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r
      let status: LoadStatus = 'normal'
      if (workload >= systemConfig.overloadedThreshold) status = 'overloaded'
      else if (workload >= systemConfig.busyThreshold) status = 'busy'
      return { ...r, workloadPercent: workload, status }
    }))
  }

  const addExternalLoad = (restaurantId: string, orderCount: number, duration: number) => {
    // Simulate adding external orders by increasing workload
    const restaurant = restaurants.find(r => r.id === restaurantId)
    if (restaurant) {
      const additionalLoad = orderCount * 5 // Each order adds ~5% load
      const newWorkload = Math.min(100, restaurant.workloadPercent + additionalLoad)
      updateRestaurantWorkload(restaurantId, newWorkload)
      addAuditLog({
        type: 'external_load_added',
        message: `External load +${orderCount} orders added (${duration} min)`,
        restaurantId
      })
      showToast(`Kitchen load increased (+${orderCount} external orders)`, 'info')
    }
  }

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    setAuditLogs(prev => [newLog, ...prev])
  }

  const updateSystemConfig = (config: Partial<SystemConfig>) => {
    setSystemConfig(prev => ({ ...prev, ...config }))
  }

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}`
    setToasts(prev => [...prev, { id, message, type }])
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      loginAs,
      logout,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      orders,
      addOrder,
      updateOrderStatus,
      markOrderArrived,
      currentRestaurantId,
      setCurrentRestaurantId,
      restaurants,
      updateRestaurantWorkload,
      addExternalLoad,
      auditLogs,
      addAuditLog,
      systemConfig,
      updateSystemConfig,
      toasts,
      showToast,
      dismissToast,
      arrivalAlerts,
      dismissArrivalAlert,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
