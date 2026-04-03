import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useDashboard } from '@/hooks/useDashboard';
import { scoreColor } from '@/utils/formatters';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass?: string;
}

function StatCard({ label, value, icon, colorClass = 'text-gray-900 dark:text-gray-100' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-3">{icon}</div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/** Grid of 4 KPI cards sourced from /dashboard/summary. */
export function RiskOverviewCards() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Tools"
        value={data.total_tools}
        icon={<Shield className="h-6 w-6 text-primary-500" />}
      />
      <StatCard
        label="Approved"
        value={data.approved_count}
        icon={<CheckCircle className="h-6 w-6 text-green-500" />}
        colorClass="text-green-600"
      />
      <StatCard
        label="Unapproved"
        value={data.unapproved_count}
        icon={<XCircle className="h-6 w-6 text-orange-500" />}
        colorClass="text-orange-600"
      />
      <StatCard
        label="Critical"
        value={data.critical_count}
        icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
        colorClass={data.critical_count > 0 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}
      />
    </div>
  );
}
