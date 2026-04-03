import { useQuery } from '@tanstack/react-query';
import { listScans, listToolScans, listCriticalTools } from '@/api/scans';

export function useScans(offset = 0, limit = 50) {
  return useQuery({
    queryKey: ['scans', offset, limit],
    queryFn: () => listScans(offset, limit),
  });
}

export function useToolScans(toolId: number) {
  return useQuery({
    queryKey: ['scans', 'tool', toolId],
    queryFn: () => listToolScans(toolId),
    enabled: toolId > 0,
  });
}

export function useCriticalTools() {
  return useQuery({
    queryKey: ['critical-tools'],
    queryFn: listCriticalTools,
    refetchInterval: 60_000, // Poll every minute
  });
}
