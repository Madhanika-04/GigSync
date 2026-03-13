import { Zap, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { type RiderClaim, type ClaimStatus } from '../../data/mock';

const statusConfig: Record<ClaimStatus, { icon: any; color: string; label: string }> = {
    Processing: { icon: Clock, color: 'text-warning bg-warning/10 border-warning/20', label: 'Processing' },
    Approved: { icon: CheckCircle2, color: 'text-success bg-success/10 border-success/20', label: 'Approved' },
    Rejected: { icon: XCircle, color: 'text-danger bg-danger/10 border-danger/20', label: 'Rejected' },
    Completed: { icon: CheckCircle2, color: 'text-primary bg-primary/10 border-primary/20', label: 'Payout Sent' }
};

interface ClaimsFeedProps {
    claims: RiderClaim[];
}

export function ClaimsFeed({ claims }: ClaimsFeedProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Triggered Claims
            </h3>

            <div className="space-y-3">
                {claims.map((claim) => {
                    const config = statusConfig[claim.status];
                    const StatusIcon = config.icon;

                    return (
                        <div key={claim.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between group hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{claim.type}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">{claim.date}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold ${config.color}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {config.label}
                                </div>
                                <span className="text-sm font-bold text-foreground">₹{claim.payout}</span>
                            </div>
                        </div>
                    );
                })}

                {claims.length === 0 && (
                    <div className="p-8 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-center opacity-50">
                        <Zap className="w-8 h-8 mb-2" />
                        <p className="text-sm font-medium">No claims triggered in the last 30 days.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
