import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetUserData } from '../hooks/useQueries';
import { LoadingState, ErrorState, EmptyState } from '../components/app/QueryState';
import TrendChart7d from '../components/caffeine/TrendChart7d';
import { TrendingUp, Calendar, Coffee } from 'lucide-react';

export default function InsightsPage() {
  const { data: userData, isLoading, error } = useGetUserData();

  if (isLoading) return <LoadingState message="Loading your insights..." />;
  if (error) return <ErrorState error={error} />;

  const entries = userData?.entries || [];
  const dailyLimit = Number(userData?.settings.dailyLimitMg || 400);

  // Calculate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const dailyTotals = last7Days.map(date => {
    const dayStart = date.getTime();
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const dayEndTime = dayEnd.getTime();

    const dayEntries = entries.filter(entry => {
      const entryTime = Number(entry.consumptionTime);
      return entryTime >= dayStart && entryTime <= dayEndTime;
    });

    const total = dayEntries.reduce((sum, entry) => sum + Number(entry.amountMg), 0);

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total,
    };
  });

  const weekTotal = dailyTotals.reduce((sum, day) => sum + day.total, 0);
  const weekAverage = Math.round(weekTotal / 7);
  const daysOverLimit = dailyTotals.filter(day => day.total > dailyLimit).length;

  if (entries.length === 0) {
    return (
      <Card className="shadow-warm">
        <CardContent className="py-12">
          <EmptyState
            icon={<TrendingUp className="h-16 w-16 text-muted-foreground" />}
            title="No Data Yet"
            description="Start logging your caffeine intake to see insights and trends over time."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">7-Day Insights</CardTitle>
          <CardDescription>Your caffeine consumption trends over the past week</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-warm">
          <CardHeader className="pb-3">
            <CardDescription>Week Total</CardDescription>
            <CardTitle className="font-serif text-3xl">{weekTotal}mg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4" />
              Last 7 days
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-warm">
          <CardHeader className="pb-3">
            <CardDescription>Daily Average</CardDescription>
            <CardTitle className="font-serif text-3xl">{weekAverage}mg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Per day
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-warm ${daysOverLimit > 0 ? 'border-destructive' : ''}`}>
          <CardHeader className="pb-3">
            <CardDescription>Days Over Limit</CardDescription>
            <CardTitle className={`font-serif text-3xl ${daysOverLimit > 0 ? 'text-destructive' : ''}`}>
              {daysOverLimit}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Out of 7 days
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-serif">Daily Consumption Trend</CardTitle>
          <CardDescription>Caffeine intake over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <TrendChart7d dailyTotals={dailyTotals} dailyLimit={dailyLimit} />
        </CardContent>
      </Card>
    </div>
  );
}
