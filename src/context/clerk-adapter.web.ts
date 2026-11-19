import React from 'react';

export function ClerkProvider({ children }: { children: React.ReactNode; publishableKey?: string; tokenCache?: any }) {
  return React.createElement(React.Fragment, null, children);
}

export function useUser(): { user: any; isLoaded: boolean; isSignedIn: boolean } {
  return {
    user: null,
    isLoaded: true,
    isSignedIn: false,
  };
}

export function useAuth(): { isLoaded: boolean; isSignedIn: boolean; signOut: () => Promise<void> } {
  return {
    isLoaded: true,
    isSignedIn: false,
    signOut: async () => {},
  };
}

export function useSignIn(): {
  signIn: null;
  setActive: ((opts: any) => Promise<void>) | null;
  isLoaded: boolean;
} {
  return {
    signIn: null,
    setActive: null,
    isLoaded: true,
  };
}

export function useSignUp(): {
  signUp: null;
  setActive: ((opts: any) => Promise<void>) | null;
  isLoaded: boolean;
} {
  return {
    signUp: null,
    setActive: null,
    isLoaded: true,
  };
}
