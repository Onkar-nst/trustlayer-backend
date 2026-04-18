

interface TrustScoreBreakdownProps {
  score: any;
}

const TrustScoreBreakdown: React.FC<TrustScoreBreakdownProps> = ({ score }) => {
  if (!score) return null;

  const items = [
    { label: 'Base Score', value: score.baseScore, max: 50, color: 'bg-slate-200' },
    { label: 'Identity Bonus', value: score.identityBonus, max: 20, color: 'bg-emerald-500' },
    { label: 'Transactions', value: score.transactionBonus, max: 30, color: 'bg-blue-500' },
    { label: 'Reviews', value: score.reviewBonus, max: 20, color: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">Detailed Breakdown</span>
        <span className="text-xs text-slate-400">Total: {score.total} / 120</span>
      </div>
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
            <span className="text-xs font-bold text-slate-700">+{item.value}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${item.color}`}
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {score.penaltyPoints > 0 && (
        <div className="bg-rose-50 p-2 rounded-lg flex justify-between items-center">
          <span className="text-xs font-medium text-rose-600">Penalty Points</span>
          <span className="text-xs font-bold text-rose-700">-{score.penaltyPoints}</span>
        </div>
      )}
    </div>
  );
};

export default TrustScoreBreakdown;
