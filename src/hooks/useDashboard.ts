import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '@/api/dashboard';
import { listCriticalTools } from '@/api/scans';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
    staleTime: 30_000,
  });
}

/** Lightweight hook used by Sidebar and Header to show badge count. */
export function useCriticalCount() {
  return useQuery({
    queryKey: ['critical-tools'],
    queryFn: listCriticalTools,
    select: (data) => data.length,
    refetchInterval: 60_000,
  });
}
