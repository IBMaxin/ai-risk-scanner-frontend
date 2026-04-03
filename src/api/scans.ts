import apiClient from './client';
import type { PaginatedScans, Scan } from '@/types/scan';

/** GET /dashboard/scans */
export async function listScans(offset = 0, limit = 50): Promise<PaginatedScans> {
  const res = await apiClient.get<PaginatedScans>('/dashboard/scans', { params: { offset, limit } });
  return res.data;
}

/** GET /dashboard/tools/:tool_id/scans */
export async function listToolScans(toolId: number): Promise<Scan[]> {
  const res = await apiClient.get<Scan[]>(`/dashboard/tools/${toolId}/scans`);
  return res.data;
}

/** GET /dashboard/tools/critical */
export async function listCriticalTools(): Promise<AIToolWithScan[]> {
  const res = await apiClient.get<AIToolWithScan[]>('/dashboard/tools/critical');
  return res.data;
}

interface AIToolWithScan {
  id: number;
  name: string;
  vendor: string;
  department: string;
  severity: string;
  final_score: number;
}
