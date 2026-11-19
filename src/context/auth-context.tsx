import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { ClerkProvider, useUser, useAuth } from './clerk-adapter';
import { tokenCache } from '@/utils/cache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const STORAGE_PROFILE_KEY = 'recurly_user_profile_cache';

export interface AuthUser {
  id: string;
  fullName: string | null;
  primaryEmailAddress?: { emailAddress: string } | null;
  imageUrl?: string | null;
}

export function formatDisplayName(rawName?: string | null, email?: string | null): string {
  if (rawName && rawName.trim().length > 0) {
    return rawName.trim();
  }
  if (email && email.includes('@')) {
    const prefix = email.split('@')[0];
    const parts = prefix.split(/[._-]+/).filter(Boolean);
    if (parts.length > 0) {
      return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return 'Guest User';
}

async function saveToStorage(data: any) {
  try {
    const val = JSON.stringify(data);
    if (Platform.OS !== 'web') {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.setItemAsync(STORAGE_PROFILE_KEY, val);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_PROFILE_KEY, val);
    }
  } catch {}
}

async function loadFromStorage(): Promise<{ name?: string; email?: string; isLoggedIn?: boolean } | null> {
  try {
    let raw: string | null = null;
    if (Platform.OS !== 'web') {
      const SecureStore = await import('expo-secure-store');
      raw = await SecureStore.getItemAsync(STORAGE_PROFILE_KEY);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      raw = window.localStorage.getItem(STORAGE_PROFILE_KEY);
    }
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

async function clearFromStorage() {
  try {
    if (Platform.OS !== 'web') {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.deleteItemAsync(STORAGE_PROFILE_KEY);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_PROFILE_KEY);
    }
  } catch {}
}

interface AppAuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AuthUser | null;
  isClerkConfigured: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
  setUserProfile: (profile: { name?: string; email?: string; isLoggedIn?: boolean }) => Promise<void>;
}

const AppAuthContext = createContext<AppAuthContextType>({
  isLoaded: true,
  isSignedIn: true,
  user: {
    id: 'demo_user',
    fullName: 'Guest User',
    primaryEmailAddress: { emailAddress: 'guest@recurly.app' },
    imageUrl: null,
  },
  isClerkConfigured: false,
  signOut: async () => {},
  signInAsGuest: () => {},
  setUserProfile: async () => {},
});

function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: isUserLoaded, isSignedIn: isClerkSignedIn } = useUser();
  const { signOut: clerkSignOut } = useAuth();
  const [customProfile, setCustomProfile] = useState<{ name?: string; email?: string; isLoggedIn?: boolean } | null>(null);
  const [guestUser, setGuestUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    loadFromStorage().then((saved) => {
      if (saved) {
        setCustomProfile(saved);
      }
    });
  }, []);

  const setUserProfile = async (profile: { name?: string; email?: string; isLoggedIn?: boolean }) => {
    setCustomProfile((prev) => {
      const updated = { ...prev, ...profile };
      saveToStorage(updated);
      return updated;
    });
  };

  const isLoaded = isUserLoaded;
  const isSignedIn = Boolean(isClerkSignedIn || guestUser !== null || customProfile?.isLoggedIn);

  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  const activeEmail = clerkEmail || customProfile?.email || guestUser?.primaryEmailAddress?.emailAddress || null;

  const resolvedName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
    clerkUser?.firstName ||
    customProfile?.name ||
    guestUser?.fullName ||
    (activeEmail ? formatDisplayName(null, activeEmail) : null);

  const user: AuthUser | null = isSignedIn
    ? {
        id: clerkUser?.id || (guestUser ? guestUser.id : 'user_active'),
        fullName: resolvedName || 'User',
        primaryEmailAddress: activeEmail ? { emailAddress: activeEmail } : null,
        imageUrl: clerkUser?.imageUrl || null,
      }
    : null;

  const signOut = async () => {
    if (isClerkSignedIn) {
      try {
        await clerkSignOut();
      } catch {}
    }
    setGuestUser(null);
    setCustomProfile(null);
    await clearFromStorage();
  };

  const signInAsGuest = () => {
    const guest: AuthUser = {
      id: 'demo_user',
      fullName: 'Guest User',
      primaryEmailAddress: { emailAddress: 'guest@recurly.app' },
      imageUrl: null,
    };
    setGuestUser(guest);
    setUserProfile({ name: 'Guest User', email: 'guest@recurly.app', isLoggedIn: true });
  };

  return (
    <AppAuthContext.Provider
      value={{
        isLoaded,
        isSignedIn,
        user,
        isClerkConfigured: true,
        signOut,
        signInAsGuest,
        setUserProfile,
      }}>
      {children}
    </AppAuthContext.Provider>
  );
}

function LocalAuthBridge({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [user, setUser] = useState<AuthUser | null>({
    id: 'demo_user',
    fullName: 'Guest User',
    primaryEmailAddress: { emailAddress: 'guest@recurly.app' },
    imageUrl: null,
  });

  useEffect(() => {
    loadFromStorage().then((saved) => {
      if (saved) {
        setUser({
          id: 'saved_user',
          fullName: formatDisplayName(saved.name, saved.email),
          primaryEmailAddress: saved.email ? { emailAddress: saved.email } : null,
          imageUrl: null,
        });
        if (typeof saved.isLoggedIn === 'boolean') {
          setIsSignedIn(saved.isLoggedIn);
        }
      }
    });
  }, []);

  const setUserProfile = async (profile: { name?: string; email?: string; isLoggedIn?: boolean }) => {
    setUser((prev) => ({
      id: prev?.id || 'saved_user',
      fullName: formatDisplayName(profile.name || prev?.fullName, profile.email || prev?.primaryEmailAddress?.emailAddress),
      primaryEmailAddress: profile.email
        ? { emailAddress: profile.email }
        : prev?.primaryEmailAddress || null,
      imageUrl: null,
    }));
    if (typeof profile.isLoggedIn === 'boolean') {
      setIsSignedIn(profile.isLoggedIn);
    }
    await saveToStorage(profile);
  };

  const signOut = async () => {
    setIsSignedIn(false);
    setUser(null);
    await clearFromStorage();
  };

  const signInAsGuest = () => {
    setIsSignedIn(true);
    setUser({
      id: 'demo_user',
      fullName: 'Guest User',
      primaryEmailAddress: { emailAddress: 'guest@recurly.app' },
      imageUrl: null,
    });
    saveToStorage({ name: 'Guest User', email: 'guest@recurly.app', isLoggedIn: true });
  };

  return (
    <AppAuthContext.Provider
      value={{
        isLoaded: true,
        isSignedIn,
        user,
        isClerkConfigured: false,
        signOut,
        signInAsGuest,
        setUserProfile,
      }}>
      {children}
    </AppAuthContext.Provider>
  );
}

class ClerkErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('Clerk auth failed on platform, falling back to local auth mode:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web' && publishableKey) {
    return (
      <ClerkErrorBoundary fallback={<LocalAuthBridge>{children}</LocalAuthBridge>}>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkAuthBridge>{children}</ClerkAuthBridge>
        </ClerkProvider>
      </ClerkErrorBoundary>
    );
  }

  return <LocalAuthBridge>{children}</LocalAuthBridge>;
}

export function useAppAuth() {
  return useContext(AppAuthContext);
}
