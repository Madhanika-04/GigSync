import { MapPin, Wallet, HardHat } from 'lucide-react';
import { type RiderProfile } from '../../data/mock';

interface ProfileCardProps {
    rider: RiderProfile;
}

export function ProfileCard({ rider }: ProfileCardProps) {
    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

            <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border-2 border-border">
                    <img
                        src={`https://i.pravatar.cc/150?u=${rider.id}`}
                        alt={rider.name}
                        className="w-full h-full rounded-xl object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">{rider.name}</h2>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">ID: {rider.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                        <HardHat className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Platform</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{rider.platform}</p>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Zone</span>
                    </div>
                    <p className="text-sm font-bold text-foreground truncate">{rider.zone}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Avg Daily Income</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">₹{rider.avgDailyIncome}</p>
                </div>
            </div>
        </div>
    );
}
