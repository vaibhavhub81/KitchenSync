// Mock data for KitchenSync — Pune, India

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
    name: 'Shreyas Misal House',
    cuisine: 'Maharashtrian',
    waitTime: 12,
    status: 'normal',
    image: '/restaurant-1.jpg',
    workloadPercent: 38,
    lat: 18.5204,
    lng: 73.8567,
    menu: [
      { id: '1-1', name: 'Puneri Misal Pav', price: 120, category: 'Misal', available: true, description: 'Spicy sprouted moth beans with pav', prepTime: 10, itemType: 'normal' },
      { id: '1-2', name: 'Kolhapuri Misal', price: 140, category: 'Misal', available: true, description: 'Extra fiery Kolhapuri style', prepTime: 10, itemType: 'normal' },
      { id: '1-3', name: 'Thalipeeth', price: 100, category: 'Breakfast', available: true, description: 'Multi-grain flatbread with curd', prepTime: 12, itemType: 'normal' },
      { id: '1-4', name: 'Sabudana Khichdi', price: 110, category: 'Breakfast', available: true, description: 'Sago with peanuts and ghee', prepTime: 15, itemType: 'special' },
      { id: '1-5', name: 'Shrikhand Puri', price: 130, category: 'Sweets', available: true, description: 'Strained yogurt with deep-fried puri', prepTime: 8, itemType: 'normal' },
      { id: '1-6', name: 'Modak', price: 80, category: 'Sweets', available: false, description: 'Steamed sweet dumpling', prepTime: 20, itemType: 'special' },
    ]
  },
  {
    id: '2',
    name: 'Vaishali Restaurant',
    cuisine: 'South Indian',
    waitTime: 20,
    status: 'busy',
    image: '/restaurant-2.jpg',
    workloadPercent: 74,
    lat: 18.5208,
    lng: 73.8412,
    menu: [
      { id: '2-1', name: 'Masala Dosa', price: 130, category: 'Dosa', available: true, description: 'Crispy dosa with spiced potato filling', prepTime: 12, itemType: 'normal' },
      { id: '2-2', name: 'Mysore Masala Dosa', price: 150, category: 'Dosa', available: true, description: 'With red chutney spread', prepTime: 14, itemType: 'normal' },
      { id: '2-3', name: 'Uttapam', price: 120, category: 'Dosa', available: true, description: 'Thick pancake with onion tomato', prepTime: 12, itemType: 'normal' },
      { id: '2-4', name: 'Idli Sambar (4pcs)', price: 100, category: 'Idli', available: true, description: 'Steamed rice cakes with lentil soup', prepTime: 8, itemType: 'normal' },
      { id: '2-5', name: 'Medu Vada (2pcs)', price: 80, category: 'Snacks', available: true, description: 'Crispy lentil fritters', prepTime: 8, itemType: 'normal' },
      { id: '2-6', name: 'Filter Coffee', price: 50, category: 'Beverages', available: true, description: 'Strong South Indian decoction', prepTime: 3, itemType: 'normal' },
    ]
  },
  {
    id: '3',
    name: 'Barbeque Nation Pune',
    cuisine: 'Grill & BBQ',
    waitTime: 40,
    status: 'overloaded',
    image: '/restaurant-3.jpg',
    workloadPercent: 91,
    lat: 18.5525,
    lng: 73.8998,
    menu: [
      { id: '3-1', name: 'Chicken Tikka', price: 380, category: 'Starters', available: true, description: 'Marinated tandoori chicken', prepTime: 20, itemType: 'normal' },
      { id: '3-2', name: 'Malai Kebab', price: 420, category: 'Starters', available: true, description: 'Creamy chicken on skewers', prepTime: 22, itemType: 'normal' },
      { id: '3-3', name: 'Peri Peri Prawn', price: 490, category: 'Starters', available: true, description: 'Spicy grilled prawns', prepTime: 18, itemType: 'normal' },
      { id: '3-4', name: 'Lamb Galouti Kebab', price: 550, category: 'Starters', available: true, description: 'Melt-in-mouth minced lamb patties', prepTime: 30, itemType: 'special' },
      { id: '3-5', name: 'Butter Naan', price: 80, category: 'Breads', available: true, description: 'Fluffy tandoor bread', prepTime: 6, itemType: 'normal' },
      { id: '3-6', name: 'Gulab Jamun (3pcs)', price: 120, category: 'Desserts', available: true, description: 'Soft milk-solid balls in syrup', prepTime: 5, itemType: 'normal' },
    ]
  },
  {
    id: '4',
    name: 'Cafe Goodluck',
    cuisine: 'Irani Cafe',
    waitTime: 15,
    status: 'normal',
    image: '/restaurant-4.jpg',
    workloadPercent: 42,
    lat: 18.5173,
    lng: 73.8415,
    menu: [
      { id: '4-1', name: 'Bun Maska', price: 60, category: 'Breakfast', available: true, description: 'Soft bun with generous butter', prepTime: 4, itemType: 'normal' },
      { id: '4-2', name: 'Akuri on Toast', price: 130, category: 'Eggs', available: true, description: 'Parsi-style scrambled eggs', prepTime: 10, itemType: 'normal' },
      { id: '4-3', name: 'Chicken Berry Pulao', price: 280, category: 'Rice', available: true, description: 'Parsi-style rice with salli chicken', prepTime: 25, itemType: 'special' },
      { id: '4-4', name: 'Keema Pav', price: 160, category: 'Mains', available: true, description: 'Spiced mutton mince with pav', prepTime: 15, itemType: 'normal' },
      { id: '4-5', name: 'Irani Chai', price: 40, category: 'Beverages', available: true, description: 'Creamy slow-brewed tea', prepTime: 3, itemType: 'normal' },
      { id: '4-6', name: 'Mawa Cake', price: 70, category: 'Bakery', available: true, description: 'Traditional Parsi milk cake', prepTime: 2, itemType: 'normal' },
    ]
  },
  {
    id: '5',
    name: 'Surve Khanaval',
    cuisine: 'Konkani Thali',
    waitTime: 10,
    status: 'normal',
    image: '/restaurant-5.jpg',
    workloadPercent: 28,
    lat: 18.5089,
    lng: 73.8259,
    menu: [
      { id: '5-1', name: 'Kombdi Vade', price: 220, category: 'Mains', available: true, description: 'Malvani chicken curry with fluffy vade', prepTime: 18, itemType: 'normal' },
      { id: '5-2', name: 'Solkadhi', price: 60, category: 'Beverages', available: true, description: 'Kokum coconut digestive drink', prepTime: 3, itemType: 'normal' },
      { id: '5-3', name: 'Fish Thali', price: 350, category: 'Thali', available: true, description: 'Surmai curry, rice, bhakri, sol kadhi', prepTime: 25, itemType: 'special' },
      { id: '5-4', name: 'Vangyache Bharit', price: 130, category: 'Vegetarian', available: true, description: 'Roasted eggplant mash', prepTime: 12, itemType: 'normal' },
      { id: '5-5', name: 'Bhakri', price: 30, category: 'Breads', available: true, description: 'Jowar flatbread', prepTime: 5, itemType: 'normal' },
      { id: '5-6', name: 'Coconut Sheera', price: 90, category: 'Desserts', available: true, description: 'Sweet semolina with coconut', prepTime: 8, itemType: 'normal' },
    ]
  },
  {
    id: '6',
    name: 'Momo Station FC',
    cuisine: 'Tibetan & Chinese',
    waitTime: 22,
    status: 'busy',
    image: '/restaurant-6.jpg',
    workloadPercent: 67,
    lat: 18.5236,
    lng: 73.8478,
    menu: [
      { id: '6-1', name: 'Steamed Chicken Momos (8pcs)', price: 150, category: 'Momos', available: true, description: 'Juicy chicken dumplings', prepTime: 15, itemType: 'normal' },
      { id: '6-2', name: 'Pan-Fried Veg Momos (8pcs)', price: 130, category: 'Momos', available: true, description: 'Crispy bottomed vegetable dumplings', prepTime: 18, itemType: 'normal' },
      { id: '6-3', name: 'Schezwan Momos (8pcs)', price: 170, category: 'Momos', available: true, description: 'Tossed in fiery Schezwan sauce', prepTime: 18, itemType: 'normal' },
      { id: '6-4', name: 'Thukpa Noodle Soup', price: 180, category: 'Soups', available: true, description: 'Tibetan noodle soup with veggies', prepTime: 20, itemType: 'special' },
      { id: '6-5', name: 'Wonton Soup', price: 140, category: 'Soups', available: true, description: 'Clear broth with stuffed wontons', prepTime: 12, itemType: 'normal' },
      { id: '6-6', name: 'Taro Bubble Tea', price: 120, category: 'Beverages', available: true, description: 'Creamy taro with tapioca pearls', prepTime: 4, itemType: 'normal' },
    ]
  },
]

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    tokenNumber: 'A-042',
    restaurantId: '1',
    restaurantName: 'Shreyas Misal House',
    items: [
      { menuItem: mockRestaurants[0].menu[0], quantity: 2 },
      { menuItem: mockRestaurants[0].menu[2], quantity: 1 },
    ],
    total: 340,
    status: 'preparing',
    createdAt: '2024-03-15T08:30:00Z',
    acceptedAt: '2024-03-15T08:32:00Z',
    preparingAt: '2024-03-15T08:33:00Z',
    customerId: 'cust-001',
    notifyOnArrival: true,
    hasArrived: false,
    estimatedPrepTime: 12,
    paymentCompleted: true
  },
  {
    id: 'ord-002',
    tokenNumber: 'B-018',
    restaurantId: '2',
    restaurantName: 'Vaishali Restaurant',
    items: [
      { menuItem: mockRestaurants[1].menu[0], quantity: 2 },
      { menuItem: mockRestaurants[1].menu[3], quantity: 1 },
    ],
    total: 360,
    status: 'completed',
    createdAt: '2024-03-14T12:15:00Z',
    acceptedAt: '2024-03-14T12:17:00Z',
    preparingAt: '2024-03-14T12:18:00Z',
    readyAt: '2024-03-14T12:32:00Z',
    completedAt: '2024-03-14T12:38:00Z',
    customerId: 'cust-001',
    notifyOnArrival: false,
    hasArrived: true,
    estimatedPrepTime: 14,
    paymentCompleted: true
  },
  {
    id: 'ord-003',
    tokenNumber: 'C-007',
    restaurantId: '3',
    restaurantName: 'Barbeque Nation Pune',
    items: [
      { menuItem: mockRestaurants[2].menu[0], quantity: 1 },
      { menuItem: mockRestaurants[2].menu[4], quantity: 2 },
    ],
    total: 540,
    status: 'ready',
    createdAt: '2024-03-15T19:00:00Z',
    acceptedAt: '2024-03-15T19:02:00Z',
    preparingAt: '2024-03-15T19:03:00Z',
    readyAt: '2024-03-15T19:25:00Z',
    customerId: 'cust-002',
    notifyOnArrival: true,
    hasArrived: true,
    estimatedPrepTime: 22,
    paymentCompleted: true
  },
]

export const mockAuditLogs: AuditLog[] = [
  { id: 'log-001', type: 'order_accepted', message: 'Order A-042 accepted by Shreyas Misal House', timestamp: '2024-03-15T08:32:00Z', orderId: 'ord-001', restaurantId: '1' },
  { id: 'log-002', type: 'external_load_added', message: 'External load +4 orders added (20 min) at Vaishali', timestamp: '2024-03-15T12:00:00Z', restaurantId: '2' },
  { id: 'log-003', type: 'order_timeout', message: 'Order D-015 timed out at Momo Station — auto refund initiated', timestamp: '2024-03-15T13:45:00Z', orderId: 'ord-004' },
  { id: 'log-004', type: 'order_rejected', message: 'Order E-022 rejected by Barbeque Nation Pune', timestamp: '2024-03-15T18:30:00Z', orderId: 'ord-005', restaurantId: '3' },
  { id: 'log-005', type: 'walk_in_created', message: 'Walk-in order F-001 created at Cafe Goodluck', timestamp: '2024-03-15T08:00:00Z', restaurantId: '4' },
]

export const mockUsers: User[] = [
  { id: 'cust-001', name: 'Vaibhav Gawali', email: 'vaibhav@example.com', phone: '+91 98765 43210', role: 'customer' },
  { id: 'cust-002', name: 'Priya Deshpande', email: 'priya@example.com', phone: '+91 98765 43211', role: 'customer' },
  { id: 'rest-001', name: 'Ramesh Surve', email: 'ramesh@shreyas.in', phone: '+91 98765 43212', role: 'restaurant' },
  { id: 'admin-001', name: 'Admin User', email: 'admin@kitchensync.in', phone: '+91 98765 43213', role: 'admin' },
]

export const mockStats = {
  totalRestaurants: 6,
  activeOrders: 14,
  totalUsers: 312,
  todayOrders: 63,
  revenue: 184750,
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