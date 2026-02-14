import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Coffee, TrendingUp, AlertCircle } from 'lucide-react';
import { useGetUserData, useAddCaffeineEntry } from '../hooks/useQueries';
import { LoadingState, ErrorState } from '../components/app/QueryState';
import EntryFormDialog from '../components/caffeine/EntryFormDialog';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data: userData, isLoading, error } = useGetUserData();
  const addEntry = useAddCaffeineEntry();
  const [showEntryDialog, setShowEntryDialog] = useState(false);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayEntries = userData?.entries.filter(entry => {
    const entryTime = Number(entry.consumptionTime);
    return entryTime >= todayStart.getTime() && entryTime <= todayEnd.getTime();
  }) || [];

  const todayTotal = todayEntries.reduce((sum, entry) => sum + Number(entry.amountMg), 0);
  const dailyLimit = Number(userData?.settings.dailyLimitMg || 400);
  const remaining = Math.max(0, dailyLimit - todayTotal);
  const percentUsed = dailyLimit > 0 ? (todayTotal / dailyLimit) * 100 : 0;

  const handleAddEntry = async (data: { drinkName: string; amountMg: number; consumptionTime: number }) => {
    try {
      await addEntry.mutateAsync(data);
      toast.success('Entry added successfully!');
    } catch (error) {
      toast.error('Failed to add entry');
      throw error;
    }
  };

  if (isLoading) return <LoadingState message="Loading your dashboard..." />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-8 border shadow-warm">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <img 
            src="/assets/generated/caffeine-hero.dim_1600x900.png" 
            alt="Caffeine Tracker" 
            className="w-full md:w-64 h-auto rounded-lg shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Track Your Caffeine
            </h2>
            <p className="text-muted-foreground text-lg">
              Stay energized and healthy by monitoring your daily intake
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-warm">
          <CardHeader className="pb-3">
            <CardDescription>Today's Total</CardDescription>
            <CardTitle className="font-serif text-4xl">{todayTotal}mg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4" />
              {todayEntries.length} {todayEntries.length === 1 ? 'entry' : 'entries'} today
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-warm">
          <CardHeader className="pb-3">
            <CardDescription>Daily Limit</CardDescription>
            <CardTitle className="font-serif text-4xl">{dailyLimit}mg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              {percentUsed.toFixed(0)}% used
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-warm ${todayTotal > dailyLimit ? 'border-destructive' : ''}`}>
          <CardHeader className="pb-3">
            <CardDescription>Remaining</CardDescription>
            <CardTitle className={`font-serif text-4xl ${todayTotal > dailyLimit ? 'text-destructive' : ''}`}>
              {remaining}mg
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayTotal > dailyLimit ? (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                Over limit
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coffee className="h-4 w-4" />
                Stay within range
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif">Quick Add</CardTitle>
              <CardDescription>Log your caffeine intake quickly</CardDescription>
            </div>
            <Button onClick={() => setShowEntryDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todayEntries.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Entries Today</h4>
              {todayEntries.slice(0, 3).map((entry) => (
                <div key={entry.id.toString()} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Coffee className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{entry.drinkName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(Number(entry.consumptionTime)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">{entry.amountMg.toString()}mg</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No entries yet today. Click "Add Entry" to get started!
            </p>
          )}
        </CardContent>
      </Card>

      <EntryFormDialog
        open={showEntryDialog}
        onOpenChange={setShowEntryDialog}
        onSubmit={handleAddEntry}
        presets={userData?.presets || []}
      />
    </div>
  );
}
