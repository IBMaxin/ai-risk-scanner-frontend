import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useDashboard } from '@/hooks/useDashboard';
import { severityHex } from '@/utils/formatters';
import type { Severity } from '@/types/scan';

/** Pie chart visualizing severity distribution from dashboard summary. */
export function SeverityChart() {
  const { data } = useDashboard();
  if (!data) return null;

  const chartData = data.severity_breakdown.map((s) => ({
    name: s.severity,
    value: s.count,
    fill: severityHex(s.severity as Severity),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => [v, 'Tools']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
