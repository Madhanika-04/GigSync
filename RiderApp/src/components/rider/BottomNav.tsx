import { motion } from 'framer-motion';
import { Home, Zap, User, Search } from 'lucide-react';
import { clsx } from 'clsx';

export type ViewType = 'dashboard' | 'claims' | 'profile' | 'search';

interface BottomNavProps {
    activeView: ViewType;
    setView: (view: ViewType) => void;
}

export function BottomNav({ activeView, setView }: BottomNavProps) {
    const tabs: { id: ViewType; icon: any; label: string }[] = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'search', icon: Search, label: 'Explore' },
        { id: 'claims', icon: Zap, label: 'Claims' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] px-6 pb-8 pointer-events-none lg:hidden">
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="max-w-md mx-auto h-20 glass-premium rounded-[2.5rem] flex items-center justify-around px-4 shadow-2xl pointer-events-auto border-t border-white/10"
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeView === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id)}
                            className="relative flex flex-col items-center justify-center p-2 group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-2xl bg-primary/10"
                                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                />
                            )}
                            <div className={clsx(
                                "relative z-10 transition-all duration-300",
                                isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={clsx(
                                "text-[10px] font-black uppercase tracking-widest mt-1 transition-opacity duration-300",
                                isActive ? "opacity-100 text-primary" : "opacity-0"
                            )}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </motion.div>
        </div>
    );
}
