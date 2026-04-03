import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { registerSchema, type RegisterFormData } from '@/utils/validators';
import { useRegister } from '@/hooks/useAuth';

const PLAN_OPTS = [
  { value: 'free', label: 'Free — up to 10 tools' },
  { value: 'pro', label: 'Pro — unlimited tools + alerts' },
  { value: 'enterprise', label: 'Enterprise — custom SLA' },
];

export function Register() {
  const { register: reg, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { plan: 'free' },
  });
  const registerMutation = useRegister();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-primary-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Start monitoring your AI tools today</p>
        </div>
        <form
          onSubmit={handleSubmit((d) => registerMutation.mutate(d))}
          className="space-y-4 rounded-card bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <Input id="tenant_id" label="Tenant ID *" placeholder="acme-corp" error={errors.tenant_id?.message} {...reg('tenant_id')} />
          <Input id="name" label="Organization Name *" placeholder="Acme Corporation" error={errors.name?.message} {...reg('name')} />
          <Input id="secret" label="Password *" type="password" placeholder="••••••••" error={errors.secret?.message} {...reg('secret')} />
          <Select id="plan" label="Plan" options={PLAN_OPTS} {...reg('plan')} />
          <Button type="submit" className="w-full" loading={registerMutation.isPending}>Create Account</Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
