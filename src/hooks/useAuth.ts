import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/Toast';
import type { LoginFormData, RegisterFormData } from '@/utils/validators';

/**
 * Handles login mutation: stores JWT, redirects to dashboard.
 */
export function useLogin() {
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (res) => {
      // Decode tenant_id from JWT sub claim
      const payload = JSON.parse(atob(res.access_token.split('.')[1]));
      storeLogin(res.access_token, payload.sub ?? 'unknown');
      navigate('/dashboard');
    },
    onError: () => toast.error('Login failed', 'Check your credentials and try again.'),
  });
}

/**
 * Handles registration mutation, then auto-logs in.
 */
export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormData) => register(data),
    onSuccess: () => {
      toast.success('Account created', 'Please log in with your new credentials.');
      navigate('/login');
    },
    onError: () => toast.error('Registration failed', 'Tenant ID may already be taken.'),
  });
}
