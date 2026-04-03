import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { useCriticalCount } from '@/hooks/useDashboard';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { darkMode, toggleDarkMode, setSidebarOpen, sidebarOpen } = useUIStore();
  const { tenantId } = useAuthStore();
  const { data: criticalCount } = useCriticalCount();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {criticalCount && criticalCount > 0 ? (
          <Button variant="ghost" size="icon" className="relative" aria-label="Critical alerts">
            <Bell className="h-5 w-5 text-red-500" />
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">{criticalCount}</span>
          </Button>
        ) : null}
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold">
          {tenantId?.[0]?.toUpperCase() ?? 'T'}
        </div>
      </div>
    </header>
  );
}
