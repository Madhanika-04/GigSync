import React, { useState, useMemo } from 'react'
import { Search, Filter, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { Rider, RiskLevel, PolicyStatus, ClaimStatus, Platform, Policy, Claim, Payout } from '../types'

const riskBadge: Record<RiskLevel, string> = {
  Low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  High: 'bg-red-500/15 text-red-400 border border-red-500/30',
}

const policyBadge: Record<PolicyStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400',
  Pending: 'bg-amber-500/15 text-amber-400',
  Expired: 'bg-gray-500/15 text-gray-400',
}

const claimBadge: Record<ClaimStatus, string> = {
  None: 'bg-gray-500/15 text-gray-400',
  Triggered: 'bg-blue-500/15 text-blue-400',
  Approved: 'bg-emerald-500/15 text-emerald-400',
  Paid: 'bg-cyan-500/15 text-cyan-400',
  Rejected: 'bg-red-500/15 text-red-400',
}

const platformColors: Record<Platform, string> = {
  Swiggy: 'text-orange-400',
  Zomato: 'text-red-400',
  Zepto: 'text-purple-400',
  Blinkit: 'text-yellow-400',
  Dunzo: 'text-green-400',
}

const aiScoreColor = (score: number) => {
  if (score >= 75) return 'text-red-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-emerald-400'
}

interface RiderTableProps {
  riders: Rider[]
  policies: Policy[]
  claims: Claim[]
  payouts: Payout[]
  onUpdateRider: (riderId: string, updates: Partial<Rider>) => void
  onDeleteRider: (riderId: string) => void
  onTriggerClaim: (rider: Rider) => void
}

const RiderTable: React.FC<RiderTableProps> = ({ riders, policies, claims, payouts, onUpdateRider, onDeleteRider, onTriggerClaim }) => {
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState<string>('All')
  const [cityFilter, setCityFilter] = useState<string>('All')
  const [riskFilter, setRiskFilter] = useState<string>('All')
  const [sortCol, setSortCol] = useState<keyof Rider>('id')
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null)

  const selectedRider = useMemo(() => riders.find(r => r.id === selectedRiderId) ?? null, [riders, selectedRiderId])
  const riderPolicies = useMemo(() => (selectedRider ? policies.filter(policy => policy.riderId === selectedRider.id) : []), [policies, selectedRider])
  const activeRiderPolicy = useMemo(
    () => riderPolicies.find(policy => policy.status === 'Active') ?? riderPolicies[0] ?? null,
    [riderPolicies],
  )
  const riderClaims = useMemo(() => (selectedRider ? claims.filter(claim => claim.riderId === selectedRider.id) : []), [claims, selectedRider])
  const riderPayouts = useMemo(() => (selectedRider ? payouts.filter(payout => payout.riderId === selectedRider.id) : []), [payouts, selectedRider])
  const claimSettlements = useMemo(() => {
    return riderClaims.map(claim => {
      const payout = riderPayouts.find(item => item.claimId === claim.id)
      return { claim, payout }
    })
  }, [riderClaims, riderPayouts])

  const cities = ['All', ...Array.from(new Set(riders.map(r => r.city)))]
  const platforms = ['All', 'Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Dunzo']
  const risks = ['All', 'Low', 'Medium', 'High']

  const filtered = useMemo(() => {
    return riders
      .filter(r => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.zone.toLowerCase().includes(q)
        const matchPlatform = platformFilter === 'All' || r.platform === platformFilter
        const matchCity = cityFilter === 'All' || r.city === cityFilter
        const matchRisk = riskFilter === 'All' || r.riskLevel === riskFilter
        return matchSearch && matchPlatform && matchCity && matchRisk
      })
      .sort((a, b) => {
        const va = a[sortCol]
        const vb = b[sortCol]
        const normalizedA = typeof va === 'number' ? va : String(va ?? '')
        const normalizedB = typeof vb === 'number' ? vb : String(vb ?? '')
        if (normalizedA < normalizedB) return sortAsc ? -1 : 1
        if (normalizedA > normalizedB) return sortAsc ? 1 : -1
        return 0
      })
  }, [search, platformFilter, cityFilter, riskFilter, sortCol, sortAsc])

  const toggleSort = (col: keyof Rider) => {
    if (sortCol === col) setSortAsc(p => !p)
    else { setSortCol(col); setSortAsc(true) }
  }

  const SortIcon = ({ col }: { col: keyof Rider }) => (
    <span className="inline-flex flex-col ml-1 opacity-50">
      {sortCol === col ? (
        sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />
      ) : (
        <ChevronUp size={10} />
      )}
    </span>
  )

  return (
    <div className={clsx('card dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 h-full flex flex-col')}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b dark:border-[#1a2540] border-gray-100">
        <div>
          <h2 className="font-bold dark:text-white text-gray-900">Rider Insurance Monitor</h2>
          <p className="text-xs dark:text-[#4a6080] text-gray-500 mt-0.5">{filtered.length} riders • Live policy tracking</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl dark:bg-[#080d1a] bg-gray-50 border dark:border-[#1a2540] border-gray-200">
            <Search size={13} className="dark:text-[#3a4d6e] text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search rider..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs dark:text-gray-300 text-gray-700 outline-none placeholder:dark:text-[#3a4d6e] placeholder:text-gray-400 w-28"
            />
          </div>
          {/* Filters */}
          {[
            { label: 'Platform', value: platformFilter, onChange: setPlatformFilter, options: platforms },
            { label: 'City', value: cityFilter, onChange: setCityFilter, options: cities },
            { label: 'Risk', value: riskFilter, onChange: setRiskFilter, options: risks },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-1.5 px-2 py-2 rounded-xl dark:bg-[#080d1a] bg-gray-50 border dark:border-[#1a2540] border-gray-200">
              <Filter size={11} className="dark:text-[#3a4d6e] text-gray-400" />
              <select
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                className="bg-transparent text-xs dark:text-gray-400 text-gray-600 outline-none cursor-pointer"
              >
                {f.options.map(o => <option key={o} value={o} className="dark:bg-[#0d1528]">{o === 'All' ? `All ${f.label}s` : o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b dark:border-[#1a2540] border-gray-100">
              {[
                { key: 'id', label: 'Rider ID' },
                { key: 'name', label: 'Name' },
                { key: 'platform', label: 'Platform' },
                { key: 'city', label: 'Zone' },
                { key: 'riskLevel', label: 'Risk' },
                { key: 'aiScore', label: 'AI Score' },
                { key: 'weeklyPremium', label: 'Premium' },
                { key: 'policyStatus', label: 'Policy' },
                { key: 'claimStatus', label: 'Claim' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key as keyof Rider)}
                  className="px-4 py-3 text-left font-semibold dark:text-[#4a6080] text-gray-500 uppercase tracking-wider cursor-pointer hover:dark:text-gray-300 hover:text-gray-700 transition-colors select-none"
                >
                  {col.label}<SortIcon col={col.key as keyof Rider} />
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold dark:text-[#4a6080] text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rider, i) => (
              <tr
                key={rider.id}
                className={clsx(
                  'table-row-hover border-b dark:border-[#1a2540]/40 border-gray-50',
                  'dark:hover:bg-[#111c35] hover:bg-blue-50/50',
                  i % 2 === 0 ? 'dark:bg-transparent' : 'dark:bg-[#0a1220]/30'
                )}
              >
                <td className="px-4 py-3 font-mono font-semibold dark:text-blue-400 text-blue-600">{rider.id}</td>
                <td className="px-4 py-3 dark:text-gray-200 text-gray-800 font-medium">{rider.name}</td>
                <td className={clsx('px-4 py-3 font-semibold', platformColors[rider.platform])}>{rider.platform}</td>
                <td className="px-4 py-3 dark:text-gray-400 text-gray-600">{rider.city} / {rider.zone}</td>
                <td className="px-4 py-3">
                  <span className={clsx('badge', riskBadge[rider.riskLevel])}>{rider.riskLevel}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full dark:bg-[#1a2540] bg-gray-200 overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full', rider.aiScore >= 75 ? 'bg-red-500' : rider.aiScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500')}
                        style={{ width: `${rider.aiScore}%` }}
                      />
                    </div>
                    <span className={clsx('font-bold', aiScoreColor(rider.aiScore))}>{rider.aiScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3 dark:text-gray-300 text-gray-700 font-semibold">₹{rider.weeklyPremium}</td>
                <td className="px-4 py-3">
                  <span className={clsx('badge', policyBadge[rider.policyStatus])}>{rider.policyStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('badge', claimBadge[rider.claimStatus])}>{rider.claimStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedRiderId(rider.id)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={12} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center dark:text-[#3a4d6e] text-gray-400">
            <Search size={32} className="mx-auto mb-3 opacity-30" />
            <p>No riders match your filters</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t dark:border-[#1a2540] border-gray-100">
        <span className="text-xs dark:text-[#3a4d6e] text-gray-400">Showing {filtered.length} of {riders.length} riders</span>
        <div className="flex gap-1">
          {[1, 2, 3].map(p => (
            <button key={p} className={clsx('w-7 h-7 rounded-lg text-xs font-medium transition-all', p === 1 ? 'bg-blue-600 text-white' : 'dark:bg-[#0d1528] bg-gray-100 dark:text-gray-400 text-gray-600 dark:hover:bg-[#131e38] hover:bg-gray-200')}>{p}</button>
          ))}
        </div>
      </div>

      {selectedRider && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4" onClick={() => setSelectedRiderId(null)}>
          <div
            className="w-full max-w-5xl rounded-2xl border dark:bg-[#0d1528] bg-white dark:border-[#1a2540] border-gray-200 shadow-2xl max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b dark:border-[#1a2540] border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold dark:text-white text-gray-900">Rider Profile - {selectedRider.name}</h3>
                <p className="text-xs dark:text-[#6b80a3] text-gray-500">{selectedRider.id} • {selectedRider.platform} • {selectedRider.city} / {selectedRider.zone}</p>
              </div>
              <button
                onClick={() => setSelectedRiderId(null)}
                className="w-7 h-7 rounded-lg dark:bg-[#111c35] bg-gray-100 dark:text-gray-300 text-gray-700 hover:dark:bg-[#1a2845] hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 text-xs">
                <div className="xl:col-span-2 rounded-xl p-4 dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200">
                  <p className="text-[11px] uppercase tracking-wide dark:text-[#6b80a3] text-gray-500 font-semibold mb-3">Profile Snapshot</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Name</p>
                      <p className="mt-1 font-semibold dark:text-gray-100 text-gray-800">{selectedRider.name}</p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Platform</p>
                      <p className="mt-1 font-semibold dark:text-gray-100 text-gray-800">{selectedRider.platform}</p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">City / Zone</p>
                      <p className="mt-1 font-semibold dark:text-gray-100 text-gray-800">{selectedRider.city} / {selectedRider.zone}</p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Onboarded</p>
                      <p className="mt-1 font-semibold dark:text-gray-100 text-gray-800">{selectedRider.joinedDate}</p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Weekly Premium</p>
                      <p className="mt-1 font-semibold dark:text-gray-100 text-gray-800">₹{selectedRider.weeklyPremium}</p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Selected Plan</p>
                      <p className="mt-1 font-semibold dark:text-gray-100 text-gray-800">{selectedRider.selectedPlan}</p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Policy Status</p>
                      <p className="mt-1"><span className={clsx('badge', policyBadge[selectedRider.policyStatus])}>{selectedRider.policyStatus}</span></p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Max Payout / Event</p>
                      <p className="mt-1 font-semibold dark:text-gray-100 text-gray-800">
                        ₹{activeRiderPolicy?.maxPayout ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200">
                  <p className="text-[11px] uppercase tracking-wide dark:text-[#6b80a3] text-gray-500 font-semibold mb-3">Risk Intelligence</p>
                  <div className="space-y-3">
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Risk Level</p>
                      <p className="mt-1"><span className={clsx('badge', riskBadge[selectedRider.riskLevel])}>{selectedRider.riskLevel}</span></p>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">AI Score</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="w-full h-2 rounded-full dark:bg-[#1a2540] bg-gray-200 overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full', selectedRider.aiScore >= 75 ? 'bg-red-500' : selectedRider.aiScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500')}
                            style={{ width: `${selectedRider.aiScore}%` }}
                          />
                        </div>
                        <span className={clsx('font-semibold', aiScoreColor(selectedRider.aiScore))}>{selectedRider.aiScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="dark:text-[#6b80a3] text-gray-500">Claim Status</p>
                      <p className="mt-1"><span className={clsx('badge', claimBadge[selectedRider.claimStatus])}>{selectedRider.claimStatus}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl p-4 dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200">
                  <p className="text-[11px] uppercase tracking-wide dark:text-[#6b80a3] text-gray-500 font-semibold mb-3">Policy History</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {riderPolicies.length === 0 && <p className="dark:text-[#6b80a3] text-gray-500">No policy records</p>}
                    {riderPolicies.map(policy => (
                      <div key={policy.id} className="rounded-lg dark:bg-[#111c35] bg-white border dark:border-[#1e2d4a] border-gray-200 p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-blue-400">{policy.id}</span>
                          <span className={clsx('badge', policyBadge[policy.status])}>{policy.status}</span>
                        </div>
                        <p className="mt-1 dark:text-gray-300 text-gray-700">Coverage: ₹{policy.coverage}</p>
                        <p className="dark:text-gray-300 text-gray-700">Max payout: ₹{policy.maxPayout}</p>
                        <p className="dark:text-[#6b80a3] text-gray-500">{policy.startDate} to {policy.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-4 dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200">
                  <p className="text-[11px] uppercase tracking-wide dark:text-[#6b80a3] text-gray-500 font-semibold mb-3">Claims Timeline</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {riderClaims.length === 0 && <p className="dark:text-[#6b80a3] text-gray-500">No claims yet</p>}
                    {riderClaims.map(claim => (
                      <div key={claim.id} className="rounded-lg dark:bg-[#111c35] bg-white border dark:border-[#1e2d4a] border-gray-200 p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-amber-400">{claim.id}</span>
                          <span className={clsx('badge', claimBadge[claim.status])}>{claim.status}</span>
                        </div>
                        <p className="mt-1 dark:text-gray-300 text-gray-700">{claim.disruption} - ₹{claim.amount}</p>
                        <p className="dark:text-[#6b80a3] text-gray-500">Triggered: {claim.triggeredAt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-4 dark:bg-[#0a1224] bg-gray-50 border dark:border-[#1e2d4a] border-gray-200">
                  <p className="text-[11px] uppercase tracking-wide dark:text-[#6b80a3] text-gray-500 font-semibold mb-3">Payout Transactions</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {claimSettlements.length === 0 && <p className="dark:text-[#6b80a3] text-gray-500">No claims found for this rider</p>}
                    {claimSettlements.map(({ claim, payout }) => (
                      <div key={claim.id} className="rounded-lg dark:bg-[#111c35] bg-white border dark:border-[#1e2d4a] border-gray-200 p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-amber-400">{claim.id}</span>
                          <span className="text-emerald-400 font-semibold">₹{claim.amount}</span>
                        </div>
                        <p className="mt-1 dark:text-gray-300 text-gray-700">Disruption: {claim.disruption}</p>
                        <p className="dark:text-[#6b80a3] text-gray-500">Claim status: {claim.status}</p>
                        <p className="dark:text-[#6b80a3] text-gray-500">Triggered: {claim.triggeredAt}</p>
                        {payout ? (
                          <>
                            <p className="text-cyan-400 font-medium mt-1">Payout Ref: {payout.id}</p>
                            <p className="dark:text-[#6b80a3] text-gray-500">Method: {payout.method}</p>
                            <p className="dark:text-[#6b80a3] text-gray-500">Processed: {payout.processedAt}</p>
                          </>
                        ) : (
                          <p className="text-amber-400 font-medium mt-1">Payout Pending</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            <div className="px-5 pb-5 space-y-2 border-t dark:border-[#1a2540] border-gray-100 pt-4">
              <p className="text-[11px] uppercase tracking-wide dark:text-[#6b80a3] text-gray-500 font-semibold">Admin Actions</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdateRider(selectedRider.id, { policyStatus: 'Active' })}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                >
                  Set Policy Active
                </button>
                <button
                  onClick={() => onUpdateRider(selectedRider.id, { policyStatus: 'Expired' })}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-500/15 text-gray-400 hover:bg-gray-500/25 transition-colors"
                >
                  Expire Policy
                </button>
                <button
                  onClick={() => {
                    onUpdateRider(selectedRider.id, { claimStatus: 'Triggered' })
                    onTriggerClaim(selectedRider)
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
                >
                  Trigger Claim
                </button>
                <button
                  onClick={() => onUpdateRider(selectedRider.id, { claimStatus: 'Approved' })}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                >
                  Approve Claim
                </button>
                <button
                  onClick={() => onUpdateRider(selectedRider.id, { weeklyPremium: selectedRider.weeklyPremium + 10 })}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
                >
                  +₹10 Premium
                </button>
                <button
                  onClick={() => {
                    onDeleteRider(selectedRider.id)
                    setSelectedRiderId(null)
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                >
                  Delete Rider
                </button>
              </div>
            </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RiderTable
