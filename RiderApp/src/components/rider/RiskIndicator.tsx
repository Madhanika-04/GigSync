import { Info, Gauge } from 'lucide-react';

interface RiskIndicatorProps {
    level: 'Low' | 'Medium' | 'High';
}

export function RiskIndicator({ level }: RiskIndicatorProps) {
    const config = {
        Low: { color: 'text-success', bg: 'bg-success', label: 'Low Risk', text: 'Operational zones are stable. Minimal disruption predicted.' },
        Medium: { color: 'text-warning', bg: 'bg-warning', label: 'Medium Risk', text: 'Possible rain or heat spikes predicted in your delivery zone.' },
        High: { color: 'text-danger', bg: 'bg-danger', label: 'High Risk', text: 'Significant disruption detected. Income protection is active.' }
    };

    const current = config[level];

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${current.bg}/10 ${current.color}`}>
                    <Gauge className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-foreground">Risk Indicator</h3>
                    <p className={`text-[10px] font-bold uppercase ${current.color}`}>{current.label}</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Visual Bar */}
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                    <div className={clsx("h-full transition-all duration-1000", level === 'Low' ? 'w-1/3 bg-success' : level === 'Medium' ? 'w-2/3 bg-warning' : 'w-full bg-danger')} />
                </div>

                <div className="flex gap-3 p-4 rounded-2xl bg-secondary/50 border border-border/50">
                    <Info className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-[11px] font-medium leading-relaxed text-muted-foreground italic">
                        "{current.text}"
                    </p>
                </div>
            </div>
        </div>
    );
}

// Support for clsx
function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
