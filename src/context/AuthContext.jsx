import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const ADMIN_SESSION_KEY = 'sportsbook_admin_session';
const ADMIN_SESSION_TTL_MS = 6 * 60 * 60 * 1000;
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://127.0.0.1:3002';

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

function createSession(user, token) {
  const session = {
    user: normalizeAdminUser(user),
    token,
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
    const response = await axios.post(`${ADMIN_API_BASE_URL}/admin/auth/login`, {
      emailOrUsername: credentials.email,
      password: credentials.password,
    });
    const payload = response.data?.data ?? response.data;

    if (!payload?.token || !payload?.admin) {
      throw new Error('Admin login response is invalid');
    }

    const nextSession = createSession(payload.admin, payload.token);
    setSession(nextSession);

    return { success: true };
  };

  const logout = () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setSession(null);
  };

  const testLogin = () => {
    throw new Error("Development bypass is disabled. Use valid admin credentials.");
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
