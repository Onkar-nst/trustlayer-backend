import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Upload, ShieldCheck, Clock, XCircle, CheckCircle2 } from 'lucide-react';

const Identity = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const [docType, setDocType] = useState('GOVT_ID');

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get('/identity/status');
      setStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/identity/upload', {
        documentType: docType,
        documentUrl: fileUrl
      });
      fetchStatus();
      alert('Verification submitted');
    } catch (err) {
      alert('Upload failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Identity Verification</h1>
        <p className="text-slate-500 text-sm mt-1">Verify your identity to increase your Trust Score by 20 points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Verification Checklist</h2>
            <div className="space-y-4">
              {[
                { label: 'Government Issued ID', desc: 'Passport, Driving License or National ID', bonus: '+20 pts' },
                { label: 'Face Verification', desc: 'Liveness check and face matching', bonus: 'Required for Trusted' },
                { label: 'Address Proof', desc: 'Utility bill or bank statement', bonus: '+5 pts' }
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{item.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase uppercase tracking-tighter">
                      {item.bonus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Current Status</h2>
            {!status ? (
              <div className="text-center py-6">
                <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-sm text-slate-500">No verification started</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  status.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' :
                  status.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {status.status === 'VERIFIED' ? <CheckCircle2 className="w-5 h-5" /> : 
                   status.status === 'REJECTED' ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  <span className="font-bold text-sm tracking-tight">{status.status}</span>
                </div>
                {status.rejectionReason && (
                    <p className="text-xs text-rose-600 font-medium">Reason: {status.rejectionReason}</p>
                )}
                <div className="text-xs text-slate-400">
                  Last updated: {new Date(status.updatedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-sm font-bold mb-4">Submit Documents</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select 
                className="input text-sm" 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
              >
                <option value="GOVT_ID">Government ID</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVING_LICENSE">Driving License</option>
              </select>
              <input 
                type="text" 
                className="input text-sm" 
                placeholder="Document URL (mock)" 
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={status?.status === 'PENDING' || status?.status === 'VERIFIED'}
                className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identity;
