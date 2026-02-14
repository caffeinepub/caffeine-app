import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Coffee } from 'lucide-react';
import { useAddCaffeinePreset } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { CaffeinePreset } from '../../backend';

interface PresetManagerProps {
  presets: CaffeinePreset[];
}

export default function PresetManager({ presets }: PresetManagerProps) {
  const [drinkName, setDrinkName] = useState('');
  const [defaultAmountMg, setDefaultAmountMg] = useState('');
  const addPreset = useAddCaffeinePreset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drinkName.trim() || !defaultAmountMg) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addPreset.mutateAsync({
        drinkName: drinkName.trim(),
        defaultAmountMg: parseInt(defaultAmountMg),
      });
      toast.success('Preset added successfully!');
      setDrinkName('');
      setDefaultAmountMg('');
    } catch (error) {
      toast.error('Failed to add preset');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Drink Presets</CardTitle>
        <CardDescription>
          Create quick-add presets for your favorite caffeinated drinks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="presetDrinkName">Drink Name</Label>
              <Input
                id="presetDrinkName"
                value={drinkName}
                onChange={(e) => setDrinkName(e.target.value)}
                placeholder="e.g., Morning Espresso"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presetAmount">Caffeine (mg)</Label>
              <Input
                id="presetAmount"
                type="number"
                min="0"
                value={defaultAmountMg}
                onChange={(e) => setDefaultAmountMg(e.target.value)}
                placeholder="e.g., 95"
              />
            </div>
          </div>
          <Button type="submit" disabled={addPreset.isPending} className="gap-2">
            <Plus className="h-4 w-4" />
            {addPreset.isPending ? 'Adding...' : 'Add Preset'}
          </Button>
        </form>

        {presets.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Your Presets</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => (
                <div
                  key={preset.id.toString()}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Coffee className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{preset.drinkName}</p>
                    <p className="text-xs text-muted-foreground">{preset.defaultAmountMg.toString()}mg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
