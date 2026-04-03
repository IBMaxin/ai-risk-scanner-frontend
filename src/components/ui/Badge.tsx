import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';
import type { Severity } from '@/types/scan';

const variants = {
  default:  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
  severity?: Severity;
}

/** Inline pill badge. Pass severity to auto-select the matching color variant. */
export function Badge({ className, variant, severity, ...props }: BadgeProps) {
  const v = severity ? (severity.toLowerCase() as keyof typeof variants) : (variant ?? 'default');
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[v],
        className,
      )}
      {...props}
    />
  );
}
