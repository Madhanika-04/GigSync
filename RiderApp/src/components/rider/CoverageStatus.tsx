import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface CoverageStatusProps {
    isActive: boolean;
}

export function CoverageStatus({ isActive }: CoverageStatusProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl p-6 shadow-sm border ${
                isActive 
                    ? 'bg-success/10 border-success/20' 
                    : 'bg-warning/10 border-warning/20'
            }`}
        >
            <div className="flex items-start gap-5">
                <div className={`mt-1 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    isActive 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                }`}>
                    {isActive ? (
                        <ShieldCheck className="h-7 w-7" />
                    ) : (
                        <ShieldAlert className="h-7 w-7" />
                    )}
                </div>
                
                <div className="flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Protection Status
                    </p>
                    <h2 className={`text-xl font-black mb-1.5 ${
                        isActive ? 'text-success' : 'text-warning'
                    }`}>
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </h2>
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed max-w-sm">
                        {isActive 
                            ? 'Your income protection shield is actively monitoring disruptions in your delivery zone.'
                            : 'Your income protection shield is currently paused. Please review your active policies.'
                        }
                    </p>
                </div>
            </div>
            
            {/* Background Decoration */}
            <div className={`absolute -bottom-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-20 pointer-events-none ${
                isActive ? 'bg-success' : 'bg-warning'
            }`} />
        </motion.div>
    );
}
