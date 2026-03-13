import { motion } from 'framer-motion';
import { ArrowUpRight, History, CreditCard } from 'lucide-react';
import { type RiderPayout } from '../../data/mock';

interface PayoutSectionProps {
    payouts: RiderPayout[];
}

export function PayoutSection({ payouts }: PayoutSectionProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-success" />
                Payout History
            </h3>

            <div className="space-y-3">
                {payouts.map((payout, idx) => (
                    <motion.div
                        key={payout.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="glass-card group flex items-center justify-between p-5 rounded-[2rem] border border-border/40 hover:border-success/30 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success transition-transform group-hover:scale-110">
                                <ArrowUpRight className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-foreground">{payout.reason}</p>
                                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                                    {payout.date} · {payout.method}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-success">+₹{payout.amount}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-success/10 text-[9px] font-black uppercase text-success tracking-widest">
                                {payout.status}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {payouts.length === 0 && (
                    <div className="py-12 text-center opacity-30">
                        <History className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">No transactions yet</p>
                    </div>
                )}
            </div>

            {payouts.length > 0 && (
                <button className="w-full py-4 rounded-[1.5rem] bg-secondary/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                    Download March Statement
                </button>
            )}
        </div>
    );
}
