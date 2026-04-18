import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { format } from 'date-fns';
import { Terminal } from 'lucide-react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiClient.get('/audit/me');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Audit Log</h1>
        <p className="text-slate-500 text-sm mt-1">Immutable record of all your account actions and trust events</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Entity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-medium text-slate-500 font-mono">
                  {format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-100 rounded">
                      <Terminal className="w-3 h-3 text-slate-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
                      {log.action}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">
                  {log.entity}
                </td>
                <td className="px-6 py-4">
                  <pre className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded overflow-x-auto max-w-[300px]">
                    {log.metadata}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
