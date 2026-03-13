export type Platform = 'Swiggy' | 'Zomato' | 'Zepto' | 'Blinkit' | 'Dunzo';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type PolicyStatus = 'Active' | 'Pending' | 'Expired';
export type ClaimStatus = 'Processing' | 'Approved' | 'Rejected' | 'Completed';
export type DisruptionType = 'Heavy Rain' | 'Extreme Heat' | 'Pollution' | 'Zone Closure' | 'Fraud Alert';

export interface RiderProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    bio: string;
    platform: Platform;
    zone: string;
    city: string;
    rating: number;
    experienceYears: number;
    avgDailyIncome: number;
    avgWeeklyIncome: number;
    avgWorkingHours: number;
    address: {
        country: string;
        cityState: string;
        postalCode: string;
        taxId: string;
    };
    social: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
    emergencyContact: {
        name: string;
        phone: string;
    };
}

export interface InsurancePolicy {
    policyId: string;
    status: PolicyStatus;
    coverageType: string;
    weeklyPremium: number;
    coverageLimit: number;
    maxPayoutPerEvent: number;
    startDate: string;
    expiryDate: string;
}

export interface RiderAlert {
    id: string;
    type: DisruptionType;
    zone: string;
    description: string;
    timestamp: string;
}

export interface RiderClaim {
    id: string;
    type: DisruptionType;
    date: string;
    status: ClaimStatus;
    payout: number;
}

export interface RiderPayout {
    id: string;
    date: string;
    reason: string;
    amount: number;
    method: string;
    status: 'Completed' | 'Pending';
}

export const MOCK_RIDER: RiderProfile = {
    id: 'RID-1024',
    name: 'Ravi Kumar',
    email: 'ravi.k@gigsync.ai',
    phone: '+91 98765 43210',
    bio: 'Premium Delivery Partner | 5-Star Rated',
    platform: 'Swiggy',
    zone: 'Chennai South',
    city: 'Chennai',
    rating: 4.9,
    experienceYears: 3.5,
    avgDailyIncome: 700,
    avgWeeklyIncome: 4500,
    avgWorkingHours: 9.5,
    address: {
        country: 'India',
        cityState: 'Chennai, Tamil Nadu',
        postalCode: '600001',
        taxId: 'PAN-XXXX1234X'
    },
    social: {
        facebook: 'ravi.swiggy',
        twitter: '@ravicaptain',
        linkedin: 'ravi-kumar-gig',
        instagram: '@ravi_deliveries'
    },
    emergencyContact: {
        name: 'Suresh Kumar',
        phone: '+91 98765 00000'
    }
};

export const MOCK_POLICY: InsurancePolicy = {
    policyId: 'POL-GIG-2026-X88',
    status: 'Active',
    coverageType: 'Weather + Pollution Pulse',
    weeklyPremium: 30,
    coverageLimit: 7000,
    maxPayoutPerEvent: 700,
    startDate: '01 Jan 2026',
    expiryDate: '31 Dec 2026'
};

export const RIDER_ALERTS: RiderAlert[] = [
    {
        id: 'AL-001',
        type: 'Heavy Rain',
        zone: 'Chennai South',
        description: 'Delivery activity predicted to be affected by heavy downpour.',
        timestamp: '15 mins ago'
    },
    {
        id: 'AL-002',
        type: 'Pollution',
        zone: 'Chennai South',
        description: 'AQI above 350. Wear a mask during your shift.',
        timestamp: '2 hours ago'
    }
];

export const RIDER_CLAIMS: RiderClaim[] = [
    {
        id: 'CL-882',
        type: 'Heavy Rain',
        date: '12 Mar 2026',
        status: 'Processing',
        payout: 525
    },
    {
        id: 'CL-880',
        type: 'Extreme Heat',
        date: '08 Mar 2026',
        status: 'Completed',
        payout: 700
    }
];

export const RIDER_PAYOUTS: RiderPayout[] = [
    {
        id: 'TXN-991',
        date: '10 Mar 2026',
        reason: 'Extreme Heat Protection',
        amount: 700,
        method: 'UPI',
        status: 'Completed'
    },
    {
        id: 'TXN-985',
        date: '03 Mar 2026',
        reason: 'Heavy Rain Protection',
        amount: 525,
        method: 'UPI',
        status: 'Completed'
    }
];

export const WEEKLY_PROTECTION_DATA = [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 700 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 525 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
];
