import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);

  const fetchDisputes = async () => {
    try {
      const res = await apiClient.get('/disputes/me');
      setDisputes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Disputes</h1>
          <p className="text-slate-500 text-sm mt-1">Resolution center for transactions and reviews</p>
        </div>
        <button className="btn-primary">Raise New Dispute</button>
      </div>

      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="card text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">You have no active disputes.</p>
          </div>
        ) : (
          disputes.map((dispute: any) => (
            <div key={dispute.id} className="card hover:border-slate-200 transition-all flex items-center gap-6">
              <div className={`p-3 rounded-xl ${
                dispute.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                dispute.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900">Dispute #{dispute.id.substring(0, 8)}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                    dispute.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' :
                    dispute.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {dispute.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{dispute.reason}</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-tight"> Raised on: {new Date(dispute.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Disputes;
