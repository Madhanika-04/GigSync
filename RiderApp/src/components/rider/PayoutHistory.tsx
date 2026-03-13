import { ArrowUpRight, History } from 'lucide-react';
import { type RiderPayout } from '../../data/mock';

interface PayoutHistoryProps {
    payouts: RiderPayout[];
}

export function PayoutHistory({ payouts }: PayoutHistoryProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Payout History
            </h3>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-border">
                    {payouts.map((payout) => (
                        <div key={payout.id} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{payout.reason}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">
                                        {payout.date} • {payout.method}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-success">+₹{payout.amount}</p>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{payout.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {payouts.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground italic text-sm">
                        No transactions found.
                    </div>
                )}

                {payouts.length > 0 && (
                    <button className="w-full py-3 text-[11px] font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border">
                        Download Statement
                    </button>
                )}
            </div>
        </div>
    );
}
