import { TrendingDown, Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface PremiumCardProps {
    premium: number;
    riskLevel: 'Low' | 'Medium' | 'High';
}

export function PremiumCard({ premium, riskLevel }: PremiumCardProps) {
    const riskColors = {
        Low: 'text-success bg-success/10 border-success/20',
        Medium: 'text-warning bg-warning/10 border-warning/20',
        High: 'text-danger bg-danger/10 border-danger/20',
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Weekly Premium</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-foreground">₹{premium}</span>
                        <span className="text-sm font-medium text-muted-foreground">/ week</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-secondary/30 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Next Payment</p>
                        <p className="text-xs font-bold">Monday</p>
                    </div>
                </div>
                <div className={clsx("p-3 rounded-2xl border flex items-center gap-3", riskColors[riskLevel])}>
                    <AlertCircle className="w-4 h-4" />
                    <div>
                        <p className="text-[9px] font-bold opacity-70 uppercase">Risk Level</p>
                        <p className="text-xs font-bold">{riskLevel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
