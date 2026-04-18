
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const MetricCard = ({ title, value, icon: Icon, trend, color = 'blue' }: MetricCardProps) => {
  const colorMap: Record<string, string> = {
    blue: 'text-primary bg-primary/10 border-primary/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="card group hover:scale-[1.02] transition-all cursor-default border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-foreground mt-1 tabular-nums transition-all group-hover:text-primary">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
