import { ExternalLink, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMutation } from '@tanstack/react-query';
import { createCheckout, createPortal } from '@/api/billing';
import { toast } from '@/components/ui/Toast';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0/mo',
    features: ['Up to 10 tools', '5 scans/day', 'Email alerts', 'Basic dashboard'],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49/mo',
    features: ['Unlimited tools', 'Unlimited scans', 'Slack alerts', 'Advanced charts', 'CSV bulk import', 'API access'],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: ['Everything in Pro', 'SSO / SAML', 'Custom SLA', 'Dedicated support', 'On-prem option'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export function Billing() {
  const checkout = useMutation({
    mutationFn: (plan: string) => createCheckout(plan),
    onSuccess: (res) => { window.location.href = res.url; },
    onError: () => toast.error('Checkout failed', 'Please try again or contact support.'),
  });

  const portal = useMutation({
    mutationFn: createPortal,
    onSuccess: (res) => { window.open(res.url, '_blank'); },
    onError: () => toast.error('Could not open billing portal'),
  });

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Manage your subscription and payment methods.</p>
        <Button variant="outline" size="sm" onClick={() => portal.mutate()} loading={portal.isPending}>
          <ExternalLink className="h-4 w-4" /> Billing Portal
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={plan.highlight ? 'ring-2 ring-primary-500' : ''}>
            <CardHeader>
              {plan.highlight && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-full w-fit mb-1">
                  <Zap className="h-3 w-3" /> Most Popular
                </span>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-2xl font-bold text-gray-900 dark:text-gray-100">{plan.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlight ? 'primary' : 'outline'}
                onClick={() => plan.id !== 'free' && checkout.mutate(plan.id)}
                loading={checkout.isPending}
                disabled={plan.id === 'free'}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
