import { motion } from 'framer-motion';
import { Zap, Clock, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { type RiderClaim, type ClaimStatus } from '../../data/mock';

const statusConfig: Record<ClaimStatus, { icon: any; color: string; label: string; bg: string }> = {
    Processing: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Verifying Impact' },
    Approved: { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Payout Approved' },
    Rejected: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', label: 'No Impact Found' },
    Completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Payment Sent' }
};

interface ClaimStatusCardProps {
    claims: RiderClaim[];
}

export function ClaimStatusCard({ claims }: ClaimStatusCardProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Auto-Triggered Claims
            </h3>

            <div className="space-y-4">
                {claims.map((claim, idx) => {
                    const config = statusConfig[claim.status];
                    const StatusIcon = config.icon;

                    return (
                        <motion.div
                            key={claim.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card relative overflow-hidden rounded-[2.5rem] border border-border/40 p-6 shadow-2xl group hover:border-primary/40 transition-all"
                        >
                            {/* Accent Glow */}
                            <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -ml-12 -mt-12 group-hover:bg-primary/20 transition-all" />

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
                                        <Zap className="h-7 w-7" />
                                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-foreground">{claim.type}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{claim.date}</span>
                                            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                            <span className="text-[10px] font-bold text-primary uppercase">ID: {claim.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${config.color} ${config.bg} border-current/20`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {config.label}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Estimated Payout</span>
                                        <span className="text-2xl font-black text-foreground">₹{claim.payout}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {claims.length === 0 && (
                    <div className="py-16 text-center rounded-[2.5rem] bg-secondary/20 border border-dashed border-border/50">
                        <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/50">AI is monitoring your activity</p>
                    </div>
                )}
            </div>
        </div>
    );
}
