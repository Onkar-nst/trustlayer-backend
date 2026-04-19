import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { ShieldCheck, Award, Check, Clock, Star, Activity, Link as LinkIcon, User, MapPin, Calendar } from 'lucide-react';

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

  if (!profile) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 transition-all">
      {/* Hero Section */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-md">
        {/* Banner with gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <div className="relative pt-16 px-6 sm:px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 bg-white p-1.5 rounded-full shadow-xl z-10 shrink-0 transform transition-transform hover:scale-105">
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-100">
                {profile.profile?.avatarUrl ? (
                    <img src={profile.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-16 h-16 text-slate-300" />
                )}
            </div>
          </div>
          
          {/* Main Info */}
          <div className="flex-1 text-center md:text-left pt-4 md:pt-0">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {profile.profile?.displayName || 'Unknown User'}
              </h1>
              {profile.trustScore?.total >= 50 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Trait
                </span>
              )}
            </div>
            <p className="text-slate-500 text-base mt-2 flex items-center justify-center md:justify-start gap-4">
               <span>{profile.email}</span>
               {profile.profile?.location && (
                 <>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {profile.profile.location}</span>
                 </>
               )}
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-4 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center justify-center px-4">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {profile.trustScore?.total || 50}
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Trust Score</p>
            </div>
            <div className="w-[1px] bg-slate-200" />
            <div className="flex flex-col items-center justify-center px-4">
              <div className="flex items-center gap-1 text-3xl font-black text-slate-800">
                <span>{profile.reviewSummary?.averageRating?.toFixed(1) || '4.0'}</span>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 mb-1" />
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Verifications */}
        <div className="space-y-8 lg:col-span-1">
            {/* Identity Verification */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                Verifications
                </h2>
                <div className="space-y-3">
                    <div className={`group flex justify-between items-center p-4 rounded-2xl border transition-colors ${profile.identity?.status === 'VERIFIED' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${profile.identity?.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block text-sm font-bold">Government ID</span>
                                <span className="block text-xs opacity-80 mt-0.5">{profile.identity?.status === 'VERIFIED' ? 'Verified' : 'Pending'}</span>
                            </div>
                        </div>
                        {profile.identity?.status === 'VERIFIED' ? <Check className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 opacity-60" />}
                    </div>
                     <div className="group flex justify-between items-center p-4 rounded-2xl border transition-colors bg-emerald-50/50 border-emerald-100 text-emerald-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                                <Check className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block text-sm font-bold">Email Address</span>
                                <span className="block text-xs opacity-80 mt-0.5">Verified</span>
                            </div>
                        </div>
                        <Check className="w-5 h-5 text-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Connected Accounts */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-indigo-500" />
                Linked Accounts
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center font-bold text-blue-600">G</div>
                            <span className="text-sm font-semibold text-slate-700">Google</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Connected</span>
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center font-bold text-indigo-600">in</div>
                            <span className="text-sm font-semibold text-slate-700">LinkedIn</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">Connect</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Activity & Reviews */}
        <div className="space-y-8 lg:col-span-2">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Recent Activity
                    </h2>
                    <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">View All</button>
                </div>
                
                <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 mt-4">
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-white" />
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                            <p className="text-sm font-semibold text-slate-800">Completed a transaction with <span className="text-blue-600 cursor-pointer">Jane Doe</span></p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 2 days ago</span>
                                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-slate-300 rounded-full ring-4 ring-white" />
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                            <p className="text-sm font-semibold text-slate-800">Identity verification approved</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 1 week ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Recent Reviews
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mock Review 1 */}
                    <div className="p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 bg-slate-50/50 cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                            </div>
                            <span className="text-xs text-slate-400 font-medium">1 month ago</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-3">"Very reliable and fast communication. The process was smooth from start to finish. Highly recommended!"</p>
                        <div className="flex items-center gap-2 mt-auto">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">A</div>
                            <span className="text-xs font-semibold text-slate-700">Alice Smith</span>
                        </div>
                    </div>
                     {/* Mock Review 2 */}
                    <div className="p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 bg-slate-50/50 cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                                {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                                <Star className="w-4 h-4 text-slate-200 fill-slate-200" />
                            </div>
                            <span className="text-xs text-slate-400 font-medium">2 months ago</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-3">"Good experience overall, minor delay in the response but trustworthy and professional."</p>
                        <div className="flex items-center gap-2 mt-auto">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">M</div>
                            <span className="text-xs font-semibold text-slate-700">Mike Johnson</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
