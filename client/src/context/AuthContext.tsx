import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../lib/api';

interface SiteConfig {
  site_name: string;
  site_tagline: string;
}

interface AuthContextType {
  initialized: boolean | null;
  authenticated: boolean;
  token: string | null;
  config: SiteConfig;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('humor_token'));
  const [config, setConfig] = useState<SiteConfig>({ site_name: 'Humor.', site_tagline: 'Mindful shit or horseshit. You decide.' });

  const clearToken = () => {
    localStorage.removeItem('humor_token');
    setToken(null);
    setAuthenticated(false);
  };

  const refreshStatus = async () => {
    try {
      const res = await fetch(apiUrl('/api/status'), {
        headers: token ? { 'Authorization': token } : {}
      });
      if (!res.ok) {
        throw new Error(`Status request failed: ${res.status}`);
      }
      const data = await res.json();
      setInitialized(data.initialized);
      setAuthenticated(!!data.authenticated);
      if (data.config) setConfig(data.config);
      if (token && !data.authenticated) {
        clearToken();
      }
    } catch (err) {
      console.error('Failed to fetch status', err);
      setInitialized((prev) => prev ?? null);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('humor_token', newToken);
    setToken(newToken);
    // Immediately refresh status to update authenticated state
    await refreshStatus();
  };

  const logout = async () => {
    try {
      await fetch(apiUrl('/api/logout'), {
        method: 'POST',
        headers: token ? { 'Authorization': token } : {}
      });
    } catch (err) {
      console.error('Logout request failed', err);
    }
    clearToken();
  };

  return (
    <AuthContext.Provider value={{ initialized, authenticated, token, config, login, logout, refreshStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
