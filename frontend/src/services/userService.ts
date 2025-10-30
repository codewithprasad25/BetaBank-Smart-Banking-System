import { api } from './api';
import { User, Account } from '@/types/banking';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const raw = await api.get<any[]>('/admin/users');
    return raw.map(mapUserFromBackend);
  },

  async getUserById(id: string): Promise<User> {
    const raw = await api.get<any>(`/admin/users/${id}`);
    return mapUserFromBackend(raw);
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const raw = await api.patch<any>(`/admin/users/${id}`, userData);
    return mapUserFromBackend(raw);
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete<void>(`/admin/users/${id}`);
  },

  async getUserAccounts(userId: string): Promise<Account[]> {
    const raw = await api.get<any[]>(`/admin/users/${userId}/accounts`);
    // Reuse account mapping from accountService-like structure
    return raw.map((info: any) => ({
      id: String(info.accountNo ?? info.accountNumber ?? ''),
      accountNumber: String(info.accountNo ?? info.accountNumber ?? ''),
      accountType: ((t: string) => {
        const up = (t || '').toUpperCase();
        if (up.startsWith('SAV')) return 'SAVINGS';
        if (up.startsWith('CUR') || up.startsWith('BUS')) return (up.startsWith('BUS') ? 'BUSINESS' : 'CHECKING');
        if (up === 'CHECKING') return 'CHECKING';
        return 'SAVINGS';
      })(info.accountType),
      balance: Number(info.balance ?? 0),
      userId: '',
      user: undefined,
      createdAt: '',
      updatedAt: '',
    } as Account));
  },
};

function mapUserFromBackend(u: any): User {
  return {
    id: String(u.userId ?? u.id ?? ''),
    name: u.name ?? '',
    email: u.email ?? '',
    mobileNo: u.mobileNo ?? '',
    address: u.address ?? '',
    role: (u.role ?? 'USER') as User['role'],
    createdAt: u.createdAt ?? '',
    updatedAt: u.updatedAt ?? '',
  };
}