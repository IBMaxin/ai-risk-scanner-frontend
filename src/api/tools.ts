import apiClient from './client';
import type { AITool, AIToolCreate, AIToolUpdate, PaginatedTools } from '@/types/tool';

/** GET /ingest/tools */
export async function listTools(offset = 0, limit = 200): Promise<PaginatedTools> {
  const res = await apiClient.get<PaginatedTools>('/ingest/tools', { params: { offset, limit } });
  return res.data;
}

/** POST /ingest/tool */
export async function createTool(data: AIToolCreate): Promise<AITool> {
  const res = await apiClient.post<AITool>('/ingest/tool', data);
  return res.data;
}

/** PATCH /ingest/tools/:id */
export async function updateTool(id: number, data: AIToolUpdate): Promise<AITool> {
  const res = await apiClient.patch<AITool>(`/ingest/tools/${id}`, data);
  return res.data;
}

/** DELETE /ingest/tools/:id */
export async function deleteTool(id: number): Promise<void> {
  await apiClient.delete(`/ingest/tools/${id}`);
}

/** POST /ingest/tools/:id/rescan */
export async function rescanTool(id: number): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(`/ingest/tools/${id}/rescan`);
  return res.data;
}

/** POST /ingest/csv — multipart form upload */
export async function uploadCSV(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ ingested: number; skipped: number; errors: string[] }> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiClient.post('/ingest/csv', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
  return res.data;
}
