
import { formatDistanceToNow } from 'date-fns';
import { CircleDot } from 'lucide-react';

interface ActivityItem {
  id: string;
  action: string;
  createdAt: string;
  metadata: any;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="space-y-6">
      {!Array.isArray(activities) || activities.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No recent activity</p>
      ) : (
        activities.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="mt-1">
              <CircleDot className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 border-b border-slate-50 pb-4">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-800">
                  {item.action.replace(/\./g, ' ').toUpperCase()}
                </p>
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {item.metadata ? JSON.stringify(item.metadata).substring(0, 100) : 'No metadata'}...
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed;
