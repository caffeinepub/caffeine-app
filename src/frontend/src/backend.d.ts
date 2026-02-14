import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserSettings {
    dailyLimitMg: bigint;
}
export interface CaffeineEntry {
    id: bigint;
    amountMg: bigint;
    consumptionTime: bigint;
    drinkName: string;
}
export interface UserData {
    presets: Array<CaffeinePreset>;
    entries: Array<CaffeineEntry>;
    settings: UserSettings;
}
export interface UserProfile {
    name: string;
}
export interface CaffeinePreset {
    id: bigint;
    defaultAmountMg: bigint;
    drinkName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCaffeineEntry(drinkName: string, amountMg: bigint, consumptionTime: bigint): Promise<CaffeineEntry>;
    addCaffeinePreset(drinkName: string, defaultAmountMg: bigint): Promise<CaffeinePreset>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCaffeineEntry(entryId: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserData(): Promise<UserData>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateUserSettings(newSettings: UserSettings): Promise<void>;
}
