import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/app/AppShell';
import RequireAuth from './components/auth/RequireAuth';
import DashboardPage from './pages/DashboardPage';
import LogPage from './pages/LogPage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';

const rootRoute = createRootRoute({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Outlet />
      </AppShell>
    </RequireAuth>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage
});

const logRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log',
  component: LogPage
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: InsightsPage
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  logRoute,
  insightsRoute,
  settingsRoute
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
