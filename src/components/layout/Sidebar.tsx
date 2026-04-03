import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Shield,
  AlertTriangle,
  CreditCard,
  Settings,
  LogOut,
  Activity,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useCriticalCount } from '@/hooks/useDashboard';

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/tools',      label: 'Tools',           icon: Wrench },
  { to: '/scans',      label: 'Scan History',    icon: Activity },
  { to: '/critical',   label: 'Critical Alerts', icon: AlertTriangle },
  { to: '/billing',    label: 'Billing',         icon: CreditCard },
  { to: '/settings',   label: 'Settings',        icon: Settings },
];

export function Sidebar() {
  const { logout, tenantId } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { data: criticalCount } = useCriticalCount();

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        sidebarOpen ? 'w-56' : 'w-16',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-700">
        <Shield className="h-7 w-7 text-primary-500 shrink-0" />
        {sidebarOpen && <span className="text-base font-bold text-gray-900 dark:text-white truncate">AI Risk Scanner</span>}
      </div>

      {/* Tenant ID */}
      {sidebarOpen && tenantId && (
        <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 truncate">{tenantId}</div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
            {to === '/critical' && criticalCount && criticalCount > 0 && (
              <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">{criticalCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-3 space-y-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeft className={cn('h-5 w-5 shrink-0 transition-transform', !sidebarOpen && 'rotate-180')} />
          {sidebarOpen && <span>Collapse</span>}
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
