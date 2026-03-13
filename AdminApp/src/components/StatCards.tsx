import React from 'react'
import { Users, FileText, ShieldCheck, Wallet, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

interface DashboardStats {
  totalRidersEnrolled: number
  activePolicies: number
  claimsToday: number
  weeklyPayouts: number
  highRiskZones: number
}

interface StatCardsProps {
  stats: DashboardStats
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Riders Enrolled',
      value: stats.totalRidersEnrolled.toLocaleString(),
    icon: Users,
    iconBg: 'from-blue-600 to-blue-500',
    iconColor: 'text-blue-400',
    trend: '+8.2%',
    trendUp: true,
    trendLabel: 'vs last week',
    borderGlow: 'dark:hover:border-blue-500/40',
    accentColor: 'text-blue-400',
    },
    {
      label: 'Active Weekly Policies',
      value: stats.activePolicies.toLocaleString(),
    icon: FileText,
    iconBg: 'from-emerald-600 to-emerald-500',
    iconColor: 'text-emerald-400',
    trend: '+12.4%',
    trendUp: true,
    trendLabel: 'vs last week',
    borderGlow: 'dark:hover:border-emerald-500/40',
    accentColor: 'text-emerald-400',
    },
    {
      label: 'Claims Triggered Today',
      value: stats.claimsToday.toString(),
    icon: ShieldCheck,
    iconBg: 'from-amber-600 to-amber-500',
    iconColor: 'text-amber-400',
    trend: '+5 from yesterday',
    trendUp: false,
    trendLabel: 'since 6AM',
    borderGlow: 'dark:hover:border-amber-500/40',
    accentColor: 'text-amber-400',
    },
    {
      label: 'Total Weekly Payouts',
      value: `₹${(stats.weeklyPayouts / 1000).toFixed(1)}k`,
    icon: Wallet,
    iconBg: 'from-cyan-600 to-cyan-500',
    iconColor: 'text-cyan-400',
    trend: '+18.6%',
    trendUp: true,
    trendLabel: 'vs last week',
    borderGlow: 'dark:hover:border-cyan-500/40',
    accentColor: 'text-cyan-400',
    },
    {
      label: 'High Risk Zones',
      value: stats.highRiskZones.toString(),
    icon: AlertTriangle,
    iconBg: 'from-red-600 to-red-500',
    iconColor: 'text-red-400',
    trend: '+2 new zones',
    trendUp: false,
    trendLabel: 'this morning',
    borderGlow: 'dark:hover:border-red-500/40',
    accentColor: 'text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <div
            key={i}
            className={clsx(
              'card stat-card',
              'dark:bg-[#0d1528] bg-white',
              'dark:border-[#1a2540] border-gray-200',
              card.borderGlow,
              'hover:shadow-lg dark:hover:shadow-black/30',
              'group relative overflow-hidden'
            )}
          >
            {/* Background gradient decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5 rounded-full -translate-y-6 translate-x-6 bg-gradient-to-br from-blue-400 to-cyan-400 group-hover:opacity-10 transition-opacity" />

            <div className="flex items-start justify-between mb-4">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', card.iconBg, 'shadow-lg')}>
                <Icon size={18} className="text-white" />
              </div>
              <div className={clsx('flex items-center gap-1 text-xs font-medium', card.trendUp ? 'text-emerald-400' : 'text-red-400')}>
                {card.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{card.trend.split(' ')[0]}</span>
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold dark:text-white text-gray-900 mb-1 tracking-tight">{card.value}</div>
              <div className="text-xs dark:text-[#6b80a3] text-gray-500 font-medium leading-tight">{card.label}</div>
              <div className="text-[10px] dark:text-[#3d5070] text-gray-400 mt-1">{card.trendLabel}</div>
            </div>

            {/* Bottom accent line */}
            <div className={clsx('absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r', card.iconBg)} />
          </div>
        )
      })}
    </div>
  )
}

export default StatCards
