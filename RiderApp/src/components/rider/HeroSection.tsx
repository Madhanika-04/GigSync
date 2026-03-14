import { motion } from 'framer-motion';
import { ShieldCheck, Wallet } from 'lucide-react';
import { type InsurancePolicy, type RiderProfile } from '../../data/mock';

interface HeroSectionProps {
    rider: RiderProfile;
    policy: InsurancePolicy;
    totalPayouts: number;
}

export function HeroSection({ rider, policy, totalPayouts }: HeroSectionProps) {
    const container = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="relative"
        >
            {/* Main Hero Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 pb-12 sm:pb-14 text-white shadow-2xl shadow-primary/20">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <motion.p variants={item} className="text-xs font-bold uppercase tracking-widest text-white/70">
                            Welcome Back
                        </motion.p>
                        <motion.h1 variants={item} className="mt-1 text-2xl font-black tracking-tight">
                            {rider.name} <span className="animate-pulse">👋</span>
                        </motion.h1>
                        <motion.div variants={item} className="mt-2 flex items-center gap-3">
                            <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase backdrop-blur-md">
                                {rider.platform}
                            </span>
                            <span className="text-xs font-bold text-white/60">{rider.zone}</span>
                        </motion.div>
                    </div>
                    <motion.div
                        variants={item}
                        whileHover={{ scale: 1.05 }}
                        className="h-20 w-20 rounded-[2rem] border-4 border-white/20 bg-white/10 p-1 backdrop-blur-xl shadow-inner shrink-0"
                    >
                        <img
                            src={`https://i.pravatar.cc/150?u=${rider.id}`}
                            alt={rider.name}
                            className="h-full w-full rounded-[1.6rem] object-cover"
                        />
                    </motion.div>
                </div>

                <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-4 relative z-10">
                    <motion.div variants={item} className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-white/60 tracking-wider">Avg Daily Income</span>
                        <span className="text-xl font-black">₹{rider.avgDailyIncome}</span>
                    </motion.div>
                    <motion.div variants={item} className="flex flex-col text-right">
                        <span className="text-[10px] font-black uppercase text-white/60 tracking-wider">Risk Zone</span>
                        <span className="text-sm font-bold">{rider.city}</span>
                    </motion.div>
                </div>
            </div>

            {/* Floating Mini Stats */}
            <div className="-mt-6 sm:-mt-8 grid grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-4 relative z-20">
                <motion.div
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="glass-premium rounded-3xl p-4 sm:p-5 shadow-xl transition-all"
                >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Active Policy</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{policy.coverageType}</p>
                </motion.div>

                <motion.div
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="glass-premium rounded-3xl p-4 sm:p-5 shadow-xl transition-all"
                >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-success/20 text-success">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Total Payouts</p>
                    <p className="text-xs sm:text-sm font-bold text-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">₹{totalPayouts.toLocaleString('en-IN')} Received</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
