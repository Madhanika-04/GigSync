export type RiskLevel = 'Low' | 'Medium' | 'High'
export type PolicyStatus = 'Active' | 'Pending' | 'Expired'
export type PolicyPlanName = 'Basic' | 'Standard' | 'Plus' | 'Premium' | 'Elite'
export type ClaimStatus = 'None' | 'Triggered' | 'Approved' | 'Rejected'
export type Platform = 'Swiggy' | 'Zomato' | 'Zepto' | 'Blinkit' | 'Dunzo'
export type AlertPriority = 'critical' | 'high' | 'medium' | 'info'
export type AlertType = 'weather' | 'aqi' | 'heat' | 'claim' | 'fraud' | 'zone'
export type DisruptionType = 'Heavy Rain' | 'Extreme Heat' | 'High AQI' | 'Zone Closure' | 'Flash Flood' | 'Strong Wind'

export interface Rider {
  id: string
  name: string
  platform: Platform
  city: string
  zone: string
  riskLevel: RiskLevel
  weeklyPremium: number
  policyStatus: PolicyStatus
  claimStatus: ClaimStatus
  aiScore: number
  joinedDate: string
}

export interface Alert {
  id: string
  title: string
  description: string
  type: AlertType
  priority: AlertPriority
  timestamp: string
  zone?: string
  affected?: number
}

export interface RiskZone {
  id: string
  name: string
  city: string
  activeRiders: number
  disruption: DisruptionType | null
  riskLevel: RiskLevel
  claimsTriggered: number
  aqiLevel?: number
  temperature?: number
  lastUpdated: string
}

export interface Policy {
  id: string
  riderId: string
  riderName: string
  planName: PolicyPlanName
  platform: Platform
  startDate: string
  endDate: string
  premium: number
  status: PolicyStatus
  coverage: number
}

export interface PolicyPlan {
  id: string
  name: PolicyPlanName
  premium: number
  coverage: number
  description: string
  recommendedFor: string
}

export interface Claim {
  id: string
  riderId: string
  riderName: string
  zone: string
  disruption: DisruptionType
  amount: number
  status: ClaimStatus
  triggeredAt: string
  autoTriggered: boolean
}

export interface Payout {
  id: string
  riderId: string
  riderName: string
  amount: number
  claimId: string
  processedAt: string
  method: string
}

export interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number
}

export type PageId = 'dashboard' | 'riders' | 'policies' | 'claims' | 'risk' | 'analytics' | 'settings'
