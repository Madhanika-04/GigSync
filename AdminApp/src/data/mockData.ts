import { Rider, Alert, RiskZone, Policy, Claim, Payout, PolicyPlan } from '../types'

export const riders: Rider[] = [
  { id: 'RD001', name: 'Arun Kumar', platform: 'Swiggy', city: 'Chennai', zone: 'Zone A', riskLevel: 'High', weeklyPremium: 149, policyStatus: 'Active', claimStatus: 'Triggered', aiScore: 82, joinedDate: '2025-11-12' },
  { id: 'RD002', name: 'Priya Rajan', platform: 'Zomato', city: 'Chennai', zone: 'Zone B', riskLevel: 'Medium', weeklyPremium: 99, policyStatus: 'Active', claimStatus: 'None', aiScore: 61, joinedDate: '2025-10-08' },
  { id: 'RD003', name: 'Karthik S', platform: 'Zepto', city: 'Coimbatore', zone: 'North', riskLevel: 'Low', weeklyPremium: 59, policyStatus: 'Active', claimStatus: 'Approved', aiScore: 28, joinedDate: '2025-09-20' },
  { id: 'RD004', name: 'Deepa V', platform: 'Blinkit', city: 'Madurai', zone: 'Urban', riskLevel: 'High', weeklyPremium: 149, policyStatus: 'Pending', claimStatus: 'None', aiScore: 91, joinedDate: '2026-01-03' },
  { id: 'RD005', name: 'Raj Mohan', platform: 'Dunzo', city: 'Salem', zone: 'Hub', riskLevel: 'Medium', weeklyPremium: 99, policyStatus: 'Active', claimStatus: 'Rejected', aiScore: 54, joinedDate: '2025-12-15' },
  { id: 'RD006', name: 'Vignesh R', platform: 'Swiggy', city: 'Chennai', zone: 'Zone C', riskLevel: 'Low', weeklyPremium: 59, policyStatus: 'Expired', claimStatus: 'None', aiScore: 22, joinedDate: '2025-08-10' },
  { id: 'RD007', name: 'Anitha M', platform: 'Zomato', city: 'Coimbatore', zone: 'South', riskLevel: 'High', weeklyPremium: 149, policyStatus: 'Active', claimStatus: 'Triggered', aiScore: 87, joinedDate: '2026-01-20' },
  { id: 'RD008', name: 'Suresh P', platform: 'Zepto', city: 'Chennai', zone: 'Zone A', riskLevel: 'Medium', weeklyPremium: 99, policyStatus: 'Active', claimStatus: 'Approved', aiScore: 65, joinedDate: '2025-11-28' },
  { id: 'RD009', name: 'Kavitha N', platform: 'Blinkit', city: 'Madurai', zone: 'Urban', riskLevel: 'Low', weeklyPremium: 59, policyStatus: 'Active', claimStatus: 'None', aiScore: 31, joinedDate: '2025-10-05' },
  { id: 'RD010', name: 'Murugan T', platform: 'Swiggy', city: 'Salem', zone: 'Hub', riskLevel: 'High', weeklyPremium: 149, policyStatus: 'Pending', claimStatus: 'Triggered', aiScore: 93, joinedDate: '2026-02-01' },
  { id: 'RD011', name: 'Selvi K', platform: 'Dunzo', city: 'Chennai', zone: 'Zone B', riskLevel: 'Medium', weeklyPremium: 99, policyStatus: 'Active', claimStatus: 'None', aiScore: 48, joinedDate: '2025-09-14' },
  { id: 'RD012', name: 'Balaji R', platform: 'Zomato', city: 'Coimbatore', zone: 'North', riskLevel: 'Low', weeklyPremium: 59, policyStatus: 'Active', claimStatus: 'None', aiScore: 19, joinedDate: '2025-07-22' },
]

export const alerts: Alert[] = [
  { id: 'AL001', title: 'Heavy Rain — Chennai Zone A', description: 'Rainfall exceeds 65mm/hr. 18 riders affected.', type: 'weather', priority: 'critical', timestamp: '09:45 AM', zone: 'Chennai Zone A', affected: 18 },
  { id: 'AL002', title: 'AQI Critical — Coimbatore', description: 'Air Quality Index crossed 285. Auto-alerts sent.', type: 'aqi', priority: 'high', timestamp: '08:32 AM', zone: 'Coimbatore', affected: 12 },
  { id: 'AL003', title: 'Extreme Heat — Madurai', description: 'Temperature at 44°C. Heat disruption protocol active.', type: 'heat', priority: 'high', timestamp: '07:15 AM', zone: 'Madurai Urban', affected: 8 },
  { id: 'AL004', title: 'Auto-Claims Triggered', description: '15 claims auto-triggered based on parametric rules.', type: 'claim', priority: 'medium', timestamp: '06:55 AM', affected: 15 },
  { id: 'AL005', title: 'Fraud Alert — Duplicate Claim', description: 'Suspicious activity flagged for RD007 & RD010.', type: 'fraud', priority: 'critical', timestamp: '06:20 AM', affected: 2 },
  { id: 'AL006', title: 'Zone Closure — Salem Hub', description: 'Salem delivery hub restricted. 6 riders reallocated.', type: 'zone', priority: 'medium', timestamp: '05:50 AM', zone: 'Salem Hub', affected: 6 },
  { id: 'AL007', title: 'Strong Wind Warning', description: 'Wind speeds 72 km/h detected in Chennai South.', type: 'weather', priority: 'high', timestamp: '04:30 AM', zone: 'Chennai South', affected: 10 },
]

export const riskZones: RiskZone[] = [
  { id: 'Z001', name: 'Chennai Central', city: 'Chennai', activeRiders: 43, disruption: 'Heavy Rain', riskLevel: 'High', claimsTriggered: 8, aqiLevel: 165, temperature: 31, lastUpdated: '2 min ago' },
  { id: 'Z002', name: 'Chennai South', city: 'Chennai', activeRiders: 29, disruption: 'Heavy Rain', riskLevel: 'High', claimsTriggered: 5, aqiLevel: 182, temperature: 30, lastUpdated: '3 min ago' },
  { id: 'Z003', name: 'Coimbatore North', city: 'Coimbatore', activeRiders: 31, disruption: 'High AQI', riskLevel: 'High', claimsTriggered: 4, aqiLevel: 285, temperature: 38, lastUpdated: '1 min ago' },
  { id: 'Z004', name: 'Madurai Urban', city: 'Madurai', activeRiders: 22, disruption: 'Extreme Heat', riskLevel: 'High', claimsTriggered: 3, aqiLevel: 120, temperature: 44, lastUpdated: '5 min ago' },
  { id: 'Z005', name: 'Salem Delivery Hub', city: 'Salem', activeRiders: 18, disruption: 'Zone Closure', riskLevel: 'Medium', claimsTriggered: 2, aqiLevel: 98, temperature: 36, lastUpdated: '8 min ago' },
  { id: 'Z006', name: 'Coimbatore South', city: 'Coimbatore', activeRiders: 15, disruption: null, riskLevel: 'Low', claimsTriggered: 0, aqiLevel: 65, temperature: 33, lastUpdated: '4 min ago' },
]

export const policyPlans: PolicyPlan[] = [
  { id: 'PLAN001', name: 'Basic', premium: 59, coverage: 1200, description: 'Starter protection for low-disruption routes and short city shifts.', recommendedFor: 'Low-risk riders and part-time coverage' },
  { id: 'PLAN002', name: 'Standard', premium: 79, coverage: 1500, description: 'Balanced cover for riders in stable zones with moderate weekly exposure.', recommendedFor: 'Low to medium risk delivery zones' },
  { id: 'PLAN003', name: 'Plus', premium: 99, coverage: 1800, description: 'Standard weekly protection with stronger disruption payouts.', recommendedFor: 'Medium-risk riders and dense city routes' },
  { id: 'PLAN004', name: 'Premium', premium: 149, coverage: 2500, description: 'Enhanced payout limits for high-risk weather and disruption events.', recommendedFor: 'High-risk riders and volatile zones' },
  { id: 'PLAN005', name: 'Elite', premium: 199, coverage: 3200, description: 'Top-tier cover with the highest payout ceiling for severe exposures.', recommendedFor: 'Critical routes, enterprise fleets, and high-value protection' },
]

export const policies: Policy[] = [
  { id: 'POL001', riderId: 'RD001', riderName: 'Arun Kumar', planName: 'Premium', platform: 'Swiggy', startDate: '2026-03-09', endDate: '2026-03-15', premium: 149, status: 'Active', coverage: 2500 },
  { id: 'POL002', riderId: 'RD002', riderName: 'Priya Rajan', planName: 'Plus', platform: 'Zomato', startDate: '2026-03-09', endDate: '2026-03-15', premium: 99, status: 'Active', coverage: 1800 },
  { id: 'POL003', riderId: 'RD007', riderName: 'Anitha M', planName: 'Premium', platform: 'Zomato', startDate: '2026-03-09', endDate: '2026-03-15', premium: 149, status: 'Active', coverage: 2500 },
  { id: 'POL004', riderId: 'RD004', riderName: 'Deepa V', planName: 'Premium', platform: 'Blinkit', startDate: '2026-03-10', endDate: '2026-03-16', premium: 149, status: 'Pending', coverage: 2500 },
  { id: 'POL005', riderId: 'RD010', riderName: 'Murugan T', planName: 'Premium', platform: 'Swiggy', startDate: '2026-03-10', endDate: '2026-03-16', premium: 149, status: 'Pending', coverage: 2500 },
]

export const claims: Claim[] = [
  { id: 'CLM001', riderId: 'RD001', riderName: 'Arun Kumar', zone: 'Chennai Zone A', disruption: 'Heavy Rain', amount: 1200, status: 'Triggered', triggeredAt: '09:48 AM', autoTriggered: true },
  { id: 'CLM002', riderId: 'RD003', riderName: 'Karthik S', zone: 'Coimbatore North', disruption: 'High AQI', amount: 800, status: 'Approved', triggeredAt: '08:35 AM', autoTriggered: true },
  { id: 'CLM003', riderId: 'RD007', riderName: 'Anitha M', zone: 'Coimbatore South', disruption: 'High AQI', amount: 1200, status: 'Triggered', triggeredAt: '08:33 AM', autoTriggered: true },
  { id: 'CLM004', riderId: 'RD008', riderName: 'Suresh P', zone: 'Chennai Zone A', disruption: 'Heavy Rain', amount: 900, status: 'Approved', triggeredAt: '07:20 AM', autoTriggered: true },
  { id: 'CLM005', riderId: 'RD005', riderName: 'Raj Mohan', zone: 'Salem Hub', disruption: 'Zone Closure', amount: 700, status: 'Rejected', triggeredAt: '06:45 AM', autoTriggered: false },
]

export const payouts: Payout[] = [
  { id: 'PAY001', riderId: 'RD003', riderName: 'Karthik S', amount: 800, claimId: 'CLM002', processedAt: '10:05 AM', method: 'UPI' },
  { id: 'PAY002', riderId: 'RD008', riderName: 'Suresh P', amount: 900, claimId: 'CLM004', processedAt: '09:50 AM', method: 'Bank Transfer' },
  { id: 'PAY003', riderId: 'RD009', riderName: 'Kavitha N', amount: 650, claimId: 'CLM006', processedAt: '09:12 AM', method: 'UPI' },
  { id: 'PAY004', riderId: 'RD011', riderName: 'Selvi K', amount: 720, claimId: 'CLM007', processedAt: '08:37 AM', method: 'UPI' },
]

// Chart data
export const platformPoliciesData = [
  { name: 'Swiggy', policies: 312, color: '#f97316' },
  { name: 'Zomato', policies: 278, color: '#ef4444' },
  { name: 'Zepto', policies: 195, color: '#8b5cf6' },
  { name: 'Blinkit', policies: 167, color: '#f59e0b' },
  { name: 'Dunzo', policies: 98, color: '#10b981' },
]

export const claimsByDisruptionData = [
  { type: 'Heavy Rain', claims: 145, color: '#3b82f6' },
  { type: 'Extreme Heat', claims: 89, color: '#f97316' },
  { type: 'High AQI', claims: 67, color: '#8b5cf6' },
  { type: 'Zone Closure', claims: 42, color: '#f59e0b' },
  { type: 'Flash Flood', claims: 28, color: '#06b6d4' },
  { type: 'Strong Wind', claims: 19, color: '#10b981' },
]

export const weeklyPayoutTrendData = [
  { week: 'Week 1', payouts: 42500, claims: 38, policies: 820 },
  { week: 'Week 2', payouts: 58200, claims: 53, policies: 895 },
  { week: 'Week 3', payouts: 39800, claims: 31, policies: 910 },
  { week: 'Week 4', payouts: 71500, claims: 68, policies: 980 },
  { week: 'Week 5', payouts: 65300, claims: 62, policies: 1012 },
  { week: 'Week 6', payouts: 82100, claims: 78, policies: 1050 },
  { week: 'Week 7', payouts: 54700, claims: 49, policies: 1030 },
  { week: 'Week 8', payouts: 93200, claims: 89, policies: 1100 },
]

export const riskDistributionData = [
  { zone: 'Chennai C', high: 43, medium: 18, low: 12 },
  { zone: 'Chennai S', high: 29, medium: 14, low: 8 },
  { zone: 'CBE North', high: 31, medium: 22, low: 15 },
  { zone: 'Madurai', high: 22, medium: 16, low: 11 },
  { zone: 'Salem', high: 18, medium: 24, low: 20 },
  { zone: 'CBE South', high: 8, medium: 19, low: 35 },
]

export const statsData = {
  totalRidersEnrolled: 1050,
  activePolicies: 834,
  claimsToday: 23,
  weeklyPayouts: 93200,
  highRiskZones: 4,
  totalPremiumCollected: 128500,
  fraudAlertsDetected: 3,
}
