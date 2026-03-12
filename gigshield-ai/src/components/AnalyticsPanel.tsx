import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import {
  platformPoliciesData,
  claimsByDisruptionData,
  weeklyPayoutTrendData,
  riskDistributionData,
} from '../data/mockData'
import { useTheme } from '../context/ThemeContext'

const AnalyticsPanel: React.FC = () => {
  const { isDark } = useTheme()

  const axisColor = isDark ? '#6b80a3' : '#6b7280'
  const gridColor = isDark ? '#1e2d4a' : '#e5e7eb'
  const cardBg = isDark ? 'bg-[#0d1528] border-[#1a2540]' : 'bg-white border-gray-200'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`card p-4 ${cardBg}`}>
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Policies by Platform</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformPoliciesData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.4} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0a1224' : '#ffffff',
                    border: `1px solid ${isDark ? '#1e2d4a' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
                <Bar dataKey="policies" radius={[8, 8, 0, 0]}>
                  {platformPoliciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`card p-4 ${cardBg}`}>
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Claims by Disruption Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimsByDisruptionData}
                  dataKey="claims"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {claimsByDisruptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0a1224' : '#ffffff',
                    border: `1px solid ${isDark ? '#1e2d4a' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`card p-4 ${cardBg}`}>
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Weekly Payout Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyPayoutTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.4} />
                <XAxis dataKey="week" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Payout']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0a1224' : '#ffffff',
                    border: `1px solid ${isDark ? '#1e2d4a' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
                <Line type="monotone" dataKey="payouts" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`card p-4 ${cardBg}`}>
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Risk Distribution by Zone</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.4} />
                <XAxis dataKey="zone" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0a1224' : '#ffffff',
                    border: `1px solid ${isDark ? '#1e2d4a' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="high" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="low" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPanel
