import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import StatCards from './components/StatCards'
import RiderTable from './components/RiderTable'
import AlertsPanel from './components/AlertsPanel'
import RiskZonesPanel from './components/RiskZonesPanel'
import AnalyticsPanel from './components/AnalyticsPanel'
import SummaryPanels from './components/SummaryPanels'
import { ThemeProvider } from './context/ThemeContext'
import { Alert, Claim, PageId, Platform, Policy, Payout, Rider, RiskZone } from './types'
import { alerts, claims, payouts, policies, riders, riskZones } from './data/mockData'
import {
  CheckCircle2,
  FileText,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Wallet,
  KeyRound,
} from 'lucide-react'
import clsx from 'clsx'

type SessionRole = 'admin'

interface AuthAccount {
  role: SessionRole
  email: string
  password: string
  name: string
  riderId?: string
}

const newId = (prefix: string, currentCount: number) => `${prefix}${String(currentCount + 1).padStart(3, '0')}`

const buildPoliciesForAllRiders = (allRiders: Rider[], basePolicies: Policy[]): Policy[] => {
  let sequence = basePolicies.length
  const riderPolicySet = new Set(basePolicies.map(policy => policy.riderId))
  const generatedPolicies = allRiders
    .filter(rider => !riderPolicySet.has(rider.id))
    .map(rider => {
      sequence += 1
      const premium = rider.riskLevel === 'High' ? 149 : rider.riskLevel === 'Medium' ? 99 : 59
      return {
        id: `POL${String(sequence).padStart(3, '0')}`,
        riderId: rider.id,
        riderName: rider.name,
        platform: rider.platform,
        startDate: '2026-03-12',
        endDate: '2026-03-19',
        premium,
        status: 'Active' as Policy['status'],
        coverage: premium >= 149 ? 2500 : 1800,
      }
    })

  return [...basePolicies, ...generatedPolicies]
}

const AppLayout: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  const [ridersState, setRidersState] = useState<Rider[]>(riders)
  const [policiesState, setPoliciesState] = useState<Policy[]>(() => buildPoliciesForAllRiders(riders, policies))
  const [claimsState, setClaimsState] = useState<Claim[]>(claims)
  const [payoutsState, setPayoutsState] = useState<Payout[]>(payouts)
  const [alertsState, setAlertsState] = useState<Alert[]>(alerts)
  const [riskZonesState, setRiskZonesState] = useState<RiskZone[]>(riskZones)

  const [accounts, setAccounts] = useState<AuthAccount[]>([
    { role: 'admin', email: 'admin@gigsync.ai', password: 'admin123', name: 'Admin' },
  ])

  const [sessionRole] = useState<SessionRole>('admin')
  const [authRoleTab] = useState<SessionRole>('admin')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [newRiderName, setNewRiderName] = useState('')
  const [newRiderPlatform, setNewRiderPlatform] = useState<Platform>('Swiggy')
  const [newRiderCity, setNewRiderCity] = useState('Chennai')

  const [selectedPolicyRiderId, setSelectedPolicyRiderId] = useState<string>('')
  const [selectedClaimId, setSelectedClaimId] = useState<string>('')
  const [adminNotice, setAdminNotice] = useState<string>('')

  const sidebarWidth = useMemo(() => (sidebarCollapsed ? 70 : 240), [sidebarCollapsed])

  const stats = useMemo(() => {
    const weeklyPayouts = payoutsState.reduce((sum, payout) => sum + payout.amount, 0)
    const totalPremiumCollected = policiesState.reduce((sum, policy) => sum + policy.premium, 0)

    return {
      totalRidersEnrolled: ridersState.length,
      activePolicies: policiesState.filter(policy => policy.status === 'Active').length,
      claimsToday: claimsState.length,
      weeklyPayouts,
      highRiskZones: riskZonesState.filter(zone => zone.riskLevel === 'High').length,
      totalPremiumCollected,
      fraudAlertsDetected: alertsState.filter(alert => alert.type === 'fraud').length,
    }
  }, [ridersState, policiesState, claimsState, payoutsState, riskZonesState, alertsState])

  const availableRidersForPolicy = useMemo(() => {
    return ridersState.filter(rider => {
      const anyPolicy = policiesState.find(policy => policy.riderId === rider.id)
      return !anyPolicy
    })
  }, [ridersState, policiesState])

  const notify = (message: string) => {
    setAdminNotice(message)
    window.setTimeout(() => setAdminNotice(''), 1800)
  }

  const handleAdminLogin = () => {
    const account = accounts.find(
      item => item.role === 'admin' && item.email.toLowerCase() === authEmail.toLowerCase() && item.password === authPassword
    )

    if (!account) {
      setAuthError('Invalid admin credentials')
      return
    }

    setAuthError('')
    setAuthPassword('')
  }

  const createPolicyForRider = (riderId: string) => {
    const rider = ridersState.find(item => item.id === riderId)
    if (!rider) return

    const policyId = newId('POL', policiesState.length)
    const premium = rider.riskLevel === 'High' ? 149 : rider.riskLevel === 'Medium' ? 99 : 59

    const newPolicy: Policy = {
      id: policyId,
      riderId: rider.id,
      riderName: rider.name,
      platform: rider.platform,
      startDate: '2026-03-12',
      endDate: '2026-03-19',
      premium,
      status: 'Active',
      coverage: premium >= 149 ? 2500 : 1800,
    }

    setPoliciesState(prev => [newPolicy, ...prev])
    setRidersState(prev => prev.map(item => (item.id === rider.id ? { ...item, policyStatus: 'Active', weeklyPremium: premium } : item)))
    setAlertsState(prev => [
      {
        id: newId('AL', prev.length),
        title: `Policy Created — ${rider.name}`,
        description: `New weekly policy ${policyId} generated for ${rider.id}.`,
        type: 'claim',
        priority: 'info',
        timestamp: 'Now',
        affected: 1,
      },
      ...prev,
    ])
    notify(`Policy ${policyId} created`)
  }


  const handleUpdateRider = (riderId: string, updates: Partial<Rider>) => {
    setRidersState(prev => prev.map(rider => (rider.id === riderId ? { ...rider, ...updates } : rider)))
  }

  const handleDeleteRider = (riderId: string) => {
    setRidersState(prev => prev.filter(rider => rider.id !== riderId))
    setPoliciesState(prev => prev.filter(policy => policy.riderId !== riderId))
    notify(`Rider ${riderId} removed`)
  }

  const handleTriggerClaim = (rider: Rider) => {
    const existingTriggered = claimsState.find(claim => claim.riderId === rider.id && claim.status === 'Triggered')
    if (existingTriggered) return

    const claimId = newId('CLM', claimsState.length)
    const amount = rider.riskLevel === 'High' ? 1200 : rider.riskLevel === 'Medium' ? 900 : 700

    const newClaim: Claim = {
      id: claimId,
      riderId: rider.id,
      riderName: rider.name,
      zone: `${rider.city} ${rider.zone}`,
      disruption: rider.riskLevel === 'High' ? 'Heavy Rain' : rider.riskLevel === 'Medium' ? 'High AQI' : 'Zone Closure',
      amount,
      status: 'Triggered',
      triggeredAt: 'Now',
      autoTriggered: false,
    }

    setClaimsState(prev => [newClaim, ...prev])
    setAlertsState(prev => [
      {
        id: newId('AL', prev.length),
        title: `Claim Triggered — ${rider.name}`,
        description: `Manual claim trigger by admin for ${rider.id}`,
        type: 'claim',
        priority: 'medium',
        timestamp: 'Now',
        affected: 1,
      },
      ...prev,
    ])
    notify(`Claim created for ${rider.name}`)
  }

  const handleAddRider = () => {
    const name = newRiderName.trim()
    if (!name) return

    const riderId = newId('RD', ridersState.length)
    const defaultPremium = 99
    const createdRider: Rider = {
      id: riderId,
      name,
      platform: newRiderPlatform,
      city: newRiderCity,
      zone: 'Zone A',
      riskLevel: 'Medium',
      weeklyPremium: defaultPremium,
      policyStatus: 'Active',
      claimStatus: 'None',
      aiScore: 55,
      joinedDate: '2026-03-12',
    }

    const policyId = newId('POL', policiesState.length)
    const autoPolicy: Policy = {
      id: policyId,
      riderId,
      riderName: name,
      platform: newRiderPlatform,
      startDate: '2026-03-12',
      endDate: '2026-03-19',
      premium: defaultPremium,
      status: 'Active',
      coverage: 1800,
    }

    setRidersState(prev => [createdRider, ...prev])
    setPoliciesState(prev => [autoPolicy, ...prev])
    setNewRiderName('')
    notify(`Rider ${riderId} added with policy ${policyId}`)
  }

  const handleCreatePolicy = () => {
    if (!selectedPolicyRiderId) return
    createPolicyForRider(selectedPolicyRiderId)
  }

  const handleUpdatePolicyStatus = (policyId: string, status: Policy['status']) => {
    setPoliciesState(prev => prev.map(policy => (policy.id === policyId ? { ...policy, status } : policy)))
  }

  const handleDeletePolicy = (policyId: string) => {
    const targetPolicy = policiesState.find(policy => policy.id === policyId)
    if (!targetPolicy) return

    const riderPolicyCount = policiesState.filter(policy => policy.riderId === targetPolicy.riderId).length
    if (riderPolicyCount <= 1) {
      notify('Each rider must keep at least one policy')
      return
    }

    setPoliciesState(prev => prev.filter(policy => policy.id !== policyId))
    notify(`Policy ${policyId} deleted`)
  }

  const handleUpdateClaimStatus = (claimId: string, status: Claim['status']) => {
    setClaimsState(prev => prev.map(claim => (claim.id === claimId ? { ...claim, status } : claim)))
  }

  const handleMarkClaimPaid = () => {
    if (!selectedClaimId) return
    const claim = claimsState.find(item => item.id === selectedClaimId)
    if (!claim) return

    handleUpdateClaimStatus(claim.id, 'Approved')
    const payoutId = newId('PAY', payoutsState.length)
    const newPayout: Payout = {
      id: payoutId,
      riderId: claim.riderId,
      riderName: claim.riderName,
      amount: claim.amount,
      claimId: claim.id,
      processedAt: 'Now',
      method: 'UPI',
    }

    setPayoutsState(prev => [newPayout, ...prev])
    notify(`Payout ${payoutId} processed`)
  }

  const handleResolveAlert = (alertId: string) => {
    setAlertsState(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlertsState(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleEscalateAlert = (alertId: string) => {
    setAlertsState(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, priority: 'critical', timestamp: 'Now' } : alert
      )
    )
  }

  const handleUpdateZone = (zoneId: string, updates: Partial<RiskZone>) => {
    setRiskZonesState(prev => prev.map(zone => (zone.id === zoneId ? { ...zone, ...updates } : zone)))
  }

  const handleResetData = () => {
    setRidersState(riders)
    setPoliciesState(policies)
    setClaimsState(claims)
    setPayoutsState(payouts)
    setAlertsState(alerts)
    setRiskZonesState(riskZones)
    notify('Platform data reset to baseline')
  }

  const renderAuthPortal = () => (
    <div className="min-h-screen dark:bg-[#060a14] bg-[#f3f6fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border dark:border-[#1a2540] border-gray-200 dark:bg-[#0d1528] bg-white p-8">
          <p className="text-[11px] uppercase tracking-[0.18em] dark:text-cyan-400 text-blue-600 font-semibold mb-3">GigSync</p>
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 leading-tight">Parametric Insurance Platform for Delivery Riders</h1>
          <p className="mt-4 text-sm dark:text-[#6b80a3] text-gray-600">
            Login as Admin to monitor and manage riders, policies, claims, payouts, and risk operations.
          </p>
          <div className="mt-6 rounded-2xl border dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/30 border-blue-200 p-4">
            <p className="text-sm font-semibold dark:text-blue-300 text-blue-700">Admin Portal Only</p>
            <p className="text-xs dark:text-[#8bb2ff] text-blue-700/80 mt-1">Rider dashboard has been removed from this build.</p>
          </div>
          <p className="mt-6 text-xs dark:text-[#4a6080] text-gray-500">
            Demo credentials: admin@gigsync.ai / admin123
          </p>
        </div>

        <div className="rounded-3xl border dark:border-[#1a2540] border-gray-200 dark:bg-[#0d1528] bg-white p-8">
          <p className="text-xs font-semibold dark:text-blue-400 text-blue-600 mb-4">Admin Login</p>
          <div className="space-y-3">
            <input
              value={authEmail}
              onChange={event => setAuthEmail(event.target.value)}
              placeholder="Admin email"
              className="w-full px-3 py-2 rounded-xl text-sm dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 dark:text-gray-200 text-gray-800"
            />
            <input
              type="password"
              value={authPassword}
              onChange={event => setAuthPassword(event.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 rounded-xl text-sm dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 dark:text-gray-200 text-gray-800"
            />
            <button onClick={handleAdminLogin} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors">
              <KeyRound size={14} /> Login as Admin
            </button>
          </div>

          {authError && (
            <p className="mt-4 text-xs font-medium text-red-400">{authError}</p>
          )}
        </div>
      </div>
    </div>
  )


  const renderPoliciesAdmin = () => (
    <div className="space-y-5">
      <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <select
          value={selectedPolicyRiderId}
          onChange={event => setSelectedPolicyRiderId(event.target.value)}
          className="px-3 py-2 rounded-xl text-xs dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 dark:text-gray-200 text-gray-700"
        >
          <option value="">Select rider for new policy</option>
          {ridersState.map(rider => (
            <option key={rider.id} value={rider.id}>{rider.id} • {rider.name} • {rider.city} • {rider.policyStatus}</option>
          ))}
        </select>
        <button onClick={handleCreatePolicy} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <Plus size={12} /> Create Policy
        </button>
        <span className="text-xs dark:text-[#6b80a3] text-gray-500">Available riders without any policy: <span className="text-amber-400 font-semibold">{availableRidersForPolicy.length}</span></span>
      </div>

      <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
        <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Rider Policy Subscriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 text-xs">
          {ridersState.map(rider => (
            <div key={rider.id} className="rounded-xl dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 p-3">
              {(() => {
                const riderPolicies = policiesState
                  .filter(policy => policy.riderId === rider.id)
                  .sort((a, b) => b.endDate.localeCompare(a.endDate))
                const latestPolicy = riderPolicies[0]

                return (
                  <>
              <div className="flex items-center justify-between">
                <span className="font-semibold dark:text-gray-100 text-gray-900">{rider.name}</span>
                <span className="font-mono text-blue-400">{rider.id}</span>
              </div>
              <p className="mt-1 dark:text-[#6b80a3] text-gray-500">{rider.platform} • {rider.city} / {rider.zone}</p>
              <p className="dark:text-[#6b80a3] text-gray-500">Risk: <span className="text-amber-400 font-medium">{rider.riskLevel}</span></p>
              {latestPolicy ? (
                <div className="mt-2 rounded-lg dark:bg-[#111c35] bg-white border dark:border-[#1e2d4a] border-gray-200 p-2">
                  <p className="text-[11px] font-semibold dark:text-gray-200 text-gray-800">Subscribed Policy</p>
                  <p className="text-[11px] dark:text-[#6b80a3] text-gray-500">{latestPolicy.id} • {latestPolicy.status}</p>
                  <p className="text-[11px] dark:text-[#6b80a3] text-gray-500">Premium ₹{latestPolicy.premium} • Coverage ₹{latestPolicy.coverage}</p>
                  <p className="text-[11px] dark:text-[#6b80a3] text-gray-500">{latestPolicy.startDate} to {latestPolicy.endDate}</p>
                </div>
              ) : (
                <div className="mt-2 rounded-lg dark:bg-[#111c35] bg-white border dark:border-[#1e2d4a] border-gray-200 p-2">
                  <p className="text-[11px] dark:text-[#6b80a3] text-gray-500">No policy subscribed yet</p>
                </div>
              )}
              <button
                onClick={() => {
                  createPolicyForRider(rider.id)
                }}
                className="mt-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
              >
                Renew / Issue Policy
              </button>
                  </>
                )
              })()}
            </div>
          ))}
        </div>
      </div>

      <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
        <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Policy Administration</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-[#1a2540] border-gray-100">
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Policy</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Rider</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Platform</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">City / Zone</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Premium</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Coverage</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Duration</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Status</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policiesState.map(policy => (
                <tr key={policy.id} className="border-b dark:border-[#1a2540]/50 border-gray-50">
                  {(() => {
                    const linkedRider = ridersState.find(item => item.id === policy.riderId)
                    return (
                      <>
                  <td className="px-3 py-2 text-blue-400 font-mono">{policy.id}</td>
                  <td className="px-3 py-2 dark:text-gray-200 text-gray-800">{policy.riderName}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">{policy.platform}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">{linkedRider ? `${linkedRider.city} / ${linkedRider.zone}` : '-'}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">₹{policy.premium}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">₹{policy.coverage}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">{policy.startDate} to {policy.endDate}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">{policy.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleUpdatePolicyStatus(policy.id, 'Active')} className="px-2 py-1 rounded-lg text-[10px] bg-emerald-500/15 text-emerald-400">Activate</button>
                      <button onClick={() => handleUpdatePolicyStatus(policy.id, 'Pending')} className="px-2 py-1 rounded-lg text-[10px] bg-amber-500/15 text-amber-400">Pending</button>
                      <button onClick={() => handleUpdatePolicyStatus(policy.id, 'Expired')} className="px-2 py-1 rounded-lg text-[10px] bg-gray-500/15 text-gray-400">Expire</button>
                      <button onClick={() => handleDeletePolicy(policy.id)} className="px-2 py-1 rounded-lg text-[10px] bg-red-500/15 text-red-400">Delete</button>
                    </div>
                  </td>
                      </>
                    )
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderClaimsAdmin = () => (
    <div className="space-y-5">
      <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <select
          value={selectedClaimId}
          onChange={event => setSelectedClaimId(event.target.value)}
          className="px-3 py-2 rounded-xl text-xs dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 dark:text-gray-200 text-gray-700"
        >
          <option value="">Select claim to payout</option>
          {claimsState.map(claim => (
            <option key={claim.id} value={claim.id}>{claim.id} • {claim.riderName}</option>
          ))}
        </select>
        <button onClick={handleMarkClaimPaid} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">
          <Wallet size={12} /> Mark as Paid
        </button>
      </div>

      <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
        <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Claims Administration</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-[#1a2540] border-gray-100">
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Claim</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Rider</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Amount</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Status</th>
                <th className="px-3 py-2 text-left dark:text-[#4a6080] text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claimsState.map(claim => (
                <tr key={claim.id} className="border-b dark:border-[#1a2540]/50 border-gray-50">
                  <td className="px-3 py-2 text-amber-400 font-mono">{claim.id}</td>
                  <td className="px-3 py-2 dark:text-gray-200 text-gray-800">{claim.riderName}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">₹{claim.amount}</td>
                  <td className="px-3 py-2 dark:text-gray-300 text-gray-700">{claim.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleUpdateClaimStatus(claim.id, 'Approved')} className="px-2 py-1 rounded-lg text-[10px] bg-emerald-500/15 text-emerald-400">Approve</button>
                      <button onClick={() => handleUpdateClaimStatus(claim.id, 'Rejected')} className="px-2 py-1 rounded-lg text-[10px] bg-red-500/15 text-red-400">Reject</button>
                      <button onClick={() => handleUpdateClaimStatus(claim.id, 'Triggered')} className="px-2 py-1 rounded-lg text-[10px] bg-blue-500/15 text-blue-400">Retrigger</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAdminContent = () => {
    if (activePage === 'dashboard') {
      return (
        <div className="space-y-5">
          <StatCards stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-8 xl:h-[700px]">
              <RiderTable
                riders={ridersState}
                policies={policiesState}
                claims={claimsState}
                payouts={payoutsState}
                onUpdateRider={handleUpdateRider}
                onDeleteRider={handleDeleteRider}
                onTriggerClaim={handleTriggerClaim}
              />
            </div>
            <div className="xl:col-span-4 xl:h-[700px]">
              <AlertsPanel
                alerts={alertsState}
                onResolveAlert={handleResolveAlert}
                onDeleteAlert={handleDeleteAlert}
                onEscalateAlert={handleEscalateAlert}
              />
            </div>
          </div>

          <RiskZonesPanel riskZones={riskZonesState} onUpdateZone={handleUpdateZone} />
        </div>
      )
    }

    if (activePage === 'riders') {
      return (
        <div className="space-y-5">
          <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-4 flex flex-wrap items-center gap-3">
            <input
              value={newRiderName}
              onChange={event => setNewRiderName(event.target.value)}
              placeholder="Rider full name"
              className="px-3 py-2 rounded-xl text-xs dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 dark:text-gray-200 text-gray-700"
            />
            <select value={newRiderPlatform} onChange={event => setNewRiderPlatform(event.target.value as Platform)} className="px-3 py-2 rounded-xl text-xs dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 dark:text-gray-200 text-gray-700">
              {['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Dunzo'].map(platform => <option key={platform} value={platform}>{platform}</option>)}
            </select>
            <select value={newRiderCity} onChange={event => setNewRiderCity(event.target.value)} className="px-3 py-2 rounded-xl text-xs dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1a2540] border-gray-200 dark:text-gray-200 text-gray-700">
              {['Chennai', 'Coimbatore', 'Madurai', 'Salem'].map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <button onClick={handleAddRider} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors">
              <Plus size={12} /> Add Rider
            </button>
          </div>
          <RiderTable
            riders={ridersState}
            policies={policiesState}
            claims={claimsState}
            payouts={payoutsState}
            onUpdateRider={handleUpdateRider}
            onDeleteRider={handleDeleteRider}
            onTriggerClaim={handleTriggerClaim}
          />
        </div>
      )
    }

    if (activePage === 'policies') {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 space-y-5">
            {renderPoliciesAdmin()}
            <AnalyticsPanel />
          </div>
          <div className="xl:col-span-4 space-y-5">
            <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold dark:text-white text-gray-900">Policy Snapshot</h3>
              </div>
              <p className="text-xs dark:text-[#6b80a3] text-gray-600 mb-1">Active policies: <span className="text-emerald-400 font-semibold">{stats.activePolicies}</span></p>
              <p className="text-xs dark:text-[#6b80a3] text-gray-600">Premium collected: <span className="text-cyan-400 font-semibold">₹{stats.totalPremiumCollected.toLocaleString()}</span></p>
            </div>
            <AlertsPanel
              alerts={alertsState}
              onResolveAlert={handleResolveAlert}
              onDeleteAlert={handleDeleteAlert}
              onEscalateAlert={handleEscalateAlert}
            />
          </div>
        </div>
      )
    }

    if (activePage === 'claims') {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 space-y-5">
            {renderClaimsAdmin()}
            <SummaryPanels
              policies={policiesState}
              claims={claimsState}
              payouts={payoutsState}
              alerts={alertsState}
              totalPremiumCollected={stats.totalPremiumCollected}
              weeklyPayouts={stats.weeklyPayouts}
              fraudAlertsDetected={stats.fraudAlertsDetected}
            />
          </div>
          <div className="xl:col-span-4 space-y-5">
            <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold dark:text-white text-gray-900">Claims Health</h3>
              </div>
              <p className="text-xs dark:text-[#6b80a3] text-gray-600 mb-1">Triggered today: <span className="text-blue-400 font-semibold">{stats.claimsToday}</span></p>
              <p className="text-xs dark:text-[#6b80a3] text-gray-600">Payout volume: <span className="text-cyan-400 font-semibold">₹{stats.weeklyPayouts.toLocaleString()}</span></p>
            </div>
            <AlertsPanel
              alerts={alertsState}
              onResolveAlert={handleResolveAlert}
              onDeleteAlert={handleDeleteAlert}
              onEscalateAlert={handleEscalateAlert}
            />
          </div>
        </div>
      )
    }

    if (activePage === 'risk') {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-9 space-y-5">
            <RiskZonesPanel riskZones={riskZonesState} onUpdateZone={handleUpdateZone} />
            <AnalyticsPanel />
          </div>
          <div className="xl:col-span-3">
            <AlertsPanel
              alerts={alertsState}
              onResolveAlert={handleResolveAlert}
              onDeleteAlert={handleDeleteAlert}
              onEscalateAlert={handleEscalateAlert}
            />
          </div>
        </div>
      )
    }

    if (activePage === 'analytics') {
      return (
        <div className="space-y-5">
          <StatCards stats={stats} />
          <AnalyticsPanel />
          <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold dark:text-white text-gray-900">Recent Payout Transactions</h3>
            </div>
            <div className="space-y-2">
              {payoutsState.map(payout => (
                <div key={payout.id} className="flex items-center justify-between rounded-xl dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-100 px-3 py-2">
                  <div>
                    <p className="text-xs dark:text-gray-200 text-gray-800">{payout.riderName}</p>
                    <p className="text-[11px] dark:text-[#6b80a3] text-gray-500">{payout.processedAt} • {payout.method}</p>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400">₹{payout.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-4xl space-y-5">
        <div className="card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 p-5">
          <h3 className="text-sm font-bold dark:text-white text-gray-900 mb-3">Platform Settings & Admin Utilities</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-xl dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-100 p-3">
              <span className="text-xs dark:text-gray-300 text-gray-700">Auto-trigger parametric claims</span>
              <input type="checkbox" defaultChecked className="accent-blue-500" />
            </label>
            <label className="flex items-center justify-between rounded-xl dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-100 p-3">
              <span className="text-xs dark:text-gray-300 text-gray-700">Fraud detection strict mode</span>
              <input type="checkbox" defaultChecked className="accent-blue-500" />
            </label>
            <label className="flex items-center justify-between rounded-xl dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-100 p-3">
              <span className="text-xs dark:text-gray-300 text-gray-700">Weather API failover alerts</span>
              <input type="checkbox" defaultChecked className="accent-blue-500" />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSettingsSaved(true)
                window.setTimeout(() => setSettingsSaved(false), 1800)
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <Save size={13} /> Save Settings
            </button>
            <button onClick={handleResetData} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
              <Trash2 size={13} /> Reset Demo Data
            </button>
            {settingsSaved && (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                <CheckCircle2 size={13} /> Saved
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-[#060a14] bg-[#f3f6fb] transition-colors duration-300">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />

      <Navbar activePage={activePage} sidebarWidth={sidebarWidth} />

      <main
        className="pt-20 pb-6 px-4 md:px-6 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="max-w-[1700px] mx-auto space-y-5">
          {adminNotice && (
            <div className={clsx('rounded-xl border px-3 py-2 text-xs font-semibold inline-flex items-center gap-2', 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400')}>
              <CheckCircle2 size={12} /> {adminNotice}
            </div>
          )}
          {renderAdminContent()}
        </div>
      </main>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  )
}

export default App
