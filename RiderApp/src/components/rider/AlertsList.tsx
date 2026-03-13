import { AlertTriangle, CloudRain, Thermometer, Wind, XCircle, Info } from 'lucide-react';
import { type RiderAlert, type DisruptionType } from '../../data/mock';

const alertIcons: Record<DisruptionType, any> = {
    'Heavy Rain': CloudRain,
    'Extreme Heat': Thermometer,
    'Pollution': Wind,
    'Zone Closure': XCircle,
    'Fraud Alert': AlertTriangle,
};

const alertColors: Record<DisruptionType, string> = {
    'Heavy Rain': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'Extreme Heat': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'Pollution': 'text-gray-500 bg-gray-500/10 border-gray-500/20',
    'Zone Closure': 'text-red-500 bg-red-500/10 border-red-500/20',
    'Fraud Alert': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
};

interface AlertsListProps {
    alerts: RiderAlert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Disruption Alerts
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground uppercase bg-secondary px-2 py-0.5 rounded-full">
                    {alerts.length} Active
                </span>
            </div>

            <div className="space-y-3">
                {alerts.map((alert) => {
                    const Icon = alertIcons[alert.type] || Info;
                    const colorClasses = alertColors[alert.type] || 'text-primary bg-primary/10 border-primary/20';

                    return (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-2xl border flex gap-4 transition-all hover:translate-x-1 ${colorClasses}`}
                        >
                            <div className="p-2 rounded-xl bg-white/20 h-fit">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold truncate">{alert.type}</span>
                                    <span className="text-[10px] opacity-70 font-medium whitespace-nowrap">{alert.timestamp}</span>
                                </div>
                                <p className="text-xs opacity-80 leading-relaxed font-medium">
                                    {alert.description}
                                </p>
                                <p className="text-[9px] mt-2 font-bold uppercase tracking-wider opacity-60">
                                    Affected: {alert.zone}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {alerts.length === 0 && (
                    <div className="p-8 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-center opacity-50">
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <p className="text-sm font-medium">No active disruptions in your zone.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
