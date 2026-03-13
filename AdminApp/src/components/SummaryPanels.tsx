import React from 'react'
import { ShieldCheck, FileText, Wallet, AlertOctagon, ArrowUpRight } from 'lucide-react'
import { Alert, Claim, Policy, Payout } from '../types'

interface SummaryPanelsProps {
  policies: Policy[]
  claims: Claim[]
  payouts: Payout[]
  alerts: Alert[]
  totalPremiumCollected: number
  weeklyPayouts: number
  fraudAlertsDetected: number
}

const SummaryPanels: React.FC<SummaryPanelsProps> = ({
  policies,
  claims,
  payouts,
  alerts,
  totalPremiumCollected,
  weeklyPayouts,
  fraudAlertsDetected,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-blue-400" />
          <h3 className="text-sm font-bold dark:text-white text-gray-900">Latest Policies</h3>
        </div>
        <div className="space-y-2">
          {policies.slice(0, 4).map(policy => (
            <div key={policy.id} className="rounded-lg dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200 p-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold dark:text-gray-200 text-gray-800">{policy.riderName}</span>
                <span className="text-[10px] text-blue-400 font-medium">{policy.id}</span>
              </div>
              <div className="flex justify-between text-[11px] mt-1">
                <span className="dark:text-[#6b80a3] text-gray-500">₹{policy.premium}/week</span>
                <span className="dark:text-emerald-400 text-emerald-600 font-medium">{policy.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={16} className="text-amber-400" />
          <h3 className="text-sm font-bold dark:text-white text-gray-900">Recent Claims</h3>
        </div>
        <div className="space-y-2">
          {claims.slice(0, 4).map(claim => (
            <div key={claim.id} className="rounded-lg dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200 p-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold dark:text-gray-200 text-gray-800">{claim.riderName}</span>
                <span className="text-[10px] text-amber-400 font-medium">{claim.status}</span>
              </div>
              <div className="flex justify-between text-[11px] mt-1">
                <span className="dark:text-[#6b80a3] text-gray-500">{claim.disruption}</span>
                <span className="dark:text-gray-300 text-gray-700 font-medium">₹{claim.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold dark:text-white text-gray-900">Payouts & Premium</h3>
            </div>
            <ArrowUpRight size={14} className="text-emerald-400" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="dark:text-[#6b80a3] text-gray-500">Weekly Premium Collected</span>
              <span className="font-semibold dark:text-emerald-400 text-emerald-600">₹{totalPremiumCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-[#6b80a3] text-gray-500">Weekly Payout Processed</span>
              <span className="font-semibold dark:text-cyan-400 text-cyan-600">₹{weeklyPayouts.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t dark:border-[#1a2540] border-gray-100">
              {payouts.slice(0, 2).map(p => (
                <div key={p.id} className="flex justify-between text-[11px] mt-1">
                  <span className="dark:text-gray-300 text-gray-700">{p.riderName}</span>
                  <span className="dark:text-[#6b80a3] text-gray-500">₹{p.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon size={16} className="text-red-400" />
            <h3 className="text-sm font-bold dark:text-white text-gray-900">Fraud Alerts</h3>
          </div>
          <p className="text-xs dark:text-[#6b80a3] text-gray-500 mb-2">Detected this week: <span className="font-semibold text-red-400">{fraudAlertsDetected}</span></p>
          <div className="space-y-1.5">
            {alerts.filter(a => a.type === 'fraud').slice(0, 2).map(alert => (
              <div key={alert.id} className="rounded-lg bg-red-500/10 border border-red-500/25 p-2">
                <p className="text-[11px] text-red-400 font-medium leading-tight">{alert.title}</p>
                <p className="text-[10px] dark:text-[#6b80a3] text-gray-500 mt-0.5">{alert.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryPanels
