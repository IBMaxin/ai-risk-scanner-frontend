import apiClient from './client';

interface CheckoutSession {
  url: string;
}

interface PortalSession {
  url: string;
}

/** POST /billing/checkout — returns Stripe Checkout URL */
export async function createCheckout(plan: string): Promise<CheckoutSession> {
  const res = await apiClient.post<CheckoutSession>('/billing/checkout', { plan });
  return res.data;
}

/** POST /billing/portal — returns Stripe Customer Portal URL */
export async function createPortal(): Promise<PortalSession> {
  const res = await apiClient.post<PortalSession>('/billing/portal');
  return res.data;
}
