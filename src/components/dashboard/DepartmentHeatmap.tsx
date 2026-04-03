import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useDashboard } from '@/hooks/useDashboard';

function riskColor(score: number): string {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f97316';
  if (score >= 40) return '#eab308';
  return '#22c55e';
}

/** Horizontal bar chart showing average risk score per department. */
export function DepartmentHeatmap() {
  const { data } = useDashboard();
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Risk</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, data.department_risk.length * 44)}>
          <BarChart data={data.department_risk} layout="vertical" margin={{ left: 8, right: 24 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis dataKey="department" type="category" width={110} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [v.toFixed(1), 'Avg Score']} />
            <Bar dataKey="avg_score" radius={[0, 4, 4, 0]}>
              {data.department_risk.map((entry) => (
                <Cell key={entry.department} fill={riskColor(entry.avg_score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
