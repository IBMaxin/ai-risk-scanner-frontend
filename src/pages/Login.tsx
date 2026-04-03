import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormData } from '@/utils/validators';
import { useLogin } from '@/hooks/useAuth';

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-primary-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">AI Risk Scanner</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your organization</p>
        </div>
        <form onSubmit={handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4 rounded-card bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <Input
            id="username"
            label="Tenant ID"
            autoComplete="username"
            placeholder="your-org-id"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" loading={loginMutation.isPending}>
            Sign In
          </Button>
          <p className="text-center text-sm text-gray-500">
            No account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
