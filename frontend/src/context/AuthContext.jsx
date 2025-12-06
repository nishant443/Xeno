import { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { login as loginRequest } from '../services/authService.js';

const STORAGE_KEY = 'xeno-auth';

const readPersistedUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to parse stored auth state', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  authLoading: false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readPersistedUser);
  const [authLoading, setAuthLoading] = useState(false);

  const login = useCallback(async ({ email, password }) => {
    setAuthLoading(true);
    try {
      const authResponse = await loginRequest({ email, password });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authResponse));
      setUser(authResponse);
      return authResponse;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    authLoading,
    login,
    logout
  }), [user, authLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
