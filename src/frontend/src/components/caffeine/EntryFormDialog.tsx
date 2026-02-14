import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CaffeinePreset } from '../../backend';

interface EntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { drinkName: string; amountMg: number; consumptionTime: number }) => Promise<void>;
  presets: CaffeinePreset[];
  initialData?: {
    drinkName: string;
    amountMg: number;
  };
}

export default function EntryFormDialog({ open, onOpenChange, onSubmit, presets, initialData }: EntryFormDialogProps) {
  const [drinkName, setDrinkName] = useState('');
  const [amountMg, setAmountMg] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDrinkName(initialData.drinkName);
      setAmountMg(initialData.amountMg.toString());
    } else if (open) {
      setDrinkName('');
      setAmountMg('');
      setSelectedPreset('');
    }
  }, [open, initialData]);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'custom') {
      setDrinkName('');
      setAmountMg('');
      return;
    }
    const preset = presets.find(p => p.id.toString() === presetId);
    if (preset) {
      setDrinkName(preset.drinkName);
      setAmountMg(preset.defaultAmountMg.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drinkName.trim() || !amountMg) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        drinkName: drinkName.trim(),
        amountMg: parseInt(amountMg),
        consumptionTime: Date.now(),
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Caffeine Entry</DialogTitle>
            <DialogDescription>
              Log your caffeine intake to track your daily consumption
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {presets.length > 0 && !initialData && (
              <div className="space-y-2">
                <Label htmlFor="preset">Quick Select</Label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger id="preset">
                    <SelectValue placeholder="Choose a preset or custom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Entry</SelectItem>
                    {presets.map((preset) => (
                      <SelectItem key={preset.id.toString()} value={preset.id.toString()}>
                        {preset.drinkName} ({preset.defaultAmountMg.toString()}mg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="drinkName">Drink Name</Label>
              <Input
                id="drinkName"
                value={drinkName}
                onChange={(e) => setDrinkName(e.target.value)}
                placeholder="e.g., Espresso, Latte, Energy Drink"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountMg">Caffeine Amount (mg)</Label>
              <Input
                id="amountMg"
                type="number"
                min="0"
                value={amountMg}
                onChange={(e) => setAmountMg(e.target.value)}
                placeholder="e.g., 95"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
