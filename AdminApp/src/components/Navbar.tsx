import React, { useState } from 'react'
import { Search, Bell, Sun, Moon, User, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../context/ThemeContext'
import { PageId } from '../types'

interface NavbarProps {
  activePage: PageId
  sidebarWidth: number
}

const pageTitles: Record<PageId, string> = {
  dashboard: 'Dashboard Overview',
  riders: 'Rider Management',
  policies: 'Policy Management',
  claims: 'Claims Center',
  risk: 'Risk Monitoring',
  analytics: 'Analytics & Reports',
  settings: 'Settings',
}

const pageSubtitles: Record<PageId, string> = {
  dashboard: 'Real-time insurance monitoring',
  riders: 'Manage insured delivery riders',
  policies: 'Track weekly policies',
  claims: 'Review and process claims',
  risk: 'Zone-based risk tracking',
  analytics: 'AI-driven insights & trends',
  settings: 'Platform configuration',
}

const Navbar: React.FC<NavbarProps> = ({ activePage, sidebarWidth }) => {
  const { isDark, toggleTheme } = useTheme()
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 h-16 z-30 flex items-center px-6 gap-4',
        'dark:bg-[#080d1a]/95 bg-white/95 backdrop-blur-sm',
        'border-b dark:border-[#1a2540] border-gray-200',
        'transition-all duration-300'
      )}
      style={{ left: sidebarWidth }}
    >
      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold dark:text-white text-gray-900 leading-tight truncate">
          {pageTitles[activePage]}
        </h1>
        <p className="text-xs dark:text-[#4a6080] text-gray-500 leading-tight">{pageSubtitles[activePage]}</p>
      </div>

      {/* Search */}
      <div className={clsx(
        'hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200',
        searchFocused
          ? 'dark:border-blue-500/60 border-blue-400/60 dark:bg-[#0d1528] bg-blue-50 w-64'
          : 'dark:border-[#1a2540] border-gray-200 dark:bg-[#0d1528] bg-gray-50 w-48'
      )}>
        <Search size={14} className={clsx('flex-shrink-0', searchFocused ? 'dark:text-blue-400 text-blue-500' : 'dark:text-[#4a6080] text-gray-400')} />
        <input
          type="text"
          placeholder="Search riders, zones..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-xs dark:text-gray-300 text-gray-700 outline-none placeholder:dark:text-[#3a4d6e] placeholder:text-gray-400 w-full"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(p => !p)}
          className={clsx(
            'w-9 h-9 rounded-xl flex items-center justify-center relative',
            'dark:bg-[#0d1528] bg-gray-100 dark:hover:bg-[#131e38] hover:bg-gray-200',
            'dark:border-[#1a2540] border-gray-200 border',
            'transition-all duration-200'
          )}
        >
          <Bell size={15} className="dark:text-[#6b80a3] text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 dark:border-[#080d1a] border-white"></span>
        </button>

        {notifOpen && (
          <div className={clsx(
            'absolute right-0 top-11 w-72 rounded-2xl shadow-xl border z-50',
            'dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200',
            'fade-in'
          )}>
            <div className="p-4 border-b dark:border-[#1a2540] border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold dark:text-white text-gray-900">Alerts</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">7 new</span>
              </div>
            </div>
            {[
              { text: 'Heavy rain detected in Chennai Zone A', time: '2m ago', dot: 'bg-red-500' },
              { text: 'AQI Critical in Coimbatore', time: '8m ago', dot: 'bg-orange-500' },
              { text: 'Fraud alert flagged for RD007', time: '22m ago', dot: 'bg-red-500' },
              { text: '15 auto-claims triggered', time: '35m ago', dot: 'bg-blue-500' },
            ].map((n, i) => (
              <div key={i} className="flex gap-3 items-start px-4 py-3 dark:hover:bg-[#131e38] hover:bg-gray-50 cursor-pointer transition-colors">
                <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${n.dot}`} />
                <div>
                  <p className="text-xs dark:text-gray-300 text-gray-700">{n.text}</p>
                  <p className="text-[10px] dark:text-[#4a6080] text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
            <div className="p-3 border-t dark:border-[#1a2540] border-gray-100">
              <button className="w-full text-xs text-blue-400 hover:text-blue-300 transition-colors text-center">View all alerts →</button>
            </div>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={clsx(
          'w-9 h-9 rounded-xl flex items-center justify-center',
          'dark:bg-[#0d1528] bg-gray-100 dark:hover:bg-[#131e38] hover:bg-gray-200',
          'dark:border-[#1a2540] border-gray-200 border',
          'transition-all duration-200'
        )}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <Sun size={15} className="text-amber-400" />
        ) : (
          <Moon size={15} className="text-blue-600" />
        )}
      </button>

      {/* Admin Profile */}
      <button className={clsx(
        'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border',
        'dark:bg-[#0d1528] bg-gray-100 dark:hover:bg-[#131e38] hover:bg-gray-200',
        'dark:border-[#1a2540] border-gray-200',
        'transition-all duration-200'
      )}>
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <User size={12} className="text-white" />
        </div>
        <div className="text-left hidden lg:block">
          <div className="text-xs font-semibold dark:text-gray-200 text-gray-800 leading-tight">Admin</div>
          <div className="text-[10px] dark:text-[#4a6080] text-gray-500 leading-tight">GigSync</div>
        </div>
        <ChevronDown size={12} className="dark:text-[#4a6080] text-gray-400" />
      </button>
    </header>
  )
}

export default Navbar
