import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { useScans } from '@/hooks/useScans';
import { formatDate, scoreColor } from '@/utils/formatters';
import type { Severity } from '@/types/scan';

const PAGE_SIZE = 50;

export function Scans() {
  const [offset, setOffset] = useState(0);
  const { data, isLoading } = useScans(offset, PAGE_SIZE);
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-card border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Tool ID', 'Base Score', 'Final Score', 'Severity', 'Category', 'Data Exposure', 'Priority', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {data?.items.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{scan.tool_id}</td>
                    <td className="px-4 py-3">{scan.base_score}</td>
                    <td className={`px-4 py-3 font-semibold ${scoreColor(scan.final_score)}`}>{scan.final_score}</td>
                    <td className="px-4 py-3"><Badge severity={scan.severity as Severity}>{scan.severity}</Badge></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{scan.category}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{scan.data_exposure}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{scan.remediation_priority}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(scan.scanned_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{Math.min(offset + 1, total)}–{Math.min(offset + PAGE_SIZE, total)} of {total}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>← Prev</Button>
              <Button variant="outline" size="sm" disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>Next →</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
