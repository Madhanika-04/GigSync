import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { CoverageStatus } from './CoverageStatus';
import { DynamicAlerts } from './DynamicAlerts';
import { ClaimStatusCard } from './ClaimStatusCard';
import { PayoutSection } from './PayoutSection';
import {
    MOCK_RIDER,
    RIDER_ALERTS,
    RIDER_CLAIMS,
    RIDER_PAYOUTS
} from '../../data/mock';

export function Dashboard() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* ── Row 1: Hero (Rider overview) ── */}
            <HeroSection rider={MOCK_RIDER} />

            {/* ── Row 2: Coverage Status ── */}
            <CoverageStatus isActive={true} />

            {/* ── Row 3: Live Disruption Alerts ── */}
            <DynamicAlerts alerts={RIDER_ALERTS} />

            {/* ── Row 4: Active Claim Status + Recent Payout Summary ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ClaimStatusCard claims={RIDER_CLAIMS} />
                <PayoutSection payouts={RIDER_PAYOUTS} />
            </div>
            
        </motion.div>
    );
}
