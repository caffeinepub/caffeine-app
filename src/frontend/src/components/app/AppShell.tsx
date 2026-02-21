import { ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Coffee, LayoutDashboard, ListChecks, TrendingUp, Settings } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { SiX, SiFacebook } from 'react-icons/si';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/log', label: 'Log', icon: ListChecks },
    { path: '/insights', label: 'Insights', icon: TrendingUp },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname || 'caffeine-tracker')
    : 'caffeine-tracker';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/caffeine-logo.dim_512x512.png" 
              alt="Caffeine Tracker Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">Caffeine Tracker</h1>
              {userProfile && (
                <p className="text-xs text-muted-foreground">Welcome, {userProfile.name}</p>
              )}
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-6">
        {children}
      </main>

      <footer className="border-t bg-card/50 backdrop-blur py-6 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Caffeine Tracker. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-3" role="presentation">
              <span className="text-muted-foreground" aria-hidden="true">
                <SiX className="h-4 w-4" />
              </span>
              <span className="text-muted-foreground" aria-hidden="true">
                <SiFacebook className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
