import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudRain, Thermometer, Wind, AlertTriangle,
    Activity, ShieldAlert, Calendar, MapPin, Clock,
    Users, Zap, Loader2
} from 'lucide-react';
import { useNotificationStore, SMS_SERVICE } from '../../store/notificationStore';

/* ─── Types ─── */
type DisruptionType = 'Heavy Rain' | 'Extreme Heat' | 'Air Pollution' | 'Zone Closure';

interface DisruptionData {
    id: DisruptionType;
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    timing: string;
    location: string;
    start?: string;
    end?: string;
    duration?: string;
    metricLabel: string;
    metricValue: string;
    probability: number;
    impact: string;
    ridersAffected?: number;
    outdoorRisk?: string;
}

/* ─── Data ─── */
const DISRUPTIONS: DisruptionData[] = [
    {
        id: 'Heavy Rain',
        icon: <CloudRain className="h-5 w-5" />,
        color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30',
        riskLevel: 'High',
        timing: 'Expected Today',
        location: 'Chennai South',
        start: '5:30 PM',
        end: '8:15 PM',
        metricLabel: 'Rainfall Prediction',
        metricValue: '85 mm',
        probability: 42,
        impact: 'Moderate to Severe',
        ridersAffected: 12,
    },
    {
        id: 'Extreme Heat',
        icon: <Thermometer className="h-5 w-5" />,
        color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30',
        riskLevel: 'Moderate',
        timing: 'Tomorrow Afternoon',
        location: 'All Zones',
        start: '12:00 PM',
        end: '4:00 PM',
        metricLabel: 'Peak Temperature',
        metricValue: '41°C',
        probability: 65,
        impact: 'Slower speeds, frequent breaks required',
    },
    {
        id: 'Air Pollution',
        icon: <Wind className="h-5 w-5" />,
        color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30',
        riskLevel: 'Severe',
        timing: 'Expected Tonight',
        location: 'Chennai Central',
        duration: '6 hours',
        metricLabel: 'AQI Level',
        metricValue: '340',
        probability: 88,
        impact: 'Slower delivery speed and rider fatigue',
        outdoorRisk: 'High',
    },
    {
        id: 'Zone Closure',
        icon: <AlertTriangle className="h-5 w-5" />,
        color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30',
        riskLevel: 'Low',
        timing: 'No current alerts',
        location: 'None',
        metricLabel: 'Status',
        metricValue: 'Clear',
        probability: 5,
        impact: 'Normal Operations',
    },
];

const FORECAST = [
    { day: 'Mon', risk: 'Moderate Rain Risk', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { day: 'Tue', risk: 'High Heat Risk', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { day: 'Wed', risk: 'Normal', color: 'text-success', bg: 'bg-success/10' },
    { day: 'Thu', risk: 'Pollution Risk', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { day: 'Fri', risk: 'Low Risk', color: 'text-success', bg: 'bg-success/10' },
];

const riskStyles = {
    'Low': 'text-success bg-success/15 border border-success/20',
    'Moderate': 'text-warning bg-warning/15 border border-warning/20',
    'High': 'text-blue-400 bg-blue-500/15 border border-blue-500/20',
    'Severe': 'text-danger bg-danger/15 border border-danger/20',
};

/* ─── Page ─── */
export function ExplorePage() {
    const [selectedId, setSelectedId] = useState<DisruptionType>('Heavy Rain');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulatedItems, setSimulatedItems] = useState<string[]>([]);
    const { addNotification } = useNotificationStore();

    const selected = DISRUPTIONS.find(d => d.id === selectedId)!;

    const handleSimulateClaim = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            setSimulatedItems(prev => [...prev, selected.id]);

            // 1. Dispatch in-app notification
            const payout = selected.riskLevel === 'Severe' ? 750 : 520;
            addNotification({
                title: 'Claim Auto-Triggered',
                message: `Due to ${selected.id} in ${selected.location}`,
                type: 'claim'
            });

            // 2. Dispatch Mock SMS
            SMS_SERVICE.sendClaimTriggerSMS(selected.id, selected.location, payout);
        }, 1500);
    };

    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6 pb-6 lg:pb-0">

            {/* ─── Top Header ─── */}
            <motion.div variants={item}>
                <h1 className="text-2xl font-bold text-foreground">Explore</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Risk insights and disruption predictions for your delivery zone</p>
            </motion.div>

            {/* ─── Section 1: Today's Risk Insight ─── */}
            <motion.div
                variants={item}
                className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-card to-blue-900/10 border border-blue-500/20 rounded-2xl p-6 shadow-sm shadow-blue-900/10"
            >
                <div className="absolute -top-12 -right-8 opacity-[0.07] pointer-events-none">
                    <CloudRain className="h-48 w-48 text-blue-400" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-4 w-4 text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today's Risk Insight</span>
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Heavy Rain Expected</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3.5 w-3.5 text-blue-400" /> Chennai South Zone
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Risk Level</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-danger bg-danger/10 border border-danger/20">
                                High
                            </span>
                        </div>
                        <div className="h-10 w-px bg-border/50" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Probability</p>
                            <p className="text-xl font-black text-blue-400">42<span className="text-sm text-blue-400/70">%</span></p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ─── Section 2: Clickable Disruption Cards ─── */}
            <motion.div variants={item} className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-bold text-foreground">Disruption Predictions</h2>
                </div>

                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 snap-x snap-mandatory hide-scrollbar">
                    {DISRUPTIONS.map(d => {
                        const isSelected = selectedId === d.id;
                        return (
                            <motion.button
                                key={d.id}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedId(d.id)}
                                className={`relative w-[260px] sm:w-auto shrink-0 snap-center text-left bg-card rounded-2xl p-5 transition-all duration-300 border ${isSelected
                                    ? `border-primary shadow-md shadow-primary/10 ring-1 ring-primary/50`
                                    : `border-border/50 hover:border-border`
                                    }`}
                            >
                                {/* Selection Indicator */}
                                {isSelected && (
                                    <motion.div layoutId="active-indicator" className="absolute -top-px -left-px -right-px h-1 bg-primary rounded-t-2xl z-20" />
                                )}

                                <div className="flex items-start justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-xl ${d.bg} ${d.color} flex items-center justify-center shrink-0`}>
                                        {d.icon}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${riskStyles[d.riskLevel]}`}>
                                        {d.riskLevel} Risk
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-foreground">{d.id}</h3>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" /> {d.timing}
                                </p>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ─── Section 3: Detailed Insight Panel ─── */}
            <motion.div variants={item} className="relative min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`bg-card border ${selected.border} rounded-3xl overflow-hidden shadow-sm`}
                    >
                        {/* Header Area */}
                        <div className={`p-6 border-b border-border/30 bg-gradient-to-r ${selected.bg} to-transparent flex flex-wrap gap-4 items-center justify-between`}>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`${selected.color}`}>{selected.icon}</div>
                                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                        {selected.id} Details
                                    </h2>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5" /> Location: <span className="text-foreground font-medium">{selected.location}</span>
                                </p>
                            </div>
                            
                            {(selected.riskLevel === 'High' || selected.riskLevel === 'Severe') && (
                                <button
                                    onClick={handleSimulateClaim}
                                    disabled={isSimulating || simulatedItems.includes(selected.id)}
                                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSimulating ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Simulating Trigger...</>
                                    ) : simulatedItems.includes(selected.id) ? (
                                        'Event Triggered'
                                    ) : (
                                        <><Zap className="w-4 h-4" /> Simulate Claim Trigger</>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Timeline Block */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expected Timeline</h4>

                                    {selected.start && selected.end ? (
                                        <div className="flex flex-col gap-3 relative pl-3 border-l-2 border-border/50">
                                            <div className="relative">
                                                <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-border" />
                                                <p className="text-xs text-muted-foreground mb-0.5">Start Time</p>
                                                <p className="text-sm font-semibold text-foreground">{selected.start}</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                                                <p className="text-xs text-muted-foreground mb-0.5">End Time</p>
                                                <p className="text-sm font-semibold text-foreground">{selected.end}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border/50">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Expected Duration</p>
                                                <p className="text-sm font-semibold text-foreground">{selected.duration || 'N/A'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Prediction Block */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Prediction Data</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                                            <p className="text-[10px] font-bold text-muted-foreground/80 mb-1">{selected.metricLabel}</p>
                                            <p className={`text-base font-bold ${selected.color}`}>{selected.metricValue}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                                            <p className="text-[10px] font-bold text-muted-foreground/80 mb-1">Probability</p>
                                            <p className="text-base font-bold text-foreground">{selected.probability}%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                                        <span className="text-xs font-semibold text-muted-foreground">Severity Level</span>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${riskStyles[selected.riskLevel]}`}>
                                            {selected.riskLevel}
                                        </span>
                                    </div>
                                </div>

                                {/* Impact Block */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Forecasted Impact</h4>

                                    <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                                        <p className="text-[10px] font-bold text-muted-foreground/80 mb-1">Expected Delivery Impact</p>
                                        <p className="text-sm font-medium text-foreground leading-snug">{selected.impact}</p>
                                    </div>

                                    {(selected.ridersAffected !== undefined || selected.outdoorRisk) && (
                                        <div className="flex items-center gap-3">
                                            {selected.ridersAffected !== undefined && (
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <Users className="h-4 w-4" /> Est. Affected: <span className="text-foreground">{selected.ridersAffected}</span>
                                                </div>
                                            )}
                                            {selected.outdoorRisk && (
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <ShieldAlert className="h-4 w-4" /> Outdoor Risk: <span className={`font-bold ${selected.outdoorRisk === 'High' ? 'text-danger' : 'text-warning'
                                                        }`}>{selected.outdoorRisk}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* ─── Section 4: Mini Forecast (Optional) ─── */}
            <motion.div variants={item} className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-bold text-foreground">Upcoming Week Outlook</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {FORECAST.map((d, i) => (
                        <div key={i} className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-start gap-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{d.day}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${d.bg.replace('/10', '')}`} />
                                <p className={`text-xs font-semibold ${d.color}`}>{d.risk}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

        </motion.div>
    );
}

