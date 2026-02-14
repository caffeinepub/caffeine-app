import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Coffee } from 'lucide-react';
import { useGetUserData, useDeleteCaffeineEntry } from '../hooks/useQueries';
import { LoadingState, ErrorState, EmptyState } from '../components/app/QueryState';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function LogPage() {
  const { data: userData, isLoading, error } = useGetUserData();
  const deleteEntry = useDeleteCaffeineEntry();

  const handleDelete = async (entryId: bigint) => {
    try {
      await deleteEntry.mutateAsync(entryId);
      toast.success('Entry deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete entry');
      console.error(error);
    }
  };

  if (isLoading) return <LoadingState message="Loading your entries..." />;
  if (error) return <ErrorState error={error} />;

  const entries = userData?.entries || [];
  const sortedEntries = [...entries].sort((a, b) => Number(b.consumptionTime) - Number(a.consumptionTime));

  // Group entries by date
  const groupedEntries = sortedEntries.reduce((acc, entry) => {
    const date = new Date(Number(entry.consumptionTime));
    const dateKey = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">Caffeine Log</CardTitle>
              <CardDescription>View and manage all your caffeine entries</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {entries.length === 0 ? (
        <Card className="shadow-warm">
          <CardContent className="py-12">
            <EmptyState
              image="/assets/generated/caffeine-empty-state.dim_1200x800.png"
              title="No Entries Yet"
              description="Start tracking your caffeine intake by adding your first entry. Click the button below or use the quick-add feature on the Dashboard."
              action={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Entry
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEntries).map(([date, dateEntries]) => {
            const dayTotal = dateEntries.reduce((sum, entry) => sum + Number(entry.amountMg), 0);
            return (
              <Card key={date} className="shadow-warm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-serif text-lg">{date}</CardTitle>
                    <span className="text-sm font-semibold text-primary">{dayTotal}mg total</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dateEntries.map((entry) => (
                      <div
                        key={entry.id.toString()}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Coffee className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{entry.drinkName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(Number(entry.consumptionTime)).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <span className="font-semibold text-primary text-lg">
                            {entry.amountMg.toString()}mg
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(entry.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
