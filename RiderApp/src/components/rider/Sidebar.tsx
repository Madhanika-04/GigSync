import { motion } from 'framer-motion';
import { Home, Search, Zap, User, Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';
import { type ViewType } from './BottomNav';

interface SidebarProps {
    activeView: ViewType;
    setView: (view: ViewType) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    riderName: string;
    riderPlatform: string;
}

const navItems: { id: ViewType; icon: typeof Home; label: string }[] = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Explore' },
    { id: 'claims', icon: Zap, label: 'Claims' },
    { id: 'profile', icon: User, label: 'Profile' },
];

export function Sidebar({ activeView, setView, theme, toggleTheme, riderName, riderPlatform }: SidebarProps) {
    return (
        <aside className="hidden lg:flex flex-col h-screen w-[240px] fixed top-0 left-0 z-50 bg-card border-r border-border/40">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 h-20 border-b border-border/40 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                    <span className="text-xs text-primary-foreground font-black">GS</span>
                </div>
                <span className="text-lg font-black tracking-tighter text-foreground">GigSync</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Main Menu
                </p>
                {navItems.map(({ id, icon: Icon, label }) => {
                    const isActive = activeView === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setView(id)}
                            className={clsx(
                                'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                                isActive
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-pill"
                                    className="absolute inset-0 rounded-xl bg-primary/10"
                                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                                />
                            )}
                            <Icon className={clsx('h-4 w-4 relative z-10 shrink-0', isActive ? 'text-primary' : '')} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="relative z-10">{label}</span>
                            {isActive && (
                                <span className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="px-4 py-5 border-t border-border/40 space-y-3 shrink-0">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                >
                    {theme === 'light'
                        ? <Moon className="h-4 w-4 shrink-0" />
                        : <Sun className="h-4 w-4 shrink-0" />
                    }
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>

                {/* Rider mini-card */}
                <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/60 transition-all"
                    onClick={() => setView('profile')}
                >
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-muted border border-border/40 shrink-0">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${riderName}`}
                            alt={riderName}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{riderName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{riderPlatform} Rider</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
