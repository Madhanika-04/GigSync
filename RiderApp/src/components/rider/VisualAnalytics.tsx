import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell, YAxis } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { WEEKLY_PROTECTION_DATA } from '../../data/mock';

export function VisualAnalytics() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col min-h-[380px]"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-success/10 text-success">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-foreground leading-none">Protection Overview</h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">Weekly Claims Analytics</p>
                    </div>
                </div>
            </div>

            {/* Added pb-6 to give the chart clear breathing room before the message card */}
            <div className="flex-1 w-full min-h-[220px] relative pb-6">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <BarChart data={WEEKLY_PROTECTION_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 800, fill: 'hsl(var(--muted-foreground))' }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4, radius: 12 }}
                            contentStyle={{
                                background: 'hsl(var(--card))',
                                borderRadius: '16px',
                                border: '1px solid hsl(var(--border) / 0.5)',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                padding: '12px 16px'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: '900', color: 'hsl(var(--primary))' }}
                            labelStyle={{ fontSize: '10px', fontWeight: '700', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                            formatter={(value: any) => [`₹${value}`, 'Payout']}
                        />
                        <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={24}>
                            {WEEKLY_PROTECTION_DATA.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.value > 0 ? 'url(#barGradient)' : 'hsl(var(--secondary))'}
                                    className="transition-all hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Updated margin on message card (mt-4 -> mt-6), and layout spacing */}
            <div className="mt-4 sm:mt-6 mb-2 sm:mb-0 flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-secondary/30">
                <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-primary shrink-0" />
                <p className="text-[11px] sm:text-xs font-bold text-muted-foreground leading-relaxed">
                    You received <span className="text-foreground">₹1,225</span> in payouts this week across 2 verified disruptions.
                </p>
            </div>
        </motion.div>
    );
}
