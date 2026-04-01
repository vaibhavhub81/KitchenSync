'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RestaurantCard } from '@/components/restaurant-card'
import { CardSkeleton } from '@/components/skeleton'
import { useApp } from '@/lib/app-context'
import { LoadStatus } from '@/lib/mock-data'
import { Search, SlidersHorizontal, ArrowUpDown, Map as MapIcon, List } from 'lucide-react'

const RestaurantMap = dynamic(() => import('@/components/customer/restaurant-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-muted animate-pulse rounded-xl" />
})

type SortOption = 'name' | 'waitTime'
type FilterStatus = 'all' | LoadStatus
type ViewMode = 'list' | 'map'

export default function CustomerHomePage() {
  const { restaurants } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('waitTime')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
  const [isLoading] = useState(false) // For skeleton demo

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        r => r.name.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(r => r.status === filterStatus)
    }

    // Sort
    if (sortBy === 'waitTime') {
      result.sort((a, b) => a.waitTime - b.waitTime)
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [restaurants, searchQuery, filterStatus, sortBy])

  const statusFilters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'normal', label: 'Normal' },
    { value: 'busy', label: 'Busy' },
    { value: 'overloaded', label: 'Overloaded' },
  ]

  const handleSelectRestaurant = (id: string) => {
    setSelectedRestaurantId(id)
    // On mobile, if we select from map, we might want to stay in map view but highlight
    // If we select from list, we might want to show on map
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Restaurants</h1>
            <p className="text-muted-foreground">Browse restaurants and order your favorite food</p>
          </div>

          {/* View Toggle (Mobile only) */}
          <div className="flex lg:hidden bg-muted p-1 rounded-lg self-start">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 gap-2"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 gap-2"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === 'waitTime' ? 'name' : 'waitTime')}
                className="gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortBy === 'waitTime' ? 'Wait Time' : 'Name'}
              </Button>
            </div>
          </div>

          {/* Load State Filters */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {statusFilters.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={filterStatus === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(value)}
                  className={filterStatus === value ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Restaurant List */}
          <div className={`lg:col-span-7 xl:col-span-8 ${viewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredRestaurants.map(restaurant => (
                  <div 
                    key={restaurant.id} 
                    onClick={() => handleSelectRestaurant(restaurant.id)}
                    className={`cursor-pointer transition-all duration-200 rounded-xl ring-offset-background ${
                      selectedRestaurantId === restaurant.id 
                        ? 'ring-2 ring-primary scale-[1.02] shadow-lg' 
                        : 'hover:scale-[1.01]'
                    }`}
                  >
                    <RestaurantCard restaurant={restaurant} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredRestaurants.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No restaurants found matching your criteria.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Map */}
          <div className={`lg:col-span-5 xl:col-span-4 h-fit sticky top-24 ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
            <RestaurantMap 
              restaurants={filteredRestaurants} 
              selectedRestaurantId={selectedRestaurantId}
              onSelectRestaurant={handleSelectRestaurant}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
