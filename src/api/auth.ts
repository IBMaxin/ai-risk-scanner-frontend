import apiClient from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';

/**
 * POST /auth/token — Exchange credentials for JWT.
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const form = new URLSearchParams();
  form.append('username', data.username);
  form.append('password', data.password);
  const res = await apiClient.post<LoginResponse>('/auth/token', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
}

/**
 * POST /tenants — Register a new tenant.
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await apiClient.post<RegisterResponse>('/tenants', data);
  return res.data;
}
