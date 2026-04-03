import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { create } from 'zustand';

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error';
}

interface ToastStore {
  toasts: ToastMessage[];
  push: (msg: Omit<ToastMessage, 'id'>) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  push: (msg) => set((s) => ({ toasts: [...s.toasts, { ...msg, id: ++counter }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Convenience helpers */
export const toast = {
  success: (title: string, description?: string) => useToast.getState().push({ title, description, variant: 'success' }),
  error:   (title: string, description?: string) => useToast.getState().push({ title, description, variant: 'error' }),
  info:    (title: string, description?: string) => useToast.getState().push({ title, description }),
};

export function ToastProvider() {
  const { toasts, dismiss } = useToast();
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          open
          onOpenChange={() => dismiss(t.id)}
          className={cn(
            'flex items-start gap-3 rounded-card p-4 shadow-lg border',
            t.variant === 'success' && 'border-green-200 bg-green-50 dark:bg-green-900/20',
            t.variant === 'error'   && 'border-red-200 bg-red-50 dark:bg-red-900/20',
            !t.variant              && 'border-gray-200 bg-white dark:bg-gray-800',
          )}
        >
          <div className="flex-1">
            <ToastPrimitive.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.title}</ToastPrimitive.Title>
            {t.description && <ToastPrimitive.Description className="mt-1 text-xs text-gray-500">{t.description}</ToastPrimitive.Description>}
          </div>
          <ToastPrimitive.Close className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80" />
    </ToastPrimitive.Provider>
  );
}
