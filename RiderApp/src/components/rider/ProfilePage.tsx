import { motion, type Variants } from 'framer-motion';
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Edit2,
    ChevronRight,
    Briefcase,
    TrendingUp,
    ShieldCheck,
    Zap,
    AlertTriangle,
    CloudRain,
    Wind,
    Wallet,
    CreditCard,
    PhoneCall,
    Shield,
    Phone,
    HelpCircle,
    MessageCircle
} from 'lucide-react';
import { type RiderProfile, type InsurancePolicy } from '../../data/mock';

interface ProfilePageProps {
    rider: RiderProfile;
    policy: InsurancePolicy;
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
};

export function ProfilePage({ rider, policy }: ProfilePageProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-6"
        >
            {/* Page Title */}
            <h2 className="text-xl font-semibold text-foreground px-1">Profile</h2>

            {/* ─── Profile Summary Card (full width) ─── */}
            <motion.div
                variants={itemVariants}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
            >
                {/* Left: Avatar + Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="h-20 w-20 rounded-full overflow-hidden shrink-0 border-4 border-muted/30">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rider.name}`}
                            alt={rider.name}
                            className="h-full w-full object-cover bg-muted"
                        />
                    </div>
                    <div className="text-center sm:text-left space-y-1 pt-1">
                        <h3 className="text-lg font-bold text-foreground leading-tight">{rider.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground">
                            {rider.bio.split('|')[0].trim()}
                            &nbsp;|&nbsp;
                            {rider.address.cityState}, {rider.address.country}
                        </p>
                    </div>
                </div>

                {/* Right: Social Icons + Edit */}
                <div className="flex items-center gap-3 shrink-0">
                    {[
                        { Icon: Facebook, hover: 'hover:text-[#1877F2]' },
                        { Icon: Twitter, hover: 'hover:text-[#1DA1F2]' },
                        { Icon: Linkedin, hover: 'hover:text-[#0A66C2]' },
                        { Icon: Instagram, hover: 'hover:text-[#E4405F]' },
                    ].map(({ Icon, hover }, i) => (
                        <button
                            key={i}
                            className={`h-9 w-9 flex items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors ${hover}`}
                        >
                            <Icon className="h-4 w-4" />
                        </button>
                    ))}
                    <EditButton label="Edit" showLabel />
                </div>
            </motion.div>

            {/* ─── Two-Column Dashboard Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ══ LEFT COLUMN ══ */}
                <div className="space-y-6">

                    {/* Personal Information */}
                    <SectionCard title="Personal Information" variants={itemVariants}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-10">
                            <InfoField label="First Name" value={rider.name.split(' ')[0]} />
                            <InfoField label="Last Name" value={rider.name.split(' ').slice(1).join(' ')} />
                            <InfoField label="Email Address" value={rider.email} />
                            <InfoField label="Phone" value={rider.phone} />
                            <div className="sm:col-span-2">
                                <InfoField label="Bio" value={rider.bio} />
                            </div>
                        </div>
                    </SectionCard>

                    {/* Address */}
                    <SectionCard title="Address" variants={itemVariants}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-10">
                            <InfoField label="Country" value={rider.address.country} />
                            <InfoField label="City / State" value={rider.address.cityState} />
                            <InfoField label="Postal Code" value={rider.address.postalCode} />
                            <InfoField label="Tax ID" value={rider.address.taxId} />
                        </div>
                    </SectionCard>

                    {/* Gig Details */}
                    <SectionCard title="Gig Details" icon={<Briefcase className="h-4 w-4 text-primary" />} variants={itemVariants}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-10">
                            <InfoField label="Rider ID" value={rider.id} />
                            <InfoField label="Platform" value={rider.platform} />
                            <InfoField label="Delivery Zone" value={rider.zone} />
                            <InfoField label="Experience" value={`${rider.experienceYears} Years`} />
                            <div className="sm:col-span-2">
                                <InfoField label="Rider Rating" value={`${rider.rating} ★ (Premium Captain)`} color="text-warning" />
                            </div>
                        </div>
                    </SectionCard>

                    {/* Earnings */}
                    <SectionCard title="Earnings Profile" icon={<TrendingUp className="h-4 w-4 text-success" />} variants={itemVariants}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-10">
                            <InfoField label="Average Daily" value={`₹${rider.avgDailyIncome}`} />
                            <InfoField label="Average Weekly" value={`₹${rider.avgWeeklyIncome}`} />
                            <InfoField label="Working Hours" value={`${rider.avgWorkingHours}h / day`} />
                            <InfoField label="Trend Status" value="Stable Growth" color="text-success" />
                        </div>
                    </SectionCard>
                </div>

                {/* ══ RIGHT COLUMN ══ */}
                <div className="space-y-6">

                    {/* Active Policy */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-primary/5 rounded-2xl p-6 shadow-sm border-2 border-primary/20 relative overflow-hidden group"
                    >
                        {/* Decorative watermark */}
                        <div className="absolute -top-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <Shield className="h-36 w-36" />
                        </div>

                        <div className="relative z-10 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    <h4 className="text-base font-bold text-foreground">Active Protection Policy</h4>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest">
                                    {policy.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                <InfoField label="Policy ID" value={policy.policyId} />
                                <InfoField label="Coverage Type" value={policy.coverageType} />
                                <InfoField label="Weekly Premium" value={`₹${policy.weeklyPremium}`} />
                                <InfoField label="Max Payout" value={`₹${policy.maxPayoutPerEvent}`} />
                            </div>

                            <div className="pt-4 border-t border-primary/10 flex items-center justify-between text-sm">
                                <p className="text-muted-foreground font-medium">
                                    Expires on: <span className="text-foreground">{policy.expiryDate}</span>
                                </p>
                                <button className="flex items-center gap-1 font-bold text-primary hover:underline text-sm">
                                    View Documents <ChevronRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* AI Risk Intelligence */}
                    <SectionCard title="AI Risk Intelligence" icon={<Zap className="h-4 w-4 text-warning" />} variants={itemVariants} noPad>
                        <div className="px-6 pb-6 space-y-5">
                            <RiskBar label="Weather Sensitivity" value={25} icon={CloudRain} />
                            <RiskBar label="Pollution Sensitivity" value={65} icon={Wind} color="bg-warning" />
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/30 flex gap-3">
                                <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                    AI Insight: Operating in a{' '}
                                    <span className="text-foreground font-bold">Low Risk Zone</span>.
                                    Expected disruptions are 12% lower than city average.
                                </p>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Payout Method */}
                    <SectionCard title="Payout Method" icon={<Wallet className="h-4 w-4 text-primary" />} variants={itemVariants} action={<button className="text-sm font-semibold text-primary hover:underline">Change</button>}>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/20">
                            <CreditCard className="h-6 w-6 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-0.5">Linked UPI ID</p>
                                <p className="text-sm font-bold text-foreground">9876543210@oksbi</p>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Emergency Contact */}
                    <SectionCard title="Emergency Contact" icon={<PhoneCall className="h-4 w-4 text-danger" />} variants={itemVariants}>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-danger/10 bg-danger/5">
                            <div>
                                <p className="text-sm font-bold text-foreground">{rider.emergencyContact.name}</p>
                                <p className="text-xs font-medium text-muted-foreground mt-0.5">{rider.emergencyContact.phone}</p>
                            </div>
                            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                                <Phone className="h-4 w-4" />
                            </button>
                        </div>
                    </SectionCard>

                    {/* Help & FAQ */}
                    <SectionCard title="Support & FAQ" icon={<HelpCircle className="h-4 w-4 text-primary" />} variants={itemVariants}>
                        <div className="space-y-2">
                            {[
                                'How does Parametric Insurance work?',
                                'When are payouts credited?',
                                'I missed a claim. What do I do?',
                            ].map((q, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 border border-transparent hover:border-border/50 transition-all text-left group">
                                    <span className="text-sm font-medium text-foreground">{q}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                                </button>
                            ))}
                            <button className="mt-2 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-bold">
                                <MessageCircle className="h-4 w-4" /> Start Live Chat
                            </button>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Reusable Components ─── */

function SectionCard({
    title,
    icon,
    action,
    children,
    variants,
    noPad = false,
}: {
    title: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    children: React.ReactNode;
    variants: Variants;
    noPad?: boolean;
}) {
    return (
        <motion.div variants={variants} className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
            <div className={`flex items-center justify-between px-5 py-4 ${!noPad ? 'border-b border-border/30' : ''}`}>
                <div className="flex items-center gap-2">
                    {icon}
                    <h4 className="text-base font-bold text-foreground">{title}</h4>
                </div>
                {action ?? (
                    <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                        <Edit2 className="h-3 w-3" />
                        Edit
                    </button>
                )}
            </div>
            {!noPad && <div className="px-5 py-4">{children}</div>}
            {noPad && children}
        </motion.div>
    );
}

function EditButton({ label, showLabel }: { label: string; showLabel?: boolean }) {
    return (
        <button className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-border/60 text-sm font-semibold text-foreground hover:bg-muted/50 transition-all active:scale-95">
            <Edit2 className="h-3.5 w-3.5" />
            {showLabel && label}
        </button>
    );
}

function InfoField({ label, value, color = 'text-foreground' }: { label: string; value: string; color?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className={`text-sm font-semibold ${color} leading-snug`}>{value}</p>
        </div>
    );
}

function RiskBar({ label, value, icon: Icon, color = 'bg-primary' }: { label: string; value: number; icon?: any; color?: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                    {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
                    <span className="font-medium text-muted-foreground">{label}</span>
                </div>
                <span className="font-bold text-foreground">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}
