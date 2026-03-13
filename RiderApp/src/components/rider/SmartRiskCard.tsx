import { motion } from 'framer-motion';
import { Sparkles, CloudRain, Wind, Thermometer, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface SmartRiskCardProps {
    level: 'Low' | 'Medium' | 'High';
}

export function SmartRiskCard({ level }: SmartRiskCardProps) {
    const riskConfig = {
        Low: { color: 'text-success', bg: 'bg-success', label: 'OPTIMAL', score: 25 },
        Medium: { color: 'text-warning', bg: 'bg-warning', label: 'MODERATE', score: 65 },
        High: { color: 'text-danger', bg: 'bg-danger', label: 'CRITICAL', score: 92 },
    };

    const current = riskConfig[level];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-[2.5rem] p-6"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">AI Risk Engine</h3>
                        <p className="text-[10px] font-bold text-muted-foreground">Self-monitoring active</p>
                    </div>
                </div>
                <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", current.color, current.bg + "/10", current.bg.replace('bg-', 'border-').concat('/20'))}>
                    {current.label}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Radial Indicator */}
                <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="h-full w-full rotate-[-90deg]">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-secondary"
                        />
                        <motion.circle
                            initial={{ strokeDasharray: "0 365" }}
                            animate={{ strokeDasharray: `${(current.score / 100) * 365} 365` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="64"
                            cy="64"
                            r="58"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeLinecap="round"
                            className={current.color}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-black text-foreground">{current.score}</span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Score</span>
                    </div>
                </div>

                {/* Sub-risks */}
                <div className="flex-1 w-full space-y-5">
                    {[
                        { icon: CloudRain, label: 'Weather', val: 80, color: 'bg-primary' },
                        { icon: Wind, label: 'Pollution', val: 40, color: 'bg-warning' },
                        { icon: Thermometer, label: 'Thermal', val: 20, color: 'bg-success' },
                    ].map((risk, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <risk.icon className="h-3 w-3" />
                                    {risk.label}
                                </span>
                                <span>{risk.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${risk.val}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={clsx("h-full rounded-full", risk.color)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex gap-4 p-4 rounded-[1.5rem] bg-primary/5 border border-primary/10"
            >
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed text-muted-foreground italic">
                    "Elevated weather risk detected in Chennai South. Premium auto-adjusted. Income protection fully active for your current shift."
                </p>
            </motion.div>
        </motion.div>
    );
}
