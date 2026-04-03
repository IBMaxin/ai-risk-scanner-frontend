import type { Severity } from './scan';

export interface SeverityBreakdown {
  severity: Severity;
  count: number;
}

export interface DepartmentRisk {
  department: string;
  avg_score: number;
}

export interface DashboardSummary {
  total_tools: number;
  approved_count: number;
  unapproved_count: number;
  critical_count: number;
  severity_breakdown: SeverityBreakdown[];
  department_risk: DepartmentRisk[];
  avg_final_score: number;
}
