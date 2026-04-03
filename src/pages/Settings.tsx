import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { toast } from '@/components/ui/Toast';

export function Settings() {
  const { tenantId } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // Placeholder — wire to PATCH /tenants/{id} when endpoint is ready
    toast.success('Settings saved');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Org Settings */}
      <Card>
        <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Tenant ID" value={tenantId ?? ''} readOnly className="opacity-60" />
          <Input label="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Corp" />
          <Input label="Contact Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@acme.com" />
          <Button onClick={handleSave}><Save className="h-4 w-4" /> Save</Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              role="switch"
              aria-checked={darkMode}
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: 'critical', label: 'Critical severity alerts' },
            { id: 'weekly',   label: 'Weekly risk digest' },
            { id: 'new',      label: 'New tool scan complete' },
          ].map(({ id, label }) => (
            <label key={id} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="rounded" defaultChecked={id === 'critical'} />
              {label}
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
