
import { UserState } from '../types';

const STORAGE_KEY = 'step_one_user_state';

const DEFAULT_STATE: UserState = {
  hasCompletedOnboarding: false,
  userAmbition: null,
  streak: 0,
  lastCompletionDate: null,
  completedFoundationIds: [],
  completedJourneyDay: 0,
  stamps: [],
  isPro: false,
  level: 1,
  isGuest: true,
  userId: null
};

export const StorageService = {
  saveState: (state: UserState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  loadState: (): UserState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  },
  clearState: () => {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_STATE;
  }
};
