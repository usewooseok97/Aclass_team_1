import React, { createContext, useState, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, type User, ApiError } from '../lib/api';

const TOKEN_KEY = 'auth_token';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  signup: (nickname: string, phone: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  withdraw: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // 토큰으로 사용자 정보 조회
  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const { user } = await authApi.me(authToken);
      setUser(user);
    } catch (error) {
      // 토큰이 유효하지 않으면 로그아웃
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  // 초기 로딩: 저장된 토큰으로 사용자 정보 조회
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await fetchUser(token);
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token, fetchUser]);

  const login = useCallback(async (phone: string, password: string) => {
    const response = await authApi.login({ phone, password });
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const signup = useCallback(async (nickname: string, phone: string, password: string, passwordConfirm: string) => {
    const response = await authApi.signup({ nickname, phone, password, passwordConfirm });
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await authApi.logout(token);
      } catch (error) {
        // 로그아웃 실패해도 로컬은 정리
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, [token]);

  const withdraw = useCallback(async () => {
    if (!token) {
      throw new ApiError(401, '로그인이 필요합니다.');
    }
    await authApi.withdraw(token);
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, [token]);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    withdraw,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
