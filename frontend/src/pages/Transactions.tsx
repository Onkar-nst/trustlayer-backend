import { useEffect, useState, FormEvent } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    receiverId: '',
    amount: '',
    type: 'PAYMENT',
    description: ''
  });

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/transactions', {
        ...formData,
        amount: Number(formData.amount)
      });
      setShowModal(false);
      fetchTransactions();
    } catch (err) {
      alert('Failed to create transaction');
    }
  };

  const completeTransaction = async (id: string) => {
    try {
      await apiClient.patch(`/transactions/${id}/complete`);
      fetchTransactions();
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your payments and transfers</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Transaction
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Counterparty</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((tx: any) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    {tx.senderId === user?.id ? (
                      <>To: {tx.receiver?.profile?.displayName || 'User'}</>
                    ) : (
                      <>From: {tx.sender?.profile?.displayName || 'User'}</>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{tx.type}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {tx.senderId === user?.id ? '-' : '+'}${tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    tx.status === 'COMPLETED' ? 'badge-green' : 
                    tx.status === 'FAILED' ? 'badge-red' : 'badge-gray'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {tx.status === 'PENDING' && tx.receiverId === user?.id && (
                    <button 
                      onClick={() => completeTransaction(tx.id)}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-xs"
                    >
                      COMPLETE
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Receiver ID</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.receiverId} 
                  onChange={(e) => setFormData({...formData, receiverId: e.target.value})} 
                  placeholder="Enter receiver UUID"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  className="input" 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="PAYMENT">Payment</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="ESCROW">Escrow</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Send Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
