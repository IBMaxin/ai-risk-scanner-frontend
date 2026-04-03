import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastProvider } from '@/components/ui/Toast';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tools':     'Tool Management',
  '/scans':     'Scan History',
  '/critical':  'Critical Alerts',
  '/billing':   'Billing',
  '/settings':  'Settings',
};

export function MainLayout() {
  const { pathname } = useLocation();
  const { darkMode } = useUIStore();
  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? 'AI Risk Scanner';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ToastProvider />
    </div>
  );
}
