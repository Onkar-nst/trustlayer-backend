import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  ArrowRightLeft, 
  Star, 
  AlertCircle, 
  History,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/identity', icon: UserCheck, label: 'Identity' },
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    { to: '/reviews', icon: Star, label: 'Reviews' },
    { to: '/disputes', icon: AlertCircle, label: 'Disputes' },
    { to: '/audit', icon: History, label: 'Audit Log' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', icon: ShieldCheck, label: 'Admin Panel' });
  }

  return (
    <aside className="w-64 h-screen bg-card border-r border-border/50 flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            TrustLayer
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-border/30">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
