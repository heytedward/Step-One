
export type Ambition = 'Travel' | 'Business' | 'Hobby' | 'Health';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  level: number;
  isPremium: boolean;
  icon: string;
}

export interface Stamp {
  id: string;
  challengeId: string;
  date: string;
  icon: string;
  color: string;
}

export interface UserState {
  hasCompletedOnboarding: boolean;
  userAmbition: Ambition | null;
  streak: number;
  lastCompletionDate: string | null;
  completedFoundationIds: string[]; // Resets daily
  completedJourneyDay: number; // Sequential progress
  stamps: Stamp[];
  isPro: boolean;
  level: number;
  isGuest: boolean;
  userId: string | null;
}

export enum Tab {
  Today = 'Today',
  Passport = 'Passport',
  Settings = 'Settings'
}
