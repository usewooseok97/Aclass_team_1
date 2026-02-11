const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  body?: unknown;
  token?: string | null;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || '요청에 실패했습니다.');
  }

  return data;
}

// Auth API
export interface User {
  id: number;
  nickname: string;
  phone: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authApi = {
  signup: (data: { nickname: string; phone: string; password: string; passwordConfirm: string }) =>
    api<AuthResponse>('/api/auth/signup', { method: 'POST', body: data }),

  login: (data: { phone: string; password: string }) =>
    api<AuthResponse>('/api/auth/login', { method: 'POST', body: data }),

  logout: (token: string) =>
    api<{ message: string }>('/api/auth/logout', { method: 'POST', token }),

  me: (token: string) =>
    api<{ user: User }>('/api/auth/me', { token }),

  withdraw: (token: string) =>
    api<{ message: string }>('/api/auth/withdraw', { method: 'DELETE', token }),
};

// Favorites API
export interface Favorite {
  id: number;
  festivalId: string;
  createdAt: string;
}

export const favoritesApi = {
  getAll: (token: string) =>
    api<{ favorites: Favorite[] }>('/api/favorites', { token }),

  add: (festivalId: string, token: string) =>
    api<{ message: string; festivalId: string }>('/api/favorites', { method: 'POST', body: { festivalId }, token }),

  remove: (festivalId: string, token: string) =>
    api<{ message: string; festivalId: string }>(`/api/favorites?festivalId=${encodeURIComponent(festivalId)}`, { method: 'DELETE', token }),
};

// Reviews API
export interface Review {
  id: number;
  text: string;
  rating: number;
  x: number;
  y: number;
  fontSize: number;
  rotate: number;
  color: string;
  createdAt: string;
  userName: string;
}

export interface ReviewInput {
  text: string;
  rating: number;
  x: number;
  y: number;
  fontSize: number;
  rotate: number;
  color: string;
  festivalEndDate: string;
}

export const reviewsApi = {
  getByFestival: (festivalId: string) =>
    api<{ reviews: Review[] }>(`/api/reviews?festivalId=${encodeURIComponent(festivalId)}`),

  create: (festivalId: string, data: ReviewInput, token: string) =>
    api<{ message: string; reviewId: number }>('/api/reviews', { method: 'POST', body: { ...data, festivalId }, token }),

  delete: (reviewId: number, token: string) =>
    api<{ message: string }>(`/api/reviews/delete/${reviewId}`, { method: 'DELETE', token }),
};
