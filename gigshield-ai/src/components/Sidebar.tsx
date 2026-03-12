import React from 'react'
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'
import { PageId } from '../types'

interface SidebarProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [
  { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'riders' as PageId, label: 'Riders', icon: Users, badge: 1050 },
  { id: 'policies' as PageId, label: 'Policies', icon: FileText, badge: 834 },
  { id: 'claims' as PageId, label: 'Claims', icon: ShieldCheck, badge: 23 },
  { id: 'risk' as PageId, label: 'Risk Monitoring', icon: AlertTriangle },
  { id: 'analytics' as PageId, label: 'Analytics', icon: BarChart3 },
  { id: 'settings' as PageId, label: 'Settings', icon: Settings },
]

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, collapsed, onToggleCollapse }) => {
  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300',
        'dark:bg-[#080d1a] bg-white border-r dark:border-[#1a2540] border-gray-200',
        collapsed ? 'w-[70px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center h-16 px-4 border-b dark:border-[#1a2540] border-gray-200', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold dark:text-white text-gray-900 leading-tight whitespace-nowrap">GigSync</div>
            <div className="text-[10px] dark:text-blue-400 text-blue-600 font-medium tracking-wider uppercase leading-tight whitespace-nowrap">Parametric Insurance</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest dark:text-[#3a4d6e] text-gray-400">Main Menu</span>
          </div>
        )}
        {navItems.map(({ id, label, icon: Icon, badge }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={clsx(
                'nav-item w-full text-left',
                collapsed ? 'justify-center px-2' : 'px-3',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/10 dark:text-blue-400 text-blue-600 dark:border-blue-500/30 border-blue-400/30 border'
                  : 'dark:text-[#6b80a3] text-gray-500 dark:hover:text-gray-200 hover:text-gray-800 dark:hover:bg-[#0f1830] hover:bg-gray-100'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className={clsx('flex-shrink-0', isActive ? '' : '')} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm">{label}</span>
                  {badge && (
                    <span className={clsx(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                      isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-200/50 dark:bg-[#1a2540] dark:text-[#4a6080] text-gray-500'
                    )}>
                      {badge >= 1000 ? `${(badge / 1000).toFixed(1)}k` : badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer / Status */}
      {!collapsed && (
        <div className="px-4 py-3 border-t dark:border-[#1a2540] border-gray-200">
          <div className="rounded-xl dark:bg-[#0d1528] bg-blue-50 p-3 border dark:border-[#1e3050] border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
              <span className="text-xs font-semibold dark:text-emerald-400 text-emerald-600">AI Engine Active</span>
            </div>
            <div className="text-[10px] dark:text-[#4a6080] text-gray-500">Risk models running</div>
            <div className="text-[10px] dark:text-[#4a6080] text-gray-500">Last sync: 2 min ago</div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className={clsx(
          'absolute -right-3 top-20 w-6 h-6 rounded-full',
          'dark:bg-[#1a2845] bg-white border dark:border-[#2a3d60] border-gray-300',
          'flex items-center justify-center',
          'dark:text-blue-400 text-blue-600',
          'hover:dark:bg-[#1e3260] hover:bg-blue-50 transition-colors shadow-md'
        )}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}

export default Sidebar
