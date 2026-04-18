import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { ShieldCheck, Award, Check, Clock } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/users/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card relative overflow-hidden pt-12">
        <div className="absolute top-0 left-0 w-full h-24 bg-blue-600" />
        <div className="relative flex flex-col items-center">
          <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg">
            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                <ShieldCheck className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">{profile.profile?.displayName}</h1>
          <p className="text-slate-500 text-sm mt-1">{profile.email}</p>
          <div className="flex gap-4 mt-6">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{profile.trustScore?.total || 50}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase uppercase tracking-widest">Trust Score</p>
            </div>
            <div className="w-[1px] bg-slate-100" />
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900">{profile.reviewSummary?.averageRating.toFixed(1) || '0.0'}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase uppercase tracking-widest">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" />
            Identity Verification
          </h2>
          <div className="space-y-3">
             <div className={`flex justify-between items-center p-3 rounded-lg ${profile.identity?.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                <span className="text-sm font-medium">Identity Doc</span>
                {profile.identity?.status === 'VERIFIED' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
