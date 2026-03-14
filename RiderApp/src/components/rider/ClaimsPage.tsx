import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, CheckCircle, Clock, IndianRupee,
    CloudRain, Wind, Thermometer, XCircle,
    ShieldCheck, MapPin, Activity, Wallet,
    ChevronRight, X, AlertCircle, Check,
    MessageSquarePlus, Zap
} from 'lucide-react';

/* ─── Types ─── */
type ClaimStatus = 'Processing' | 'Approved' | 'Paid' | 'Rejected';
type DisruptionType = 'Heavy Rain' | 'Pollution' | 'Air Pollution' | 'Extreme Heat' | 'Zone Closure';

interface Claim {
    id: string;
    date: string;
    disruption: DisruptionType;
    location: string;
    incomeLoss: number;
    payout: number;
    status: ClaimStatus;
    rainfallMm?: number;
    ordersDropped?: number;
    paymentMethod?: string;
    txnId?: string;
    aqiLevel?: number;
}

const PROGRESS_STEPS = ['Triggered', 'Validating', 'Approved', 'Paid'];

interface ClaimsPageProps {
    activeClaim: Claim | null;
    claimHistory: Claim[];
    riderZone: string;
}

/* ─── Helpers ─── */
const statusStyles: Record<ClaimStatus, { bg: string; text: string; icon: React.ReactNode }> = {
    Processing: { bg: 'bg-warning/15', text: 'text-warning', icon: <Clock className="h-3 w-3" /> },
    Approved: { bg: 'bg-blue-500/15', text: 'text-blue-400', icon: <CheckCircle className="h-3 w-3" /> },
    Paid: { bg: 'bg-success/15', text: 'text-success', icon: <IndianRupee className="h-3 w-3" /> },
    Rejected: { bg: 'bg-danger/15', text: 'text-danger', icon: <XCircle className="h-3 w-3" /> },
};

const disruptionIcon: Record<DisruptionType, React.ReactNode> = {
    'Heavy Rain': <CloudRain className="h-4 w-4" />,
    'Pollution': <Wind className="h-4 w-4" />,
    'Air Pollution': <Wind className="h-4 w-4" />,
    'Extreme Heat': <Thermometer className="h-4 w-4" />,
    'Zone Closure': <XCircle className="h-4 w-4" />,
};

const activeStep = (status: ClaimStatus) => {
    if (status === 'Processing') return 1;   // Validating
    if (status === 'Approved') return 2;   // Approved
    if (status === 'Paid') return 3;   // Paid
    return 0;                                // Triggered
};

function StatusBadge({ status }: { status: ClaimStatus }) {
    const s = statusStyles[status];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}>
            {s.icon} {status}
        </span>
    );
}

/* ─── Main Page ─── */
export function ClaimsPage({ activeClaim, claimHistory, riderZone }: ClaimsPageProps) {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [othersText, setOthersText] = useState("");

    const activeClaimPayout = activeClaim && activeClaim.status === 'Paid' ? activeClaim.payout : 0;
    const totalPayout = claimHistory.filter(c => c.status === 'Paid').reduce((a, c) => a + c.payout, 0) + activeClaimPayout;
    const approved = claimHistory.filter(c => c.status === 'Approved' || c.status === 'Paid').length + (activeClaim && (activeClaim.status === 'Approved' || activeClaim.status === 'Paid') ? 1 : 0);
    const pending = claimHistory.filter(c => c.status === 'Processing').length + (activeClaim && activeClaim.status === 'Processing' ? 1 : 0);
    const total = claimHistory.length + (activeClaim ? 1 : 0);
    const contextTimestamp = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date());

    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };
    const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
            {/* Page Header */}
            <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Claims</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Track your disruption claims and payouts</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setReviewOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                >
                    <MessageSquarePlus className="h-4 w-4" />
                    Request Claim Review
                </motion.button>
            </motion.div>

            {/* ─── Section 1: Summary Cards ─── */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Claims', value: total, icon: <FileText className="h-5 w-5" />, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Approved', value: approved, icon: <CheckCircle className="h-5 w-5" />, color: 'text-success', bg: 'bg-success/10' },
                    { label: 'Pending', value: pending, icon: <Clock className="h-5 w-5" />, color: 'text-warning', bg: 'bg-warning/10' },
                    { label: 'Total Payout', value: `₹${totalPayout}`, icon: <IndianRupee className="h-5 w-5" />, color: 'text-primary', bg: 'bg-primary/10' },
                ].map(({ label, value, icon, color, bg }) => (
                    <motion.div
                        key={label}
                        whileHover={{ y: -3 }}
                        className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col gap-3"
                    >
                        <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center`}>{icon}</div>
                        <div>
                            <p className="text-lg font-bold text-foreground">{value}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ─── Section 2 + 3: Active Claim + Progress ─── */}
            {activeClaim && (
                <motion.div variants={item} className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-warning" />
                            <h2 className="text-base font-bold text-foreground">Active Claim</h2>
                        </div>
                        <StatusBadge status={activeClaim.status} />
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Claim info */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Claim ID', value: activeClaim.id },
                                    { label: 'Trigger Event', value: activeClaim.disruption },
                                    { label: 'Location', value: activeClaim.location },
                                    { label: 'Date', value: activeClaim.date },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1">{label}</p>
                                        <p className="text-sm font-semibold text-foreground">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 pt-2">
                                <div className="flex-1 bg-muted/20 border border-border/30 rounded-xl p-3 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Income Loss</p>
                                    <p className="text-base font-bold text-danger mt-1">₹{activeClaim.incomeLoss}</p>
                                </div>
                                <div className="flex-1 bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expected Payout</p>
                                    <p className="text-base font-bold text-primary mt-1">₹{activeClaim.payout}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div className="flex flex-col justify-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Claim Progress</p>
                            <div className="relative flex items-start justify-between">
                                {/* connecting line */}
                                <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-border/40 mx-8" />
                                <div
                                    className="absolute top-3.5 left-0 h-0.5 bg-primary mx-8 transition-all duration-700"
                                    style={{ width: `calc(${(activeStep(activeClaim.status) / (PROGRESS_STEPS.length - 1)) * 100}% - 4rem` }}
                                />

                                {PROGRESS_STEPS.map((step, i) => {
                                    const done = i < activeStep(activeClaim.status) + 1;
                                    const current = i === activeStep(activeClaim.status);
                                    return (
                                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${current ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-md shadow-primary/30'
                                                : done ? 'border-primary/60 bg-primary/20 text-primary'
                                                    : 'border-border/40 bg-card text-muted-foreground'
                                                }`}>
                                                {done && !current ? <Check className="h-3 w-3" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                                            </div>
                                            <p className={`text-[10px] font-bold text-center leading-tight ${current ? 'text-primary' : done ? 'text-foreground/60' : 'text-muted-foreground/50'}`}>{step}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ─── Section 4: Claim History ─── */}
            <motion.div variants={item} className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-base font-bold text-foreground">Claim History</h2>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{claimHistory.length} claims</span>
                </div>

                {claimHistory.length > 0 && (
                <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {['Date', 'Claim ID', 'Disruption', 'Location', 'Payout', 'Status'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{h}</th>
                                ))}
                                <th className="px-6 py-3 w-8" />
                            </tr>
                        </thead>
                        <tbody>
                            {claimHistory.map((claim, i) => (
                                <motion.tr
                                    key={claim.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => setSelectedClaim(claim)}
                                    className="border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{claim.date}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{claim.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {disruptionIcon[claim.disruption]}
                                            {claim.disruption}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{claim.location}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                                        {claim.payout > 0 ? `₹${claim.payout}` : '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={claim.status} />
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground group-hover:text-primary transition-colors">
                                        <ChevronRight className="h-4 w-4" />
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-border/30">
                    {claimHistory.map((claim, i) => (
                        <motion.div
                            key={claim.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedClaim(claim)}
                            className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-muted/20 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground shrink-0">
                                    {disruptionIcon[claim.disruption]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{claim.id}</p>
                                    <p className="text-xs text-muted-foreground">{claim.date} · {claim.location}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <StatusBadge status={claim.status} />
                                <p className="text-sm font-bold text-foreground">{claim.payout > 0 ? `₹${claim.payout}` : '—'}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                </>
                )}

                {claimHistory.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground">
                            <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-foreground">No claim history yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Once this rider submits and completes claims, they will appear here with live payout details.
                        </p>
                    </div>
                )}
            </motion.div>

            {/* ─── Section 6: AI Validation ─── */}
            <motion.div variants={item} className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-bold text-foreground">AI Claim Validation</h2>
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-success/15 text-success text-[11px] font-bold">Verified</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { label: 'Location Match', icon: <MapPin className="h-3.5 w-3.5" /> },
                        { label: 'Delivery Inactivity', icon: <Activity className="h-3.5 w-3.5" /> },
                        { label: 'Duplicate Claim Check', icon: <Zap className="h-3.5 w-3.5" /> },
                    ].map(({ label, icon }) => (
                        <div key={label} className="flex items-center gap-3 bg-success/5 border border-success/20 rounded-xl px-4 py-3">
                            <div className="text-success">{icon}</div>
                            <span className="text-sm font-medium text-foreground flex-1">{label}</span>
                            <Check className="h-4 w-4 text-success shrink-0" />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                    Claims are automatically validated using AI-powered satellite weather feeds, GPS location history, and delivery platform inactivity signals. Payouts are triggered within 4 hours of validation.
                </p>
            </motion.div>

            {/* ─── Claim Details Modal ─── */}
            <AnimatePresence>
                {selectedClaim && (
                    <motion.div
                        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedClaim(null)}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                            initial={{ scale: 0.92, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.92, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                        >
                            <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-foreground">{selectedClaim.id}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{selectedClaim.date} · {selectedClaim.location}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedClaim(null)}
                                    className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Disruption trigger */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Disruption Trigger</p>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/25 border border-border/30">
                                        <span className="text-warning">{disruptionIcon[selectedClaim.disruption]}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{selectedClaim.disruption}</p>
                                            {selectedClaim.rainfallMm && <p className="text-xs text-muted-foreground">Rainfall detected: {selectedClaim.rainfallMm}mm</p>}
                                            {selectedClaim.aqiLevel && <p className="text-xs text-muted-foreground">AQI Level: {selectedClaim.aqiLevel}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Orders Dropped', value: selectedClaim.ordersDropped ?? '—' },
                                        { label: 'Income Loss', value: `₹${selectedClaim.incomeLoss}` },
                                        { label: 'Final Payout', value: selectedClaim.payout > 0 ? `₹${selectedClaim.payout}` : '—' },
                                        { label: 'Payment Method', value: selectedClaim.paymentMethod ?? '—' },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-muted/20 rounded-xl p-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                                            <p className="text-sm font-bold text-foreground mt-1">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Transaction ID */}
                                {selectedClaim.txnId && (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
                                        <Wallet className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transaction ID</p>
                                            <p className="text-sm font-bold text-foreground">{selectedClaim.txnId}</p>
                                        </div>
                                        <StatusBadge status={selectedClaim.status} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Request Review Modal ─── */}
            <AnimatePresence>
                {reviewOpen && (
                    <motion.div
                        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => { setReviewOpen(false); setSelectedReasons([]); setOthersText(""); }}
                        />
                        <motion.div
                            className="relative bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
                            initial={{ scale: 0.92, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.92, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-warning" />
                                    <h3 className="text-base font-bold text-foreground">Request Claim Review</h3>
                                </div>
                                <button onClick={() => { setReviewOpen(false); setSelectedReasons([]); setOthersText(""); }} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="bg-muted/20 border border-border/50 rounded-xl p-3 flex flex-col gap-1 mb-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Context</p>
                                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5" /> {riderZone}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> {contextTimestamp}
                                </p>
                            </div>

                            <p className="text-sm font-medium text-foreground mb-3">
                                Why are you requesting a review?
                            </p>

                            <div className="grid grid-cols-1 gap-2 mb-6">
                                {['App crash', 'GPS issue', 'Flooded roads', 'Missed disruption detection', 'Others'].map((reason) => {
                                    const isSelected = selectedReasons.includes(reason);
                                    return (
                                        <div key={reason} className="flex flex-col gap-2">
                                            <label
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/30 group'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        setSelectedReasons(prev =>
                                                            prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
                                                        );
                                                    }}
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border/50 text-transparent group-hover:border-primary'}`}>
                                                    <Check className="h-3 w-3" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{reason}</span>
                                            </label>
                                            {reason === 'Others' && isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <textarea
                                                        value={othersText}
                                                        onChange={(e) => setOthersText(e.target.value)}
                                                        placeholder="Please specify the reason..."
                                                        className="w-full p-3 text-sm rounded-xl border border-border/50 bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-24 mb-1"
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={() => { setReviewOpen(false); setSelectedReasons([]); setOthersText(""); }}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-border/50 text-sm font-semibold text-muted-foreground hover:bg-muted/40 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { setReviewOpen(false); setSelectedReasons([]); setOthersText(""); }}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
