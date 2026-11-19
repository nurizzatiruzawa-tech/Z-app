import { create } from 'zustand';
import { Platform } from 'react-native';
import {
  CURRENCIES,
  getCurrencySymbol,
  formatCurrency,
  CurrencyOption,
} from '@/utils/currency';

export { CURRENCIES, getCurrencySymbol, formatCurrency, CurrencyOption };

export interface SubscriptionItem {
  id: number | string;
  userId: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  renewalDate: string; // YYYY-MM-DD
  daysLeft: number;
  isActive: boolean;
  remindDaysBefore: number;
  paymentMethod?: string; // e.g. "Visa •••• 4242", "Apple Pay", "Mastercard"
  cardColor: string; // Pastel/brand card background color
  iconColor: string;
  logoType?: 'adobe' | 'spotify' | 'notion' | 'dropbox' | 'openai' | 'medium' | 'generic';
  notes?: string | null;
}

export const SUBSCRIPTION_CATEGORIES = [
  { id: 'All', label: 'All', color: '#F1654C' },
  { id: 'Design', label: 'Design', color: '#F7D267' },
  { id: 'Productivity', label: 'Productivity', color: '#BFDCF6' },
  { id: 'Music', label: 'Music', color: '#22c55e' },
  { id: 'Cloud', label: 'Cloud', color: '#38bdf8' },
  { id: 'Entertainment', label: 'Entertainment', color: '#f87171' },
] as const;

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 1,
    userId: 'demo_user',
    name: 'Adobe Creative Cloud',
    price: 77.49,
    currency: 'USD',
    category: 'Design',
    billingCycle: 'monthly',
    renewalDate: '2026-06-25',
    daysLeft: 14,
    isActive: true,
    remindDaysBefore: 3,
    paymentMethod: 'Mastercard •••• 8821',
    cardColor: '#F7D267', // Golden Yellow from Figma
    iconColor: '#000000',
    logoType: 'adobe',
    notes: 'All Apps photography & design suite',
  },
  {
    id: 2,
    userId: 'demo_user',
    name: 'Open AI',
    price: 42.25,
    currency: 'USD',
    category: 'Productivity',
    billingCycle: 'monthly',
    renewalDate: '2026-06-05',
    daysLeft: 8,
    isActive: true,
    remindDaysBefore: 3,
    paymentMethod: 'Visa •••• 4242',
    cardColor: '#BFDCF6', // Soft Sky Blue from Figma
    iconColor: '#0f172a',
    logoType: 'openai',
    notes: 'ChatGPT Plus & API usage credits',
  },
  {
    id: 3,
    userId: 'demo_user',
    name: 'Medium',
    price: 13.08,
    currency: 'USD',
    category: 'Productivity',
    billingCycle: 'monthly',
    renewalDate: '2026-06-12',
    daysLeft: 12,
    isActive: true,
    remindDaysBefore: 2,
    paymentMethod: 'PayPal',
    cardColor: '#C4E4D8', // Soft Mint Green from Figma
    iconColor: '#000000',
    logoType: 'medium',
    notes: 'Unlimited membership reading',
  },
  {
    id: 4,
    userId: 'demo_user',
    name: 'Spotify',
    price: 5.99,
    currency: 'USD',
    category: 'Music',
    billingCycle: 'monthly',
    renewalDate: '2026-11-18',
    daysLeft: 2,
    isActive: true,
    remindDaysBefore: 2,
    paymentMethod: 'Apple Pay',
    cardColor: '#D7F0DC',
    iconColor: '#1DB954',
    logoType: 'spotify',
    notes: 'Student Premium subscription',
  },
  {
    id: 5,
    userId: 'demo_user',
    name: 'Notion',
    price: 12.0,
    currency: 'USD',
    category: 'Productivity',
    billingCycle: 'monthly',
    renewalDate: '2026-11-20',
    daysLeft: 4,
    isActive: true,
    remindDaysBefore: 2,
    paymentMethod: 'Visa •••• 4242',
    cardColor: '#EFE8DE',
    iconColor: '#000000',
    logoType: 'notion',
    notes: 'Workspace Plus plan',
  },
  {
    id: 6,
    userId: 'demo_user',
    name: 'Dropbox',
    price: 10.0,
    currency: 'USD',
    category: 'Cloud',
    billingCycle: 'monthly',
    renewalDate: '2026-12-18',
    daysLeft: 32,
    isActive: true,
    remindDaysBefore: 5,
    paymentMethod: 'Google Pay',
    cardColor: '#D8E8F8',
    iconColor: '#0061FF',
    logoType: 'dropbox',
    notes: 'Cloud backup storage',
  },
];

export const UPCOMING_PRESETS = [
  {
    name: 'Spotify',
    price: 5.99,
    daysLeft: '2 days left',
    logoType: 'spotify',
  },
  {
    name: 'Notion',
    price: 12.0,
    daysLeft: '4 days left',
    logoType: 'notion',
  },
  {
    name: 'Dropbox',
    price: 10.0,
    daysLeft: '32 days left',
    logoType: 'dropbox',
  },
];

export const POPULAR_PRESETS = [
  {
    name: 'Netflix',
    price: 15.49,
    currency: 'USD',
    category: 'Entertainment',
    billingCycle: 'monthly' as const,
    renewalDate: '2026-11-28',
    remindDaysBefore: 3,
    paymentMethod: 'Mastercard •••• 8821',
    iconColor: '#E50914',
    cardColor: '#FEE2E2',
    notes: 'Premium 4K streaming plan',
  },
  {
    name: 'Spotify',
    price: 5.99,
    currency: 'USD',
    category: 'Music',
    billingCycle: 'monthly' as const,
    renewalDate: '2026-11-18',
    remindDaysBefore: 2,
    paymentMethod: 'Apple Pay',
    iconColor: '#1DB954',
    cardColor: '#D7F0DC',
    notes: 'Student Premium subscription',
  },
  {
    name: 'Adobe Creative Cloud',
    price: 77.49,
    currency: 'USD',
    category: 'Design',
    billingCycle: 'monthly' as const,
    renewalDate: '2026-06-25',
    remindDaysBefore: 3,
    paymentMethod: 'Mastercard •••• 8821',
    iconColor: '#000000',
    cardColor: '#F7D267',
    notes: 'All Apps photography & design suite',
  },
  {
    name: 'Open AI',
    price: 42.25,
    currency: 'USD',
    category: 'Productivity',
    billingCycle: 'monthly' as const,
    renewalDate: '2026-06-05',
    remindDaysBefore: 3,
    paymentMethod: 'Visa •••• 4242',
    iconColor: '#0f172a',
    cardColor: '#BFDCF6',
    notes: 'ChatGPT Plus & API usage credits',
  },
  {
    name: 'Notion',
    price: 12.0,
    currency: 'USD',
    category: 'Productivity',
    billingCycle: 'monthly' as const,
    renewalDate: '2026-11-20',
    remindDaysBefore: 2,
    paymentMethod: 'Visa •••• 4242',
    iconColor: '#000000',
    cardColor: '#EFE8DE',
    notes: 'Workspace Plus plan',
  },
  {
    name: 'Dropbox',
    price: 10.0,
    currency: 'USD',
    category: 'Cloud',
    billingCycle: 'monthly' as const,
    renewalDate: '2026-12-18',
    remindDaysBefore: 5,
    paymentMethod: 'Google Pay',
    iconColor: '#0061FF',
    cardColor: '#D8E8F8',
    notes: 'Cloud backup storage',
  },
];

export const PAYMENT_METHODS = [
  'Visa •••• 4242',
  'Mastercard •••• 8821',
  'Apple Pay',
  'Google Pay',
  'PayPal',
  'FPX / Online Banking',
  'Cash / Debit',
] as const;

export type SubscriptionItemInput = Omit<
  SubscriptionItem,
  'id' | 'userId' | 'isActive' | 'daysLeft' | 'cardColor'
> & {
  isActive?: boolean;
  daysLeft?: number;
  cardColor?: string;
  paymentMethod?: string;
};

interface SubscriptionState {
  subscriptions: SubscriptionItem[];
  selectedCategory: string;
  searchQuery: string;
  activeFilter: 'all' | 'active' | 'inactive';
  currency: string;
  balance: number;
  isLoading: boolean;
  error: string | null;

  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: 'all' | 'active' | 'inactive') => void;
  setCurrency: (currency: string) => void;
  initCurrency: () => Promise<void>;

  fetchSubscriptions: (userId?: string) => Promise<void>;
  addSubscription: (
    item: SubscriptionItemInput,
    userId?: string
  ) => Promise<void>;
  updateSubscription: (id: number | string, item: Partial<SubscriptionItem>) => Promise<void>;
  deleteSubscription: (id: number | string) => Promise<void>;
  toggleActive: (id: number | string) => Promise<void>;

  getTotalMonthlySpend: () => number;
  getTotalYearlySpend: () => number;
  getActiveCount: () => number;
}

const STORAGE_CURRENCY_KEY = 'recurly_preferred_currency';

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: INITIAL_SUBSCRIPTIONS,
  selectedCategory: 'All',
  searchQuery: '',
  activeFilter: 'all',
  currency: 'USD',
  balance: 2489.48, // As shown in the tutorial screenshot
  isLoading: false,
  error: null,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  setCurrency: (currency) => {
    set({ currency });
    try {
      if (Platform.OS !== 'web') {
        import('expo-secure-store').then((SecureStore) => {
          SecureStore.setItemAsync(STORAGE_CURRENCY_KEY, currency).catch(() => {});
        }).catch(() => {});
      } else if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_CURRENCY_KEY, currency);
      }
    } catch {
      // Ignored
    }
  },

  initCurrency: async () => {
    try {
      if (Platform.OS !== 'web') {
        const SecureStore = await import('expo-secure-store');
        const saved = await SecureStore.getItemAsync(STORAGE_CURRENCY_KEY);
        if (saved) {
          set({ currency: saved });
        }
      } else if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_CURRENCY_KEY);
        if (saved) {
          set({ currency: saved });
        }
      }
    } catch {
      // Ignored
    }
  },

  fetchSubscriptions: async (userId = 'demo_user') => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/subscriptions?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map((d, index) => ({
            ...d,
            price: parseFloat(d.price) || 0,
            cardColor: d.cardColor || INITIAL_SUBSCRIPTIONS[index % INITIAL_SUBSCRIPTIONS.length].cardColor,
            daysLeft: d.daysLeft || 7,
            paymentMethod: d.paymentMethod || INITIAL_SUBSCRIPTIONS[index % INITIAL_SUBSCRIPTIONS.length].paymentMethod || 'Credit Card',
          }));
          set({ subscriptions: parsed, isLoading: false });
          return;
        }
      }
      set({ isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addSubscription: async (item, userId = 'demo_user') => {
    const newSub: SubscriptionItem = {
      ...item,
      id: Date.now(),
      userId,
      isActive: item.isActive ?? true,
      daysLeft: item.daysLeft || 14,
      paymentMethod: item.paymentMethod || 'Visa •••• 4242',
      cardColor: item.cardColor || '#BFDCF6',
    };

    set((state) => ({
      subscriptions: [newSub, ...state.subscriptions],
    }));

    try {
      await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          userId,
          price: item.price.toString(),
        }),
      });
    } catch {
      // Retained in local store
    }
  },

  updateSubscription: async (id, updatedFields) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s
      ),
    }));

    try {
      await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
    } catch {
      // Handled optimistically
    }
  },

  deleteSubscription: async (id) => {
    set((state) => ({
      subscriptions: state.subscriptions.filter((s) => s.id !== id),
    }));

    try {
      await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // Handled optimistically
    }
  },

  toggleActive: async (id) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const newStatus = !sub.isActive;

    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === id ? { ...s, isActive: newStatus } : s
      ),
    }));

    try {
      await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
    } catch {
      // Handled optimistically
    }
  },

  getTotalMonthlySpend: () => {
    const { subscriptions } = get();
    return subscriptions
      .filter((s) => s.isActive)
      .reduce((total, s) => {
        if (s.billingCycle === 'yearly') {
          return total + s.price / 12;
        } else if (s.billingCycle === 'weekly') {
          return total + s.price * 4.33;
        }
        return total + s.price;
      }, 0);
  },

  getTotalYearlySpend: () => {
    return get().getTotalMonthlySpend() * 12;
  },

  getActiveCount: () => {
    return get().subscriptions.filter((s) => s.isActive).length;
  },
}));
