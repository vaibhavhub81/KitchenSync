// Mock data for KitchenSync

export type UserRole = 'customer' | 'restaurant' | 'admin'
export type LoadStatus = 'normal' | 'busy' | 'overloaded'
export type OrderStatus = 'waiting_confirmation' | 'accepted' | 'preparing' | 'almost_ready' | 'ready' | 'completed' | 'rejected' | 'timeout'
export type ItemCategory = 'normal' | 'special'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
}

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  available: boolean
  description?: string
  prepTime: number // in minutes
  itemType: ItemCategory // normal or special (longer prep)
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  waitTime: number
  status: LoadStatus
  image: string
  menu: MenuItem[]
  workloadPercent: number // 0-100 for workload meter
  lat?: number
  lng?: number
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface Order {
  id: string
  tokenNumber: string
  restaurantId: string
  restaurantName: string
  items: CartItem[]
  total: number
  status: OrderStatus
  createdAt: string
  customerId: string
  acceptedAt?: string
  preparingAt?: string
  readyAt?: string
  completedAt?: string
  notifyOnArrival: boolean
  hasArrived: boolean
  estimatedPrepTime: number
  paymentCompleted: boolean
}

export interface AuditLog {
  id: string
  type: 'order_rejected' | 'order_timeout' | 'external_load_added' | 'order_accepted' | 'walk_in_created'
  message: string
  timestamp: string
  orderId?: string
  restaurantId?: string
}

export interface SystemConfig {
  busyThreshold: number // workload percent to trigger busy
  overloadedThreshold: number // workload percent to trigger overloaded
  bufferTime: number // minutes to add to estimates
  acceptanceTimeout: number // minutes before auto-timeout
}

export const defaultSystemConfig: SystemConfig = {
  busyThreshold: 60,
  overloadedThreshold: 85,
  bufferTime: 3,
  acceptanceTimeout: 10
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    cuisine: 'Italian',
    waitTime: 15,
    status: 'normal',
    image: '/restaurant-1.jpg',
    workloadPercent: 35,
    lat: 51.505,
    lng: -0.09,
    menu: [
      { id: '1-1', name: 'Margherita Pizza', price: 14.99, category: 'Pizza', available: true, description: 'Classic tomato and mozzarella', prepTime: 12, itemType: 'normal' },
      { id: '1-2', name: 'Pepperoni Pizza', price: 16.99, category: 'Pizza', available: true, description: 'Loaded with pepperoni', prepTime: 12, itemType: 'normal' },
      { id: '1-3', name: 'Spaghetti Carbonara', price: 13.99, category: 'Pasta', available: true, description: 'Creamy egg-based sauce', prepTime: 15, itemType: 'normal' },
      { id: '1-4', name: 'Lasagna al Forno', price: 17.99, category: 'Pasta', available: true, description: 'Layered pasta with ragu', prepTime: 25, itemType: 'special' },
      { id: '1-5', name: 'Tiramisu', price: 7.99, category: 'Desserts', available: true, description: 'Classic Italian dessert', prepTime: 5, itemType: 'normal' },
      { id: '1-6', name: 'Gelato', price: 5.99, category: 'Desserts', available: false, description: 'Assorted flavors', prepTime: 3, itemType: 'normal' },
    ]
  },
  {
    id: '2',
    name: 'Tokyo Ramen House',
    cuisine: 'Japanese',
    waitTime: 25,
    status: 'busy',
    image: '/restaurant-2.jpg',
    workloadPercent: 72,
    lat: 51.51,
    lng: -0.1,
    menu: [
      { id: '2-1', name: 'Tonkotsu Ramen', price: 15.99, category: 'Ramen', available: true, description: 'Pork bone broth', prepTime: 18, itemType: 'special' },
      { id: '2-2', name: 'Miso Ramen', price: 14.99, category: 'Ramen', available: true, description: 'Fermented soybean broth', prepTime: 15, itemType: 'normal' },
      { id: '2-3', name: 'Shoyu Ramen', price: 14.99, category: 'Ramen', available: true, description: 'Soy sauce based', prepTime: 15, itemType: 'normal' },
      { id: '2-4', name: 'Gyoza (6pcs)', price: 8.99, category: 'Appetizers', available: true, description: 'Pan-fried dumplings', prepTime: 8, itemType: 'normal' },
      { id: '2-5', name: 'Edamame', price: 5.99, category: 'Appetizers', available: true, description: 'Steamed soybeans', prepTime: 3, itemType: 'normal' },
      { id: '2-6', name: 'Matcha Ice Cream', price: 4.99, category: 'Desserts', available: true, description: 'Green tea flavor', prepTime: 2, itemType: 'normal' },
    ]
  },
  {
    id: '3',
    name: 'Burger Barn',
    cuisine: 'American',
    waitTime: 35,
    status: 'overloaded',
    image: '/restaurant-3.jpg',
    workloadPercent: 92,
    lat: 51.515,
    lng: -0.095,
    menu: [
      { id: '3-1', name: 'Classic Burger', price: 11.99, category: 'Burgers', available: true, description: 'Beef patty with lettuce and tomato', prepTime: 10, itemType: 'normal' },
      { id: '3-2', name: 'Cheese Burger', price: 12.99, category: 'Burgers', available: true, description: 'With melted cheddar', prepTime: 10, itemType: 'normal' },
      { id: '3-3', name: 'Bacon Deluxe', price: 14.99, category: 'Burgers', available: true, description: 'Loaded with crispy bacon', prepTime: 12, itemType: 'normal' },
      { id: '3-4', name: 'Wagyu Burger', price: 24.99, category: 'Burgers', available: true, description: 'Premium wagyu beef patty', prepTime: 20, itemType: 'special' },
      { id: '3-5', name: 'French Fries', price: 4.99, category: 'Sides', available: true, description: 'Crispy golden fries', prepTime: 5, itemType: 'normal' },
      { id: '3-6', name: 'Milkshake', price: 6.99, category: 'Drinks', available: true, description: 'Chocolate or vanilla', prepTime: 3, itemType: 'normal' },
    ]
  },
  {
    id: '4',
    name: 'Spice Garden',
    cuisine: 'Indian',
    waitTime: 20,
    status: 'normal',
    image: '/restaurant-4.jpg',
    workloadPercent: 45,
    lat: 51.52,
    lng: -0.08,
    menu: [
      { id: '4-1', name: 'Butter Chicken', price: 16.99, category: 'Mains', available: true, description: 'Creamy tomato curry', prepTime: 18, itemType: 'normal' },
      { id: '4-2', name: 'Lamb Biryani', price: 19.99, category: 'Mains', available: true, description: 'Slow-cooked fragrant rice', prepTime: 30, itemType: 'special' },
      { id: '4-3', name: 'Palak Paneer', price: 13.99, category: 'Mains', available: true, description: 'Spinach and cheese', prepTime: 15, itemType: 'normal' },
      { id: '4-4', name: 'Naan', price: 3.99, category: 'Breads', available: true, description: 'Fluffy flatbread', prepTime: 5, itemType: 'normal' },
      { id: '4-5', name: 'Samosa (2pcs)', price: 5.99, category: 'Appetizers', available: true, description: 'Crispy pastry', prepTime: 6, itemType: 'normal' },
      { id: '4-6', name: 'Mango Lassi', price: 4.99, category: 'Drinks', available: true, description: 'Creamy mango drink', prepTime: 2, itemType: 'normal' },
    ]
  },
  {
    id: '5',
    name: 'El Taco Loco',
    cuisine: 'Mexican',
    waitTime: 10,
    status: 'normal',
    image: '/restaurant-5.jpg',
    workloadPercent: 25,
    lat: 51.50,
    lng: -0.11,
    menu: [
      { id: '5-1', name: 'Street Tacos (3pcs)', price: 10.99, category: 'Tacos', available: true, description: 'Authentic corn tortillas', prepTime: 8, itemType: 'normal' },
      { id: '5-2', name: 'Burrito Bowl', price: 12.99, category: 'Bowls', available: true, description: 'Rice, beans, and toppings', prepTime: 10, itemType: 'normal' },
      { id: '5-3', name: 'Carnitas Plate', price: 16.99, category: 'Mains', available: true, description: 'Slow-roasted pork', prepTime: 20, itemType: 'special' },
      { id: '5-4', name: 'Guacamole & Chips', price: 7.99, category: 'Appetizers', available: true, description: 'Fresh avocado dip', prepTime: 5, itemType: 'normal' },
      { id: '5-5', name: 'Churros', price: 5.99, category: 'Desserts', available: true, description: 'Cinnamon sugar sticks', prepTime: 6, itemType: 'normal' },
      { id: '5-6', name: 'Horchata', price: 3.99, category: 'Drinks', available: true, description: 'Sweet rice drink', prepTime: 1, itemType: 'normal' },
    ]
  },
  {
    id: '6',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    waitTime: 18,
    status: 'busy',
    image: '/restaurant-6.jpg',
    workloadPercent: 68,
    lat: 51.525,
    lng: -0.105,
    menu: [
      { id: '6-1', name: 'Kung Pao Chicken', price: 14.99, category: 'Mains', available: true, description: 'Spicy peanut chicken', prepTime: 12, itemType: 'normal' },
      { id: '6-2', name: 'Peking Duck', price: 32.99, category: 'Mains', available: true, description: 'Crispy whole roasted duck', prepTime: 45, itemType: 'special' },
      { id: '6-3', name: 'Fried Rice', price: 10.99, category: 'Rice', available: true, description: 'Wok-fried rice', prepTime: 8, itemType: 'normal' },
      { id: '6-4', name: 'Spring Rolls (4pcs)', price: 6.99, category: 'Appetizers', available: true, description: 'Crispy vegetable rolls', prepTime: 6, itemType: 'normal' },
      { id: '6-5', name: 'Dim Sum Platter', price: 12.99, category: 'Appetizers', available: true, description: 'Assorted dumplings', prepTime: 15, itemType: 'normal' },
      { id: '6-6', name: 'Fortune Cookies', price: 1.99, category: 'Desserts', available: true, description: 'Sweet and lucky', prepTime: 1, itemType: 'normal' },
    ]
  },
]

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    tokenNumber: 'A-042',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    items: [
      { menuItem: mockRestaurants[0].menu[0], quantity: 1 },
      { menuItem: mockRestaurants[0].menu[2], quantity: 2 },
    ],
    total: 42.97,
    status: 'preparing',
    createdAt: '2024-01-15T14:30:00Z',
    acceptedAt: '2024-01-15T14:32:00Z',
    preparingAt: '2024-01-15T14:33:00Z',
    customerId: 'cust-001',
    notifyOnArrival: true,
    hasArrived: false,
    estimatedPrepTime: 15,
    paymentCompleted: true
  },
  {
    id: 'ord-002',
    tokenNumber: 'B-018',
    restaurantId: '2',
    restaurantName: 'Tokyo Ramen House',
    items: [
      { menuItem: mockRestaurants[1].menu[0], quantity: 2 },
      { menuItem: mockRestaurants[1].menu[3], quantity: 1 },
    ],
    total: 40.97,
    status: 'completed',
    createdAt: '2024-01-14T12:15:00Z',
    acceptedAt: '2024-01-14T12:17:00Z',
    preparingAt: '2024-01-14T12:18:00Z',
    readyAt: '2024-01-14T12:35:00Z',
    completedAt: '2024-01-14T12:40:00Z',
    customerId: 'cust-001',
    notifyOnArrival: false,
    hasArrived: true,
    estimatedPrepTime: 18,
    paymentCompleted: true
  },
  {
    id: 'ord-003',
    tokenNumber: 'C-007',
    restaurantId: '3',
    restaurantName: 'Burger Barn',
    items: [
      { menuItem: mockRestaurants[2].menu[2], quantity: 1 },
      { menuItem: mockRestaurants[2].menu[4], quantity: 2 },
    ],
    total: 24.97,
    status: 'ready',
    createdAt: '2024-01-15T13:00:00Z',
    acceptedAt: '2024-01-15T13:02:00Z',
    preparingAt: '2024-01-15T13:03:00Z',
    readyAt: '2024-01-15T13:15:00Z',
    customerId: 'cust-002',
    notifyOnArrival: true,
    hasArrived: true,
    estimatedPrepTime: 12,
    paymentCompleted: true
  },
]

export const mockAuditLogs: AuditLog[] = [
  { id: 'log-001', type: 'order_accepted', message: 'Order A-042 accepted by Bella Italia', timestamp: '2024-01-15T14:32:00Z', orderId: 'ord-001', restaurantId: '1' },
  { id: 'log-002', type: 'external_load_added', message: 'External load +3 orders added (15 min)', timestamp: '2024-01-15T14:00:00Z', restaurantId: '2' },
  { id: 'log-003', type: 'order_timeout', message: 'Order D-015 timed out - auto refund initiated', timestamp: '2024-01-15T13:45:00Z', orderId: 'ord-004' },
  { id: 'log-004', type: 'order_rejected', message: 'Order E-022 rejected by Dragon Palace', timestamp: '2024-01-15T12:30:00Z', orderId: 'ord-005', restaurantId: '6' },
  { id: 'log-005', type: 'walk_in_created', message: 'Walk-in order F-001 created at Burger Barn', timestamp: '2024-01-15T12:00:00Z', restaurantId: '3' },
]

export const mockUsers: User[] = [
  { id: 'cust-001', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', role: 'customer' },
  { id: 'cust-002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', role: 'customer' },
  { id: 'rest-001', name: 'Mario Rossi', email: 'mario@bellaitalia.com', phone: '+1 234 567 8902', role: 'restaurant' },
  { id: 'admin-001', name: 'Admin User', email: 'admin@kitchensync.com', phone: '+1 234 567 8903', role: 'admin' },
]

export const mockStats = {
  totalRestaurants: 6,
  activeOrders: 12,
  totalUsers: 248,
  todayOrders: 47,
  revenue: 2847.50,
}

// Helper functions
export function getWaitTimeLabel(status: LoadStatus, waitTime: number): string {
  if (status === 'normal') {
    return `~${waitTime} min wait`
  } else if (status === 'busy') {
    return `Busy for ~${waitTime} minutes`
  } else {
    return `Overloaded - ~${waitTime}+ min`
  }
}

export function calculateKitchenContribution(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.menuItem.prepTime * item.quantity)
  }, 0)
}

export function getLoadStatusFromWorkload(workload: number, config: SystemConfig = defaultSystemConfig): LoadStatus {
  if (workload >= config.overloadedThreshold) return 'overloaded'
  if (workload >= config.busyThreshold) return 'busy'
  return 'normal'
}
