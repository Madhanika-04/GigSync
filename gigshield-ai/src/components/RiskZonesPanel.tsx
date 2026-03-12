import React from 'react'
import clsx from 'clsx'
import { RiskZone, RiskLevel } from '../types'
import { AlertTriangle, Users, FileWarning, Thermometer, Wind } from 'lucide-react'

const riskColor = {
  High: 'border-red-500/40 bg-red-500/10',
  Medium: 'border-amber-500/40 bg-amber-500/10',
  Low: 'border-emerald-500/40 bg-emerald-500/10',
} as const

const riskText = {
  High: 'text-red-400',
  Medium: 'text-amber-400',
  Low: 'text-emerald-400',
} as const

interface RiskZonesPanelProps {
  riskZones: RiskZone[]
  onUpdateZone: (zoneId: string, updates: Partial<RiskZone>) => void
}

const RiskZonesPanel: React.FC<RiskZonesPanelProps> = ({ riskZones, onUpdateZone }) => {
  return (
    <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold dark:text-white text-gray-900">Risk Zone Monitoring</h3>
          <p className="text-xs dark:text-[#4a6080] text-gray-500">Block-level disruption intelligence</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200 text-[10px]">
          <AlertTriangle size={12} className="text-amber-400" />
          <span className="dark:text-gray-300 text-gray-700 font-medium">6 zones tracked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {riskZones.map(zone => (
          <div
            key={zone.id}
            className={clsx(
              'rounded-xl border p-4 transition-all duration-200 hover:shadow-lg',
              'dark:bg-[#0a1224] bg-gray-50 dark:border-[#1e2d4a] border-gray-200',
              riskColor[zone.riskLevel]
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-sm font-semibold dark:text-gray-100 text-gray-800">{zone.name}</h4>
                <p className="text-[11px] dark:text-[#4a6080] text-gray-500">{zone.city}</p>
              </div>
              <span className={clsx('badge', riskColor[zone.riskLevel], riskText[zone.riskLevel])}>{zone.riskLevel}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="dark:text-[#6b80a3] text-gray-500 flex items-center gap-1"><Users size={12} /> Active Riders</span>
                <span className="font-semibold dark:text-gray-200 text-gray-800">{zone.activeRiders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="dark:text-[#6b80a3] text-gray-500 flex items-center gap-1"><FileWarning size={12} /> Claims Triggered</span>
                <span className="font-semibold dark:text-gray-200 text-gray-800">{zone.claimsTriggered}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="dark:text-[#6b80a3] text-gray-500">Disruption</span>
                <span className="font-semibold dark:text-blue-400 text-blue-600">{zone.disruption ?? 'None'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="rounded-lg dark:bg-[#0f1a30] bg-white p-2 border dark:border-[#22365a] border-gray-200">
                  <div className="text-[10px] dark:text-[#4a6080] text-gray-500 flex items-center gap-1"><Thermometer size={10} /> Temp</div>
                  <div className="text-xs font-semibold dark:text-gray-200 text-gray-800">{zone.temperature}°C</div>
                </div>
                <div className="rounded-lg dark:bg-[#0f1a30] bg-white p-2 border dark:border-[#22365a] border-gray-200">
                  <div className="text-[10px] dark:text-[#4a6080] text-gray-500 flex items-center gap-1"><Wind size={10} /> AQI</div>
                  <div className="text-xs font-semibold dark:text-gray-200 text-gray-800">{zone.aqiLevel}</div>
                </div>
              </div>
              <div className="text-[10px] dark:text-[#4a6080] text-gray-400 pt-1">Updated {zone.lastUpdated}</div>
              <div className="flex items-center gap-1 pt-2">
                {(['Low', 'Medium', 'High'] as RiskLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => onUpdateZone(zone.id, { riskLevel: level, lastUpdated: 'just now' })}
                    className={clsx(
                      'px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors',
                      zone.riskLevel === level
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'dark:bg-[#111c35] bg-white text-gray-500 dark:text-[#6b80a3] hover:bg-blue-500/10'
                    )}
                  >
                    {level}
                  </button>
                ))}
                <button
                  onClick={() => onUpdateZone(zone.id, { claimsTriggered: zone.claimsTriggered + 1, lastUpdated: 'just now' })}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
                >
                  + Claim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskZonesPanel
