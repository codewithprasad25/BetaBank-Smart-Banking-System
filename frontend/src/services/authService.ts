import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User, Account } from '@/types/banking';
import { accountService } from './accountService';

// export const authService = {
//   async login(credentials: LoginRequest): Promise<AuthResponse> {
//     return api.post<AuthResponse>('/auth/login', credentials);
//   },

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<{
      token: string;
      userResponse: any;
    }>('/users/login', credentials);

    const token = response.token;
    localStorage.setItem('banking_token', token);

    // Fetch accounts after login
    const accounts: Account[] = await accountService.getAccounts();

    return {
      token,
      user: mapUser(response.userResponse),
      accounts,
    };
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>('/users/register', userData);
  },

  // async verifyToken(): Promise<AuthResponse> {
  //   return api.get<AuthResponse>('/auth/verify');
  // },
  async verifyToken(): Promise<AuthResponse> {
    // Backend doesn't expose /auth/verify; derive from /users/me + existing token
    const token = localStorage.getItem('banking_token') || '';
    const userResponse = await api.get<any>('/users/me');
    const accounts: Account[] = await accountService.getAccounts();
    return {
      token,
      user: mapUser(userResponse),
      accounts,
    };
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    return api.patch<User>('/auth/profile', userData);
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return api.post<void>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  logout(): void {
    localStorage.removeItem('banking_token');
  },
};

function mapUser(u: any): User {
  const roleUp = String(u.role ?? 'USER').toUpperCase();
  return {
    id: String(u.userId ?? u.id ?? ''),
    name: u.name,
    email: u.email,
    mobileNo: u.mobileNo ?? '',
    address: u.address ?? '',
    role: (roleUp === 'ADMIN' ? 'ADMIN' : 'USER') as User['role'],
    createdAt: u.createdAt ?? '',
    updatedAt: u.updatedAt ?? '',
  };
}