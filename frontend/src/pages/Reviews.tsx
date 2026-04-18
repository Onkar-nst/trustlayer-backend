import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Star, ShieldAlert } from 'lucide-react';

const Reviews = () => {
  const [received, setReceived] = useState([]);
  const [given, setGiven] = useState([]);
  const [tab, setTab] = useState('received');

  const fetchData = async () => {
    try {
      const [receivedRes, givenRes] = await Promise.all([
        apiClient.get('/reviews/me'),
        apiClient.get('/reviews/given')
      ]);
      setReceived(receivedRes.data);
      setGiven(givenRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reviews = tab === 'received' ? received : given;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your feedback and reputation impact</p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setTab('received')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === 'received' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Received
        </button>
        <button 
          onClick={() => setTab('given')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === 'given' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Given
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length === 0 ? (
          <p className="text-slate-400 text-sm">No reviews found.</p>
        ) : (
          reviews.map((review: any) => (
            <div key={review.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <Star className="text-amber-400 w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {tab === 'received' ? review.author?.profile?.displayName : review.subject?.profile?.displayName}
                    </h3>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">
                "{review.body}"
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold text-emerald-600 px-2 py-1 bg-emerald-50 rounded uppercase tracking-wider">
                  Impact: +{review.rating * 0.5} pts
                </span>
                <button className="text-rose-500 text-[10px] font-bold uppercase flex items-center gap-1 hover:text-rose-600">
                  <ShieldAlert className="w-3 h-3" />
                  Dispute
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
