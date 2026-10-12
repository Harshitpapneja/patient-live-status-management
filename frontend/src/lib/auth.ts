// Placeholder app-level state helpers.
export type UserRole = 'admin' | 'staff' | 'viewer';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function saveAuthToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function getAuthToken() {
  return localStorage.getItem('accessToken');
}

export function clearAuthToken() {
  localStorage.removeItem('accessToken');
}
