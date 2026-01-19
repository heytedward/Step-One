
/**
 * Mocking RevenueCat for the MVP environment.
 * In a real Expo/React Native app, we would use:
 * import Purchases from 'purchases-react-native';
 */

export type PurchaseType = 'subscription' | 'lifetime' | null;

export const RevenueCatService = {
  getEntitlements: async () => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    const isPro = localStorage.getItem('is_pro_mock') === 'true';
    const type = localStorage.getItem('pro_type_mock') as PurchaseType;
    return { isPro, type };
  },
  purchaseMonthly: async () => {
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem('is_pro_mock', 'true');
    localStorage.setItem('pro_type_mock', 'subscription');
    return true;
  },
  purchaseLifetime: async () => {
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem('is_pro_mock', 'true');
    localStorage.setItem('pro_type_mock', 'lifetime');
    return true;
  },
  restorePurchases: async () => {
    await new Promise(r => setTimeout(r, 1000));
    const isPro = localStorage.getItem('is_pro_mock') === 'true';
    return isPro;
  }
};
