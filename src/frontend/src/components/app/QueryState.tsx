import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Coffee } from 'lucide-react';
import { ReactNode } from 'react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Coffee className="h-5 w-5 text-primary animate-pulse" />
        <p className="text-muted-foreground">{message}</p>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: Error | null;
  title?: string;
}

export function ErrorState({ error, title = 'Error Loading Data' }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </AlertDescription>
    </Alert>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  image?: string;
}

export function EmptyState({ icon, title, description, action, image }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {image ? (
        <img src={image} alt={title} className="w-64 h-auto mb-6 opacity-80" />
      ) : (
        icon && <div className="mb-4">{icon}</div>
      )}
      <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}
