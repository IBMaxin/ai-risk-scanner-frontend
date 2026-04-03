import { useNavigate } from 'react-router-dom';
import { Plus, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RiskOverviewCards } from '@/components/dashboard/RiskOverviewCards';
import { SeverityChart } from '@/components/dashboard/SeverityChart';
import { DepartmentHeatmap } from '@/components/dashboard/DepartmentHeatmap';
import { RecentScansTable } from '@/components/dashboard/RecentScansTable';
import { useDashboard } from '@/hooks/useDashboard';

export function Dashboard() {
  const navigate = useNavigate();
  const { data } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Critical Banner */}
      {data && data.critical_count > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 flex-1">
            <strong>{data.critical_count} Critical</strong> severity tool{data.critical_count > 1 ? 's' : ''} require immediate attention.
          </p>
          <Button variant="danger" size="sm" onClick={() => navigate('/critical')}>View</Button>
        </div>
      )}

      <RiskOverviewCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SeverityChart />
        <DepartmentHeatmap />
      </div>

      {/* Recent Scans + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentScansTable />
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Actions</h3>
          <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/tools')}>
            <Plus className="h-4 w-4" /> Add Tool
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/tools/upload')}>
            <Upload className="h-4 w-4" /> Upload CSV
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/critical')}>
            <AlertTriangle className="h-4 w-4" /> Critical Tools
          </Button>
        </div>
      </div>
    </div>
  );
}
