import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useScans } from '@/hooks/useScans';
import { useRescanTool } from '@/hooks/useTools';
import { formatDate, scoreColor } from '@/utils/formatters';
import type { Severity } from '@/types/scan';

/** Latest 10 scans with quick-action buttons. */
export function RecentScansTable() {
  const { data, isLoading } = useScans(0, 10);
  const rescan = useRescanTool();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent Scans</CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/scans')}>View all</Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {['Tool', 'Score', 'Severity', 'Date', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data?.items.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{scan.tool_id}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${scoreColor(scan.final_score)}`}>{scan.final_score}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge severity={scan.severity as Severity}>{scan.severity}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(scan.scanned_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/tools/${scan.tool_id}`)} aria-label="View tool">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => rescan.mutate(scan.tool_id)}
                          loading={rescan.isPending}
                          aria-label="Rescan"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
