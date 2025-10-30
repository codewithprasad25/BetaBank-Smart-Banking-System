// Banking Application Types

export interface User {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  address: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'BUSINESS' |'CURRENT';
  balance: number;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
  // Optional recent transactions (from backend AccountInfo)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  description: string;
  fromAccountId?: string;
  toAccountId?: string;
  fromAccount?: Account;
  toAccount?: Account;
  createdAt: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface AuthResponse {
  token: string;
  user: User;
  accounts: Account[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobileNo: string;
  address: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'BUSINESS' |'CURRENT';
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  description: string;
}

export interface DepositRequest {
  accountId: string;
  amount: number;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}