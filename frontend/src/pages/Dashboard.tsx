import { useEffect, useState } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import TrustScoreBreakdown from '../components/dashboard/TrustScoreBreakdown';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { 
  CreditCard, 
  Star,
  AlertCircle, 
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disputeRes, activityRes, scoreRes] = await Promise.all([
          apiClient.get('/disputes/me'),
          apiClient.get('/audit/me'),
          apiClient.get(`/trust/${user?.id}`)
        ]);

        // Count user's own open disputes
        const disputes = Array.isArray(disputeRes.data) ? disputeRes.data : [];
        setStats({ openDisputes: disputes.filter((d: any) => d.status === 'OPEN').length });

        const activityData = activityRes.data;
        if (Array.isArray(activityData)) {
          setActivities(activityData);
        } else {
          console.warn('Expected array for activities, got:', activityData);
          setActivities([]);
        }
        setScore(scoreRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const identityStatus = score?.identityBonus > 0 ? 'VERIFIED' : 'PENDING';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.profile?.displayName || 'User'}</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Monitoring your TrustLayer reputation in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Trust Score" 
          value={score?.total || 50} 
          icon={ShieldCheck} 
          trend="+2.4%" 
          color="blue" 
        />
        <MetricCard 
          title="Completed" 
          value={score?.transactionBonus / 2 || 0} 
          icon={CreditCard} 
          color="emerald" 
        />
        <MetricCard 
          title="Avg. Rating" 
          value={(score?.reviewBonus / 4).toFixed(1) || '0.0'} 
          icon={Star} 
          trend="Stable"
          color="amber" 
        />
        <MetricCard 
          title="Active Disputes" 
          value={stats?.openDisputes || 0} 
          icon={AlertCircle} 
          color="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-foreground">Score Breakdown</h2>
               <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Verified Logic</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/50 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="64" cy="64" r="58" 
                      fill="none" stroke="currentColor" strokeWidth="6"
                      className="text-muted/30"
                    />
                    <circle 
                      cx="64" cy="64" r="58" 
                      fill="none" stroke="currentColor" strokeWidth="10"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * Math.min(score?.total || 50, 120)) / 120}
                      className="text-primary transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-4xl font-black text-foreground">{score?.total || 50}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-4">Platform Reputation</p>
              </div>
              <TrustScoreBreakdown score={score} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-foreground mb-6">Verification Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Gov ID', status: identityStatus, icon: ShieldCheck },
                { label: 'Security', status: 'VERIFIED', icon: ShieldCheck },
                { label: 'Mobile', status: 'PENDING', icon: Clock },
                { label: 'Biometrics', status: 'PENDING', icon: Clock },
              ].map((check) => (
                <div key={check.label} className="flex flex-col items-center p-4 bg-muted/20 border border-border/30 rounded-xl hover:border-primary/50 transition-all cursor-default">
                  {check.status === 'VERIFIED' ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    </div>
                  ) : check.status === 'REJECTED' ? (
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center mb-2">
                       <XCircle className="text-rose-500 w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                      <Clock className="text-amber-500 w-5 h-5" />
                    </div>
                  )}
                  <span className="text-sm font-bold text-foreground/80">{check.label}</span>
                  <span className={`text-[10px] font-black uppercase mt-1 ${
                    check.status === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>{check.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card">
            <h2 className="text-lg font-bold text-foreground mb-6">Live Events</h2>
            <ActivityFeed activities={activities.slice(0, 5)} />
            <button className="w-full mt-6 py-3 border border-border/50 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted transition-all uppercase tracking-widest">
              View Audit Trail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
