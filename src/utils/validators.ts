import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Tenant ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  tenant_id: z.string().min(3, 'Tenant ID must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  name: z.string().min(2, 'Organization name is required'),
  secret: z.string().min(8, 'Password must be at least 8 characters'),
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
});

export const toolSchema = z.object({
  name: z.string().min(1, 'Tool name is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  department: z.string().min(1, 'Department is required'),
  approved: z.boolean().default(false),
  user_count: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ToolFormData = z.infer<typeof toolSchema>;
