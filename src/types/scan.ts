/** Scan result returned by the backend scanner. */
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type RemediationPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type DataExposure = 'High' | 'Medium' | 'Low';

export interface Scan {
  id: number;
  tool_id: number;
  base_score: number;
  final_score: number;
  severity: Severity;
  category: string;
  data_exposure: DataExposure;
  remediation_priority: RemediationPriority;
  scanned_at: string;
}

export interface PaginatedScans {
  items: Scan[];
  total: number;
  offset: number;
  limit: number;
}
