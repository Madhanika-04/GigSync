import React, { useEffect, useState } from 'react'
import { CloudRain, Wind, Thermometer, AlertCircle, Shield, MapPin, Clock, CheckCircle2, Trash2, Siren } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { Alert, AlertType, AlertPriority } from '../types'

const alertIcons: Record<AlertType, LucideIcon> = {
  weather: CloudRain,
  aqi: Wind,
  heat: Thermometer,
  claim: Shield,
  fraud: AlertCircle,
  zone: MapPin,
}

const priorityColors: Record<AlertPriority, { dot: string; bg: string; border: string; label: string }> = {
  critical: { dot: 'bg-red-500', bg: 'dark:bg-red-500/10 bg-red-50', border: 'dark:border-red-500/20 border-red-200', label: 'CRITICAL' },
  high: { dot: 'bg-orange-500', bg: 'dark:bg-orange-500/10 bg-orange-50', border: 'dark:border-orange-500/20 border-orange-200', label: 'HIGH' },
  medium: { dot: 'bg-amber-500', bg: 'dark:bg-amber-500/10 bg-amber-50', border: 'dark:border-amber-500/20 border-amber-200', label: 'MED' },
  info: { dot: 'bg-blue-500', bg: 'dark:bg-blue-500/10 bg-blue-50', border: 'dark:border-blue-500/20 border-blue-200', label: 'INFO' },
}

const priorityIconColors: Record<AlertPriority, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-amber-400',
  info: 'text-blue-400',
}

const briefAdviceByType: Record<AlertType, string> = {
  weather: 'Temporarily reduce route density and auto-notify riders in affected zones.',
  aqi: 'Issue short-shift advisories and enable mask and break policy reminders.',
  heat: 'Activate heat protocol with frequent hydration and shaded pause intervals.',
  claim: 'Verify trigger conditions and keep claim queue under active review.',
  fraud: 'Flag involved accounts for manual review before approving payouts.',
  zone: 'Reassign deliveries and apply temporary plan safeguards to impacted riders.',
}

interface AlertsPanelProps {
  alerts: Alert[]
  onResolveAlert: (alertId: string) => void
  onDeleteAlert: (alertId: string) => void
  onEscalateAlert: (alertId: string) => void
  className?: string
}

const AlertCard: React.FC<{
  alert: Alert
  isSelected: boolean
  onSelectAlert: (alertId: string) => void
  onResolveAlert: (alertId: string) => void
  onDeleteAlert: (alertId: string) => void
  onEscalateAlert: (alertId: string) => void
}> = ({ alert, isSelected, onSelectAlert, onResolveAlert, onDeleteAlert, onEscalateAlert }) => {
  const Icon = alertIcons[alert.type]
  const colors = priorityColors[alert.priority]
  const iconColor = priorityIconColors[alert.priority]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectAlert(alert.id)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectAlert(alert.id)
        }
      }}
      className={clsx('rounded-xl p-3 border transition-all hover:scale-[1.01] cursor-pointer', colors.bg, colors.border, isSelected && 'ring-2 ring-blue-500/40')}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', colors.bg)}>
          <Icon size={14} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded', colors.dot === 'bg-red-500' ? 'bg-red-500/20 text-red-400' : colors.dot === 'bg-orange-500' ? 'bg-orange-500/20 text-orange-400' : colors.dot === 'bg-amber-500' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400')}>
              {colors.label}
            </span>
            <div className="flex items-center gap-1 dark:text-[#3a4d6e] text-gray-400">
              <Clock size={10} />
              <span className="text-[10px]">{alert.timestamp}</span>
            </div>
          </div>
          <p className="text-xs font-semibold dark:text-gray-200 text-gray-800 leading-tight mb-0.5">{alert.title}</p>
          <p className="text-[10px] dark:text-[#5a7090] text-gray-500 leading-snug">{alert.description}</p>
          {alert.affected && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] dark:text-[#3a4d6e] text-gray-400">{alert.affected} affected</span>
            </div>
          )}
          <div className="flex items-center gap-1 mt-2">
            <button onClick={event => { event.stopPropagation(); onResolveAlert(alert.id) }} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
              <CheckCircle2 size={10} /> Resolve
            </button>
            <button onClick={event => { event.stopPropagation(); onEscalateAlert(alert.id) }} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors">
              <Siren size={10} /> Escalate
            </button>
            <button onClick={event => { event.stopPropagation(); onDeleteAlert(alert.id) }} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
              <Trash2 size={10} /> Remove
            </button>
          </div>

          {isSelected && (
            <div className="mt-2 rounded-lg border dark:border-[#1e2d4a] border-gray-200 dark:bg-[#111c35]/80 bg-white/80 p-2.5">
              <p className="text-[10px] font-semibold dark:text-white text-gray-900">Quick Brief</p>
              <p className="mt-1 text-[10px] dark:text-[#8aa0c5] text-gray-600">{briefAdviceByType[alert.type]}</p>
              <div className="mt-2 flex items-center gap-1 flex-wrap text-[10px] dark:text-[#6b80a3] text-gray-500">
                <span className="px-2 py-0.5 rounded-full dark:bg-[#0c1a33] bg-gray-100 border dark:border-[#203154] border-gray-200">Priority: {priorityColors[alert.priority].label}</span>
                {alert.zone ? <span className="px-2 py-0.5 rounded-full dark:bg-[#0c1a33] bg-gray-100 border dark:border-[#203154] border-gray-200">Zone: {alert.zone}</span> : null}
                {alert.affected ? <span className="px-2 py-0.5 rounded-full dark:bg-[#0c1a33] bg-gray-100 border dark:border-[#203154] border-gray-200">Affected: {alert.affected}</span> : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onResolveAlert, onDeleteAlert, onEscalateAlert, className }) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(alerts[0]?.id ?? null)

  useEffect(() => {
    if (alerts.length === 0) {
      setSelectedAlertId(null)
      return
    }

    const exists = alerts.some(alert => alert.id === selectedAlertId)
    if (!exists) {
      setSelectedAlertId(alerts[0].id)
    }
  }, [alerts, selectedAlertId])

  return (
    <div className={clsx('card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 flex flex-col h-full', className)}>
      <div className="flex items-center justify-between p-5 border-b dark:border-[#1a2540] border-gray-100">
        <div>
          <h2 className="font-bold dark:text-white text-gray-900">Disruption Alerts</h2>
          <p className="text-xs dark:text-[#4a6080] text-gray-500 mt-0.5">Live threat monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot" />
          <span className="text-xs font-semibold text-red-400">Live</span>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b dark:border-[#1a2540] border-gray-100">
        {[
          { label: 'Critical', count: alerts.filter(a => a.priority === 'critical').length, color: 'text-red-400' },
          { label: 'High', count: alerts.filter(a => a.priority === 'high').length, color: 'text-orange-400' },
          { label: 'Medium', count: alerts.filter(a => a.priority === 'medium').length, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className={clsx('text-lg font-bold', s.color)}>{s.count}</div>
            <div className="text-[10px] dark:text-[#4a6080] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {alerts.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            isSelected={alert.id === selectedAlertId}
            onSelectAlert={setSelectedAlertId}
            onResolveAlert={onResolveAlert}
            onDeleteAlert={onDeleteAlert}
            onEscalateAlert={onEscalateAlert}
          />
        ))}
        {alerts.length === 0 && (
          <div className="rounded-xl border dark:border-[#1a2540] border-gray-200 p-4 text-center text-xs dark:text-[#6b80a3] text-gray-500">
            All alerts resolved.
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-[#1a2540] border-gray-100">
        <button className="w-full py-2 rounded-xl text-xs font-semibold dark:bg-[#131e38] bg-gray-100 dark:text-blue-400 text-blue-600 hover:dark:bg-[#1a2845] hover:bg-blue-50 transition-all">
          View All Alerts
        </button>
      </div>
    </div>
  )
}

export default AlertsPanel
