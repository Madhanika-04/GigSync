import { ShieldCheck, ArrowRight } from 'lucide-react';
import { type InsurancePolicy } from '../../data/mock';

interface PolicyCardProps {
    policy: InsurancePolicy;
}

export function PolicyCard({ policy }: PolicyCardProps) {
    return (
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Policy {policy.status}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{policy.coverageType}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="mt-8 space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Weekly Premium</p>
                        <p className="text-lg font-bold text-foreground">₹{policy.weeklyPremium}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase text-right">Coverage Limit</p>
                        <p className="text-lg font-bold text-foreground">Up to ₹{policy.coverageLimit}/day</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Valid Until</span>
                            <span className="text-xs font-bold">{policy.expiryDate}</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
                        View Details <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
    );
}
