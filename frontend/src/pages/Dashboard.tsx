import React, { useEffect, useState } from 'react';
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
  const [activities, setActivities] = useState([]);
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes, scoreRes] = await Promise.all([
          apiClient.get('/admin/stats'), // Or specific user stats route
          apiClient.get('/audit/me'),
          apiClient.get(`/trust/${user?.id}`)
        ]);
        setStats(statsRes.data);
        setActivities(activityRes.data);
        setScore(scoreRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      }
    };
    if (user) fetchData();
  }, [user]);

  const identityStatus = score?.identityBonus > 0 ? 'VERIFIED' : 'PENDING';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.profile?.displayName || 'User'}</h1>
        <p className="text-slate-500 mt-1">Here is what is happening with your TrustLayer reputation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Trust Score" 
          value={score?.total || 50} 
          icon={ShieldCheck} 
          trend="+2%" 
          color="blue" 
        />
        <MetricCard 
          title="Completed Transactions" 
          value={score?.transactionBonus / 2 || 0} 
          icon={CreditCard} 
          color="emerald" 
        />
        <MetricCard 
          title="Avg. Rating" 
          value={(score?.reviewBonus / 4).toFixed(1) || '0.0'} 
          icon={Star} 
          color="amber" 
        />
        <MetricCard 
          title="Open Disputes" 
          value={stats?.openDisputes || 0} 
          icon={AlertCircle} 
          color="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Trust Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="64" cy="64" r="58" 
                      fill="none" stroke="currentColor" strokeWidth="8"
                      className="text-slate-200"
                    />
                    <circle 
                      cx="64" cy="64" r="58" 
                      fill="none" stroke="currentColor" strokeWidth="8"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * (score?.total || 50)) / 120}
                      className="text-blue-600 transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{score?.total || 50}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-4">Current Reputation</p>
              </div>
              <TrustScoreBreakdown score={score} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Identity Verification</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Gov ID', status: identityStatus, icon: ShieldCheck },
                { label: 'Email', status: 'VERIFIED', icon: ShieldCheck },
                { label: 'Phone', status: 'PENDING', icon: Clock },
                { label: 'Face ID', status: 'PENDING', icon: Clock },
              ].map((check) => (
                <div key={check.label} className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                  {check.status === 'VERIFIED' ? (
                    <CheckCircle2 className="text-emerald-500 w-6 h-6 mb-2" />
                  ) : check.status === 'REJECTED' ? (
                    <XCircle className="text-rose-500 w-6 h-6 mb-2" />
                  ) : (
                    <Clock className="text-amber-500 w-6 h-6 mb-2" />
                  )}
                  <span className="text-xs font-medium text-slate-700">{check.label}</span>
                  <span className="text-[10px] text-slate-400 uppercase mt-1 font-bold">{check.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h2>
            <ActivityFeed activities={activities.slice(0, 5)} />
            <button className="w-full mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
