import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { ToolForm } from '@/components/tools/ToolForm';
import { useTools, useUpdateTool, useDeleteTool, useRescanTool } from '@/hooks/useTools';
import { useToolScans } from '@/hooks/useScans';
import { formatDate, scoreColor } from '@/utils/formatters';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Severity } from '@/types/scan';
import type { ToolFormData } from '@/utils/validators';

export function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toolId = Number(id);

  const { data: toolsData, isLoading: toolsLoading } = useTools();
  const { data: scans } = useToolScans(toolId);
  const updateTool = useUpdateTool();
  const deleteTool = useDeleteTool();
  const rescan = useRescanTool();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const tool = toolsData?.items.find((t) => t.id === toolId);
  const latestScan = scans?.[0];

  if (toolsLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!tool) return <p className="text-center text-gray-400 py-12">Tool not found.</p>;

  const handleEdit = (data: ToolFormData) => {
    updateTool.mutate({ id: toolId, data }, { onSuccess: () => setEditOpen(false) });
  };

  const handleDelete = () => {
    deleteTool.mutate(toolId, { onSuccess: () => navigate('/tools') });
  };

  const trendData = (scans ?? []).slice(0, 20).reverse().map((s) => ({
    date: formatDate(s.scanned_at),
    score: s.final_score,
  }));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => rescan.mutate(toolId)} loading={rescan.isPending}>
            <RefreshCw className="h-4 w-4" /> Rescan
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Tool Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{tool.name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{tool.vendor} &middot; {tool.department}</p>
            </div>
            {latestScan && <Badge severity={latestScan.severity as Severity}>{latestScan.severity}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
            {[
              ['Users',   tool.user_count],
              ['Status',  tool.approved ? 'Approved' : 'Pending'],
              ['Score',   latestScan ? latestScan.final_score : 'N/A'],
              ['Created', formatDate(tool.created_at)],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-gray-500">{label}</dt>
                <dd className={`mt-1 font-semibold ${label === 'Score' && latestScan ? scoreColor(latestScan.final_score) : 'text-gray-900 dark:text-gray-100'}`}>{String(value)}</dd>
              </div>
            ))}
          </dl>
          {tool.notes && <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{tool.notes}</p>}
        </CardContent>
      </Card>

      {/* Score Trend */}
      {trendData.length > 1 && (
        <Card>
          <CardHeader><CardTitle>Score Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      <Card>
        <CardHeader><CardTitle>Scan History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Date', 'Base', 'Final', 'Severity', 'Category', 'Data Exposure', 'Priority'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {(scans ?? []).map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-gray-500">{formatDate(scan.scanned_at)}</td>
                  <td className="px-4 py-3">{scan.base_score}</td>
                  <td className={`px-4 py-3 font-semibold ${scoreColor(scan.final_score)}`}>{scan.final_score}</td>
                  <td className="px-4 py-3"><Badge severity={scan.severity as Severity}>{scan.severity}</Badge></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{scan.category}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{scan.data_exposure}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{scan.remediation_priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!scans || scans.length === 0) && <p className="py-8 text-center text-sm text-gray-400">No scans yet.</p>}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={`Edit ${tool.name}`}>
        <ToolForm defaultValues={tool} onSubmit={handleEdit} loading={updateTool.isPending} submitLabel="Update Tool" />
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Tool" description={`Permanently delete ${tool.name} and all scan history?`}>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleteTool.isPending}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
