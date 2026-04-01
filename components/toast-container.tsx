'use client'

import { useApp } from '@/lib/app-context'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function ToastContainer() {
  const { toasts, dismissToast } = useApp()

  if (toasts.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />
      default: return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-amber-50 border-amber-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getBgColor(toast.type)}`}
        >
          {getIcon(toast.type)}
          <p className="flex-1 text-sm text-foreground">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
