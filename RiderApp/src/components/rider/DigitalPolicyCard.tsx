import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { type InsurancePolicy } from '../../data/mock';
import { useNotificationStore, SMS_SERVICE } from '../../store/notificationStore';

interface PolicyCardProps {
    policy: InsurancePolicy;
}

export function DigitalPolicyCard({ policy }: PolicyCardProps) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotificationStore();

    const handleSubscribe = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubscribed(true);
            
            // 1. Dispatch in-app notification
            addNotification({
                title: 'Plan Activated',
                message: `GigSync Income Protection is now active.`,
                type: 'plan'
            });

            // 2. Dispatch Mock SMS
            SMS_SERVICE.sendPlanSubscriptionSMS(policy.weeklyPremium);
            
        }, 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 shadow-sm flex flex-col justify-between"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {isSubscribed ? (
                            <>
                                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                <span className="text-[10px] font-bold text-success uppercase tracking-widest">Shield Status: Active</span>
                            </>
                        ) : (
                            <>
                                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shield Status: Inactive</span>
                            </>
                        )}
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{policy.coverageType}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Weekly Premium: <span className="font-bold text-foreground">₹{policy.weeklyPremium}</span></p>
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isSubscribed ? 'bg-success/10 text-success' : 'bg-muted/20 text-muted-foreground'}`}>
                    <ShieldCheck className="h-6 w-6" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isSubscribed && (
                    <motion.button
                        key="subscribe-btn"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="w-full py-3 mt-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe to Protection Plan'}
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
