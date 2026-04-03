import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCriticalTools } from '@/hooks/useScans';
import { useRescanTool } from '@/hooks/useTools';
import { scoreColor } from '@/utils/formatters';

export function CriticalTools() {
  const { data, isLoading } = useCriticalTools();
  const rescan = useRescanTool();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {data && data.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">
            <strong>{data.length}</strong> tool{data.length > 1 ? 's' : ''} at Critical severity require immediate remediation.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['Tool', 'Vendor', 'Department', 'Score', 'Severity', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {(data ?? []).map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{tool.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{tool.vendor}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{tool.department}</td>
                  <td className={`px-4 py-3 font-semibold ${scoreColor(tool.final_score)}`}>{tool.final_score}</td>
                  <td className="px-4 py-3"><Badge variant="critical">{tool.severity}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/tools/${tool.id}`)} aria-label="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => rescan.mutate(tool.id)} loading={rescan.isPending} aria-label="Rescan">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data || data.length === 0) && <p className="py-12 text-center text-sm text-gray-400">No critical tools. 🎉</p>}
        </div>
      )}
    </div>
  );
}
