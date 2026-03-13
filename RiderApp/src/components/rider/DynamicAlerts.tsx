import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Thermometer, Wind, XCircle, Info } from 'lucide-react';
import { type RiderAlert, type DisruptionType } from '../../data/mock';

const alertIcons: Record<DisruptionType, any> = {
    'Heavy Rain': CloudRain,
    'Extreme Heat': Thermometer,
    'Pollution': Wind,
    'Zone Closure': XCircle,
    'Fraud Alert': AlertTriangle,
};

const alertColors: Record<DisruptionType, { border: string; bg: string; text: string; shadow: string }> = {
    'Heavy Rain': { border: 'border-blue-500/30', bg: 'bg-blue-500/15', text: 'text-blue-400', shadow: 'shadow-blue-500/10' },
    'Extreme Heat': { border: 'border-orange-500/30', bg: 'bg-orange-500/15', text: 'text-orange-400', shadow: 'shadow-orange-500/10' },
    'Pollution': { border: 'border-purple-500/30', bg: 'bg-purple-500/15', text: 'text-purple-400', shadow: 'shadow-purple-500/10' },
    'Zone Closure': { border: 'border-red-500/30', bg: 'bg-red-500/15', text: 'text-red-400', shadow: 'shadow-red-500/10' },
    'Fraud Alert': { border: 'border-amber-500/30', bg: 'bg-amber-500/15', text: 'text-amber-400', shadow: 'shadow-amber-500/10' },
};

interface AlertsListProps {
    alerts: RiderAlert[];
}

export function DynamicAlerts({ alerts }: AlertsListProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
                    Live Disruptions
                </h3>
            </div>

            <div className="space-y-4">
                {alerts.map((alert, idx) => {
                    const Icon = alertIcons[alert.type] || Info;
                    const colors = alertColors[alert.type];

                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`group relative p-4 rounded-[2rem] border-l-[6px] ${colors.border} ${colors.bg} ${colors.shadow} border-y border-r border-border/40 backdrop-blur-sm transition-all hover:scale-[1.02]`}
                        >
                            <div className="flex gap-4">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colors.text} bg-white dark:bg-black/20 shadow-sm transition-transform group-hover:rotate-12`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-black uppercase tracking-wider ${colors.text}`}>{alert.type}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground">{alert.timestamp}</span>
                                    </div>
                                    <p className="text-xs font-bold text-foreground/80 leading-relaxed">
                                        {alert.description}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{alert.zone} · High Severity</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {alerts.length === 0 && (
                    <div className="py-8 flex flex-col items-center justify-center bg-card border border-border/50 rounded-3xl text-center px-6 shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
                            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        </div>
                        <p className="text-sm font-bold text-foreground mb-1">Clear skies in Chennai South.</p>
                        <p className="text-xs text-muted-foreground">Your protection shield is active and monitoring conditions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
