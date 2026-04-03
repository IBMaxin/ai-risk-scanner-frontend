import { format, formatDistanceToNow } from 'date-fns';
import type { Severity } from '@/types/scan';

/** Format ISO date string to readable format. */
export function formatDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy');
}

/** Return relative time string like "3 hours ago". */
export function timeAgo(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

/** Return Tailwind color classes for a given severity level. */
export function severityColor(severity: Severity): string {
  switch (severity) {
    case 'Critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    case 'High':     return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    case 'Medium':   return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    case 'Low':      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  }
}

/** Return hex color for recharts. */
export function severityHex(severity: Severity): string {
  switch (severity) {
    case 'Critical': return '#ef4444';
    case 'High':     return '#f97316';
    case 'Medium':   return '#eab308';
    case 'Low':      return '#22c55e';
  }
}

/** Score 0-100 → color class. */
export function scoreColor(score: number): string {
  if (score >= 80) return 'text-red-600';
  if (score >= 60) return 'text-orange-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-green-600';
}
