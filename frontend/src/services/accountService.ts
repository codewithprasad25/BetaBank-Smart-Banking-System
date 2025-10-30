import { api } from './api';
import { Account, Transaction, TransferRequest, DepositRequest } from '@/types/banking';

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    const raw = await api.get<any[]>('/accounts');
    return raw.map(mapAccountFromInfo);
  },

  async getAccountById(id: string): Promise<Account> {
    // No direct endpoint; derive from list
    const accounts = await accountService.getAccounts();
    const found = accounts.find(a => a.id === id || a.accountNumber === id);
    if (!found) throw new Error('Account not found');
    return found;
  },

  async getAccountTransactions(accountId: string, limit?: number): Promise<Transaction[]> {
    // Prefer backend endpoint for full history
    return accountService.getAccountTransactionsByAccountNumber(accountId, limit);
  },

  async transfer(transferData: TransferRequest): Promise<Transaction> {
    // Map frontend payload to backend
    const payload = {
      toAccountNo: Number(transferData.toAccountNumber),
      amount: Math.floor(transferData.amount),
    };
    // Backend returns string message; normalize to a Transaction-like object
    const message = await api.post<string>('/accounts/transfer', payload);
    return { id: '', amount: payload.amount, type: 'TRANSFER', description: message, createdAt: new Date().toISOString(), status: 'COMPLETED' } as unknown as Transaction;
  },

  async deposit(depositData: DepositRequest): Promise<Transaction> {
    const payload = { accountNo: Number(depositData.accountId), amount: Math.floor(depositData.amount) };
    const info = await api.post<any>('/admin/deposit', payload);
    return mapDepositOrWithdraw(info, 'DEPOSIT');
  },

  async withdraw(accountId: string, amount: number, description: string): Promise<Transaction> {
    const payload = { accountNo: Number(accountId), amount: Math.floor(amount) };
    const info = await api.post<any>('/accounts/withdraw', payload);
    return mapDepositOrWithdraw(info, 'WITHDRAWAL', description);
  },

  // Admin only endpoints
  async getAllAccounts(): Promise<Account[]> {
    const raw = await api.get<any[]>('/admin/accounts');
    return raw.map(mapAccountFromInfo);
  },

  async adminUpdateAccountType(accountNumber: string, accountType: Account['accountType']): Promise<Account> {
    const raw = await api.put<any>(`/admin/accounts/${accountNumber}`, { accountType });
    return mapAccountFromInfo(raw);
  },

  async adminDeleteAccount(accountNumber: string): Promise<void> {
    await api.delete<void>(`/admin/accounts/${accountNumber}`);
  },

  async adminTransfer(fromAccountId: string, toAccountNumber: string, amount: number, description: string): Promise<Transaction> {
    return api.post<Transaction>('/admin/transfer', {
      fromAccountId,
      toAccountNumber,
      amount,
      description,
    });
  },

  async adminDeposit(accountId: string, amount: number, _description: string): Promise<Transaction> {
    const payload = { accountNo: Number(accountId), amount: Math.floor(amount) };
    await api.post<any>('/admin/deposit', payload);
    return { id: '', amount: payload.amount, type: 'DEPOSIT', description: 'Admin deposit', createdAt: new Date().toISOString(), status: 'COMPLETED' } as Transaction;
  },
  
  // New: fetch all transactions by account number from backend endpoint
  async getAccountTransactionsByAccountNumber(accountNumber: string, limit?: number): Promise<Transaction[]> {
    const raw = await api.get<any[]>(`/accounts/${accountNumber}/transactions${limit ? `?limit=${limit}` : ''}`);
    return raw.map((tx: any) => mapTransactionInfoWithContext(tx, accountNumber));
  },
};

function mapAccountFromInfo(info: any): Account {
  const accountNumber = String(info.accountNo ?? info.accountNumber ?? '');
  const transactions = (info.transactions ?? []).map(mapTransactionInfo);
  return {
    id: accountNumber,
    accountNumber,
    accountType: normalizeAccountType(info.accountType),
    balance: Number(info.balance ?? 0),
    userId: '',
    user: undefined,
    createdAt: '',
    updatedAt: '',
    transactions,
  } as unknown as Account & { transactions?: Transaction[] };
}

function mapTransactionInfo(tx: any): Transaction {
  return {
    id: '',
    amount: Number(tx.amount ?? 0),
    type: normalizeTxType(tx.transactionType),
    description: tx.description ?? '',
    createdAt: tx.timeStamp ?? new Date().toISOString(),
    status: 'COMPLETED',
  } as Transaction;
}

function mapTransactionInfoWithContext(tx: any, accountNumber: string): Transaction {
  const base = mapTransactionInfo(tx);
  const lowerDesc = String(tx.description || '').toLowerCase();
  let fromAccount: string | undefined;
  let toAccount: string | undefined;

  // Infer from/to from description and the current account context
  if (lowerDesc.includes('received from')) {
    // this account is destination
    toAccount = accountNumber;
    const match = /received from\s+(\d{6,})/i.exec(tx.description || '');
    fromAccount = match ? match[1] : undefined;
  } else if (lowerDesc.includes('transferred to')) {
    // this account is source
    fromAccount = accountNumber;
    const match = /transferred to\s+(\d{6,})/i.exec(tx.description || '');
    toAccount = match ? match[1] : undefined;
  } else if (lowerDesc.includes('deposit')) {
    // admin/user deposit into this account
    toAccount = accountNumber;
  } else if (lowerDesc.includes('withdrew') || lowerDesc.includes('withdraw')) {
    fromAccount = accountNumber;
  }

  return {
    ...base,
    fromAccount: fromAccount ? { accountNumber: fromAccount } as any : base.fromAccount,
    toAccount: toAccount ? { accountNumber: toAccount } as any : base.toAccount,
  } as Transaction;
}

function normalizeTxType(t: string): Transaction['type'] {
  const up = (t || '').toUpperCase();
  if (up.includes('DEPOSIT')) return 'DEPOSIT';
  if (up.includes('WITHDRAW')) return 'WITHDRAWAL';
  return 'TRANSFER';
}

function normalizeAccountType(t: string): Account['accountType'] {
  const up = (t || '').toUpperCase();
  if (up.startsWith('SAV')) return 'SAVINGS';
  if (up.startsWith('CUR') || up.startsWith('BUS')) return (up.startsWith('BUS') ? 'BUSINESS' : 'CURRENT') as Account['accountType'];
  if (up === 'CHECKING') return 'CHECKING';
  return 'SAVINGS';
}

function mapDepositOrWithdraw(_info: any, type: Transaction['type'], description?: string, amountOverride?: number): Transaction {
  return {
    id: '',
    amount: typeof amountOverride === 'number' ? amountOverride : 0,
    type,
    description: description ?? '',
    createdAt: new Date().toISOString(),
    status: 'COMPLETED',
  } as Transaction;
}