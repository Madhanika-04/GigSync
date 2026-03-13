import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Sun, Moon, CloudRain, Zap, IndianRupee, CheckCircle, CheckCheck, ShieldCheck, FileText } from 'lucide-react';
import { type ViewType } from './BottomNav';
import { useNotificationStore, type Notification } from '../../store/notificationStore';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setView: (view: ViewType) => void;
}

export function RiderHeader({ theme, toggleTheme, setView }: HeaderProps) {
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const { notifications, markAsRead, markAllRead } = useNotificationStore();
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifs(false);
            }
        };
        if (showNotifs) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifs]);

    const getIconConfig = (type: Notification['type']) => {
        switch (type) {
            case 'alert': return { icon: <CloudRain className="w-4 h-4 text-warning" />, bg: 'bg-warning/10' };
            case 'claim': return { icon: <Zap className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-500/10' };
            case 'payout': return { icon: <IndianRupee className="w-4 h-4 text-success" />, bg: 'bg-success/10' };
            case 'review': return { icon: <CheckCircle className="w-4 h-4 text-primary" />, bg: 'bg-primary/10' };
            case 'plan': return { icon: <FileText className="w-4 h-4 text-indigo-400" />, bg: 'bg-indigo-500/10' };
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full glass border-b border-border/40 px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo — only on mobile (sidebar shows it on desktop) */}
            <div
                className="lg:hidden flex items-center gap-3 cursor-pointer group"
                onClick={() => setView('dashboard')}
            >
                <div className="w-9 h-9 rounded-[1.25rem] bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                    <span className="text-white font-black text-xs">GS</span>
                </div>
                <h1 className="text-lg font-black tracking-tighter text-foreground">GigSync</h1>
            </div>

            {/* Desktop: page title placeholder area */}
            <div className="hidden lg:block">
                <span className="text-sm font-semibold text-muted-foreground">Rider Dashboard</span>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
                {/* Theme toggle — mobile only (sidebar has this on desktop) */}
                <button
                    onClick={toggleTheme}
                    className="lg:hidden p-2.5 rounded-xl hover:bg-secondary transition-all text-muted-foreground hover:text-foreground active:scale-90"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="relative p-2.5 rounded-xl hover:bg-secondary transition-all group active:scale-90"
                    >
                        <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full ring-2 ring-background" />
                        )}
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {showNotifs && (
                            <motion.div
                                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right flex flex-col"
                            >
                                <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between bg-muted/10">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllRead}
                                            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                        >
                                            <CheckCheck className="w-3.5 h-3.5" />
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                                <ShieldCheck className="w-6 h-6 text-primary" />
                                            </div>
                                            <p className="text-sm font-semibold text-foreground mb-1">No new updates.</p>
                                            <p className="text-xs text-muted-foreground max-w-[200px]">Your shield is actively monitoring disruptions.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <AnimatePresence>
                                                {notifications.map((n, i) => {
                                                    const { icon, bg } = getIconConfig(n.type);
                                                    return (
                                                        <motion.div
                                                            key={n.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            onClick={() => markAsRead(n.id)}
                                                            className={`px-5 py-4 border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer flex gap-4 ${!n.read ? 'bg-primary/[0.02]' : ''}`}
                                                        >
                                                            <div className={`mt-0.5 w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                                                                {icon}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                                    <span className={`text-sm tracking-tight ${!n.read ? 'font-bold text-foreground' : 'font-semibold text-foreground/80'}`}>
                                                                        {n.title}
                                                                    </span>
                                                                    <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap mt-0.5">{n.time}</span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">{n.message}</p>
                                                            </div>
                                                            {!n.read && (
                                                                <div className="flex items-center h-full">
                                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile avatar — mobile only (sidebar rider card handles this on desktop) */}
                <button
                    onClick={() => setView('profile')}
                    className="lg:hidden w-9 h-9 rounded-xl bg-secondary border border-border/40 flex items-center justify-center overflow-hidden transition-all hover:scale-110 active:scale-90"
                >
                    <User className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>
        </header>
    );
}
