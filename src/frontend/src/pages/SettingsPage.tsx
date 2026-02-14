import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGetUserData, useUpdateUserSettings } from '../hooks/useQueries';
import { LoadingState, ErrorState } from '../components/app/QueryState';
import PresetManager from '../components/caffeine/PresetManager';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const { data: userData, isLoading, error } = useGetUserData();
  const updateSettings = useUpdateUserSettings();
  const [dailyLimit, setDailyLimit] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyLimit) {
      toast.error('Please enter a daily limit');
      return;
    }

    try {
      await updateSettings.mutateAsync({
        dailyLimitMg: BigInt(parseInt(dailyLimit)),
      });
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    }
  };

  if (isLoading) return <LoadingState message="Loading settings..." />;
  if (error) return <ErrorState error={error} />;

  const currentLimit = Number(userData?.settings.dailyLimitMg || 400);

  return (
    <div className="space-y-6">
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Settings</CardTitle>
          <CardDescription>Manage your caffeine tracking preferences</CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-serif">Daily Caffeine Limit</CardTitle>
          <CardDescription>
            Set your target daily caffeine intake. The recommended limit for most adults is 400mg per day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit (mg)</Label>
              <Input
                id="dailyLimit"
                type="number"
                min="0"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder={currentLimit.toString()}
              />
              <p className="text-sm text-muted-foreground">
                Current limit: {currentLimit}mg
              </p>
            </div>
            <Button type="submit" disabled={updateSettings.isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <PresetManager presets={userData?.presets || []} />

      <Card className="shadow-warm bg-muted/30">
        <CardHeader>
          <CardTitle className="font-serif text-lg">About Caffeine Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Recommended daily limit:</strong> Up to 400mg for most healthy adults (about 4 cups of coffee)
          </p>
          <p>
            <strong>Pregnant individuals:</strong> Limit to 200mg per day
          </p>
          <p>
            <strong>Sensitive individuals:</strong> Consider lower limits if you experience jitters, anxiety, or sleep issues
          </p>
          <p className="text-xs pt-2">
            Note: These are general guidelines. Consult with a healthcare provider for personalized advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
