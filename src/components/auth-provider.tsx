"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { isFeatureEnabled } from "@/lib/feature-flags";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const authEnabled = isFeatureEnabled("GoogleAuth");
  const [loading, setLoading] = useState(authEnabled);
  // Track the last synced UID to avoid redundant session POSTs (e.g. on every page load
  // when the user is already logged in, or concurrent calls from multiple tabs).
  // undefined = not yet synced; null = synced as logged-out; string = synced UID.
  const lastSyncedUidRef = React.useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!authEnabled) {
      setUser(null);
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    const setupAuth = async () => {
      const [{ onAuthStateChanged }, { auth }] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase/client"),
      ]);

      unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
        setUser(nextUser);
        setLoading(false);

        const uid = nextUser?.uid ?? null;
        if (uid === lastSyncedUidRef.current) return;
        lastSyncedUidRef.current = uid;

        if (nextUser) {
          const token = await nextUser.getIdToken();
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await fetch("/api/auth/logout", { method: "POST" });
        }
      });
    };

    void setupAuth();

    return () => unsubscribe();
  }, [authEnabled]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
