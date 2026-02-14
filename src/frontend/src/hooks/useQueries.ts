import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserData, UserProfile, CaffeineEntry, CaffeinePreset, UserSettings } from '../backend';

export function useGetUserData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserData>({
    queryKey: ['userData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserData();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddCaffeineEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ drinkName, amountMg, consumptionTime }: { drinkName: string; amountMg: number; consumptionTime: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCaffeineEntry(drinkName, BigInt(amountMg), BigInt(consumptionTime));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useDeleteCaffeineEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCaffeineEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useAddCaffeinePreset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ drinkName, defaultAmountMg }: { drinkName: string; defaultAmountMg: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCaffeinePreset(drinkName, BigInt(defaultAmountMg));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useUpdateUserSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}
