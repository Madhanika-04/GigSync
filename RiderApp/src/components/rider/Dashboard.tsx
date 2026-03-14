import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { CoverageStatus } from './CoverageStatus';
import { DynamicAlerts } from './DynamicAlerts';
import { ClaimStatusCard } from './ClaimStatusCard';
import { PayoutSection } from './PayoutSection';
import {
    MOCK_RIDER,
    RIDER_ALERTS,
    RIDER_CLAIMS
} from '../../data/mock';
import { type RiderProfile, type InsurancePolicy, type RiderPayout } from '../../data/mock';

interface DashboardProps {
    rider: RiderProfile;
    policy: InsurancePolicy;
    totalPayouts: number;
    payoutHistory: RiderPayout[];
    riskMessage: string;
}

export function Dashboard({ rider, policy, totalPayouts, payoutHistory, riskMessage }: DashboardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* ── Row 1: Hero (Rider overview) ── */}
            <HeroSection rider={rider ?? MOCK_RIDER} policy={policy} totalPayouts={totalPayouts} />

            {/* ── Row 2: Coverage Status ── */}
            <CoverageStatus isActive={true} planName={policy.coverageType} riskMessage={riskMessage} />

            {/* ── Row 3: Live Disruption Alerts ── */}
            <DynamicAlerts alerts={RIDER_ALERTS} />

            {/* ── Row 4: Active Claim Status + Recent Payout Summary ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ClaimStatusCard claims={RIDER_CLAIMS} />
                <PayoutSection payouts={payoutHistory} />
            </div>
            
        </motion.div>
    );
}
