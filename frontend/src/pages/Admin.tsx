import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Check, X, AlertCircle, Users, FileCheck } from 'lucide-react';

const Admin = () => {
  const [tab, setTab] = useState('verifications');
  const [verifications, setVerifications] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState<any>(null);

  const fetchData = async () => {
    try {
      if (tab === 'verifications') {
        const res = await apiClient.get('/admin/identity/pending');
        setVerifications(res.data);
      } else if (tab === 'disputes') {
        const res = await apiClient.get('/admin/disputes');
        setDisputes(res.data);
      } else if (tab === 'users') {
        const res = await apiClient.get('/admin/users');
        setUsers(res.data);
      }
      const statsRes = await apiClient.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const approveIdentity = async (id: string) => {
    await apiClient.post(`/admin/identity/${id}/approve`);
    fetchData();
  };

  const rejectIdentity = async (id: string) => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      await apiClient.post(`/admin/identity/${id}/reject`, { reason });
      fetchData();
    }
  };

  const resolveDispute = async (id: string, verdict: 'accept' | 'reject') => {
    const resolution = prompt('Enter resolution message:');
    if (resolution) {
      await apiClient.patch(`/admin/disputes/${id}/resolve`, { verdict, resolution });
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
        <p className="text-slate-500 text-sm mt-1">Platform management and governance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-600 border-none text-white">
          <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Avg Trust Score</p>
          <p className="text-3xl font-bold mt-2">{stats?.averageTrustScore?.toFixed(1) || '0.0'}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Total Users</p>
          <p className="text-3xl font-bold mt-2 text-slate-900">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Pending Checks</p>
          <p className="text-3xl font-bold mt-2 text-slate-900">{stats?.pendingVerifications || 0}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: 'verifications', label: 'Identity Checks', icon: FileCheck },
          { id: 'disputes', label: 'Open Disputes', icon: AlertCircle },
          { id: 'users', label: 'User Registry', icon: Users },
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {tab === 'verifications' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Document</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Link</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {verifications.map((v: any) => (
                <tr key={v.userId} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-sm font-medium">{v.user.email}</td>
                  <td className="px-6 py-4 text-xs font-bold uppercase">{v.documentType}</td>
                  <td className="px-6 py-4 text-xs text-blue-600 hover:underline">
                    <a href={v.documentUrl} target="_blank" rel="noreferrer">View Doc</a>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => approveIdentity(v.userId)} className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => rejectIdentity(v.userId)} className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'disputes' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Raised By</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Resolve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {disputes.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-sm font-medium">{d.raisedBy.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{d.reason}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => resolveDispute(d.id, 'accept')} className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">ACCEPT</button>
                    <button onClick={() => resolveDispute(d.id, 'reject')} className="px-3 py-1 border border-slate-200 text-slate-600 text-xs font-bold rounded">REJECT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'users' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Trust Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u: any) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4 text-sm font-medium">{u.profile?.displayName}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-blue-600">{u.trustScore?.total || 50}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
