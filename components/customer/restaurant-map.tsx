'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import { Restaurant, LoadStatus, getWaitTimeLabel } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Navigation, MapPin } from 'lucide-react'

// Fix for Leaflet default marker icons in Next.js
// But we'll use custom icons anyway
const getMarkerIcon = (status: LoadStatus | 'user') => {
  let color = '#3b82f6' // Blue for user
  if (status === 'normal') color = '#10b981' // Green
  if (status === 'busy') color = '#f59e0b' // Yellow
  if (status === 'overloaded') color = '#ef4444' // Red

  const svgIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C16.5 17.5 19 14.1667 19 11C19 7.13401 15.866 4 12 4C8.13401 4 5 7.13401 5 11C5 14.1667 7.5 17.5 12 21Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="11" r="3" fill="white"/>
    </svg>
  `
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}

interface RestaurantMapProps {
  restaurants: Restaurant[]
  selectedRestaurantId?: string | null
  onSelectRestaurant: (id: string) => void
}

// Sub-component to handle map effects
function MapController({ 
  restaurants, 
  userLocation, 
  selectedRestaurant 
}: { 
  restaurants: Restaurant[], 
  userLocation: [number, number] | null,
  selectedRestaurant: Restaurant | null
}) {
  const map = useMap()

  // Auto-fit bounds
  useEffect(() => {
    if (restaurants.length > 0) {
      const bounds = L.latLngBounds(restaurants.map(r => [r.lat || 0, r.lng || 0]))
      if (userLocation) {
        bounds.extend(userLocation)
      }
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true })
    }
  }, [restaurants, map, userLocation])

  // Center on selected restaurant
  useEffect(() => {
    if (selectedRestaurant && selectedRestaurant.lat && selectedRestaurant.lng) {
      map.setView([selectedRestaurant.lat, selectedRestaurant.lng], 16, { animate: true })
    }
  }, [selectedRestaurant, map])

  return null
}

export default function RestaurantMap({ 
  restaurants, 
  selectedRestaurantId, 
  onSelectRestaurant 
}: RestaurantMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  const selectedRestaurant = useMemo(() => 
    restaurants.find(r => r.id === selectedRestaurantId) || null
  , [restaurants, selectedRestaurantId])

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {
          setLocationError('Location access denied')
        }
      )
    }
  }, [])

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 16, { animate: true })
    }
  }

  // Fallback if map fails (Leaflet sometimes fails to load tiles etc)
  const [mapError, setMapError] = useState(false)

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl border border-border">
        <p className="text-muted-foreground">Map unavailable. Showing list view.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[calc(100vh-250px)] min-h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenReady={() => {}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          restaurants={restaurants} 
          userLocation={userLocation} 
          selectedRestaurant={selectedRestaurant} 
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={getMarkerIcon('user')}>
            <Popup>
              <div className="text-sm font-medium">You are here</div>
            </Popup>
          </Marker>
        )}

        {/* Restaurant Markers */}
        {restaurants.map(restaurant => (
          restaurant.lat && restaurant.lng && (
            <Marker 
              key={restaurant.id} 
              position={[restaurant.lat, restaurant.lng]} 
              icon={getMarkerIcon(restaurant.status)}
              eventHandlers={{
                click: () => onSelectRestaurant(restaurant.id)
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 min-w-[150px]">
                  <div>
                    <h3 className="font-bold text-foreground">{restaurant.name}</h3>
                    <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className={`w-2 h-2 rounded-full ${
                        restaurant.status === 'normal' ? 'bg-green-500' :
                        restaurant.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="capitalize font-medium">{restaurant.status}</span>
                    </div>
                    <p className="text-xs font-medium text-primary">
                      {getWaitTimeLabel(restaurant.status, restaurant.waitTime)}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full h-8 text-xs"
                    onClick={() => {
                      // Navigate would go here, but prompt says "no navigation logic change"
                      // Just keeping it as a button for UI
                    }}
                  >
                    View Menu
                  </Button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
        {userLocation && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/90 hover:bg-white shadow-md border-border"
            onClick={centerOnUser}
            title="Center on my location"
          >
            <Navigation className="w-4 h-4 text-primary" />
          </Button>
        )}
        {locationError && (
          <div className="bg-white/90 px-2 py-1 rounded text-[10px] border border-border text-destructive shadow-sm">
            {locationError}
          </div>
        )}
      </div>
    </div>
  )
}
