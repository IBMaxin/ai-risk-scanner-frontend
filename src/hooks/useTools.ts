import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listTools, createTool, updateTool, deleteTool, rescanTool, uploadCSV } from '@/api/tools';
import { toast } from '@/components/ui/Toast';
import type { AIToolCreate, AIToolUpdate } from '@/types/tool';

export const TOOLS_KEY = ['tools'] as const;

export function useTools(offset = 0, limit = 200) {
  return useQuery({
    queryKey: [...TOOLS_KEY, offset, limit],
    queryFn: () => listTools(offset, limit),
  });
}

export function useCreateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AIToolCreate) => createTool(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TOOLS_KEY });
      toast.success('Tool registered', 'Scan will begin shortly.');
    },
    onError: () => toast.error('Failed to create tool'),
  });
}

export function useUpdateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AIToolUpdate }) => updateTool(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TOOLS_KEY });
      toast.success('Tool updated');
    },
    onError: () => toast.error('Failed to update tool'),
  });
}

export function useDeleteTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTool(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TOOLS_KEY });
      toast.success('Tool deleted');
    },
    onError: () => toast.error('Failed to delete tool'),
  });
}

export function useRescanTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rescanTool(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TOOLS_KEY });
      toast.success('Rescan initiated');
    },
    onError: () => toast.error('Failed to initiate rescan'),
  });
}

export function useUploadCSV() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (pct: number) => void }) =>
      uploadCSV(file, onProgress),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: TOOLS_KEY });
      toast.success(
        'CSV imported',
        `Ingested: ${res.ingested}, Skipped: ${res.skipped}${
          res.errors.length ? ` — ${res.errors.length} error(s)` : ''
        }`,
      );
    },
    onError: () => toast.error('CSV upload failed'),
  });
}
