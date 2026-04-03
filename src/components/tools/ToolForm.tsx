import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toolSchema, type ToolFormData } from '@/utils/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { AITool } from '@/types/tool';

const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance',
  'Legal', 'Product', 'Design', 'Operations', 'Other',
].map((d) => ({ value: d, label: d }));

interface ToolFormProps {
  defaultValues?: Partial<AITool>;
  onSubmit: (data: ToolFormData) => void;
  loading?: boolean;
  submitLabel?: string;
}

/**
 * Reusable form for creating and editing AI tools.
 * Uses react-hook-form + Zod for validation.
 */
export function ToolForm({ defaultValues, onSubmit, loading, submitLabel = 'Save Tool' }: ToolFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name:        defaultValues?.name ?? '',
      vendor:      defaultValues?.vendor ?? '',
      department:  defaultValues?.department ?? 'Engineering',
      approved:    defaultValues?.approved ?? false,
      user_count:  defaultValues?.user_count ?? 0,
      notes:       defaultValues?.notes ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label="Tool Name *"
          placeholder="e.g. ChatGPT"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          id="vendor"
          label="Vendor *"
          placeholder="e.g. OpenAI"
          error={errors.vendor?.message}
          {...register('vendor')}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id="department"
          label="Department *"
          options={DEPARTMENTS}
          error={errors.department?.message}
          {...register('department')}
        />
        <Input
          id="user_count"
          label="User Count"
          type="number"
          min={0}
          error={errors.user_count?.message}
          {...register('user_count', { valueAsNumber: true })}
        />
      </div>
      <Input
        id="notes"
        label="Notes"
        placeholder="Optional notes"
        {...register('notes')}
      />
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" className="rounded" {...register('approved')} />
        Mark as Approved
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
}
