import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();
const ADMIN_SESSION_KEY = 'sportsbook_admin_session';
const ADMIN_SESSION_TTL_MS = 6 * 60 * 60 * 1000;

function normalizeAdminUser(user) {
  const displayName = user?.name || user?.username || user?.email || 'Admin User';

  return {
    ...user,
    name: displayName,
    username: user?.username || displayName,
    role: user?.role ?? 1,
    roleName: user?.roleName || (user?.role === 1 ? 'admin' : user?.role),
  };
}

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session?.expiresAt || Date.now() >= session.expiresAt) {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }

    if (session.user) {
      session.user = normalizeAdminUser(session.user);
    }

    return session;
  } catch {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

function createSession(user) {
  const session = {
    user: normalizeAdminUser(user),
    token: `admin-dev-${Date.now()}`,
    expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
  };
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the AuthContext so it can be used directly
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => readStoredSession());

  const login = async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nextSession = createSession({
      username: credentials.email,
      role: 1,
    });
    setSession(nextSession);

    return { success: true };
  };

  const logout = () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setSession(null);
  };

  const testLogin = () => {
    setSession(
      createSession({
        username: 'admin',
        role: 1,
      }),
    );
  };

  useEffect(() => {
    if (!session?.expiresAt) return undefined;

    const timeoutMs = Math.max(0, session.expiresAt - Date.now());
    const timeout = window.setTimeout(() => {
      logout();
    }, timeoutMs);

    return () => window.clearTimeout(timeout);
  }, [session?.expiresAt]);

  const value = useMemo(() => ({
    isLoggedIn: Boolean(session),
    user: session?.user ?? null,
    token: session?.token ?? null,
    expiresAt: session?.expiresAt ?? null,
    login,
    logout,
    testLogin,
  }), [session]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
