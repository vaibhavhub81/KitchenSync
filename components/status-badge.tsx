import { cn } from '@/lib/utils'

type StatusType = 
  | 'normal' | 'busy' | 'overloaded' 
  | 'pending' | 'waiting_confirmation' | 'accepted' | 'preparing' | 'almost_ready' | 'ready' | 'completed' | 'rejected' | 'timeout'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  normal: {
    label: 'Normal',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  busy: {
    label: 'Busy',
    className: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  overloaded: {
    label: 'Overloaded',
    className: 'bg-red-50 text-red-700 border-red-200'
  },
  pending: {
    label: 'Pending',
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  },
  waiting_confirmation: {
    label: 'Waiting Confirmation',
    className: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  preparing: {
    label: 'Preparing',
    className: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  almost_ready: {
    label: 'Almost Ready',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  ready: {
    label: 'Ready',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  completed: {
    label: 'Completed',
    className: 'bg-gray-50 text-gray-500 border-gray-200'
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 border-red-200'
  },
  timeout: {
    label: 'Timed Out',
    className: 'bg-red-50 text-red-700 border-red-200'
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}
