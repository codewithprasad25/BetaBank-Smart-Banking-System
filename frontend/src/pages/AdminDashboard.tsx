import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { accountService } from '@/services/accountService';
import { User, Account, Transaction } from '@/types/banking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  Loader2,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewUser, setShowViewUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState<Partial<User>>({});
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError('');
    let usersOk = true;
    let accountsOk = true;
    try {
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (err: any) {
      usersOk = false;
      setUsers([]);
      toast({ title: "Users fetch failed", description: err.message || 'Unable to load users', variant: 'destructive' });
    }
    try {
      const accountsData = await accountService.getAllAccounts();
      setAccounts(accountsData);
    } catch (err: any) {
      accountsOk = false;
      setAccounts([]);
      toast({ title: "Accounts fetch failed", description: err.message || 'Unable to load accounts', variant: 'destructive' });
    }
    if (!usersOk || !accountsOk) {
      setError('Some admin data failed to load.');
    }
    setIsLoading(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const activeUsers = users.filter(user => user.role === 'USER').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'bg-destructive text-destructive-foreground' : 'bg-success text-success-foreground';
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'SAVINGS':
        return 'bg-success text-success-foreground';
      case 'CHECKING':
        return 'bg-primary text-primary-foreground';
      case 'BUSINESS':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const openTransactions = async (account: Account) => {
    try {
      setSelectedAccount(account);
      setIsTxLoading(true);
      const tx = await accountService.getAccountTransactionsByAccountNumber(account.accountNumber);
      setTransactions(tx);
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to load transactions', variant: 'destructive' });
    } finally {
      setIsTxLoading(false);
    }
  };

  const closeTransactions = () => {
    setSelectedAccount(null);
    setTransactions([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 banking-hero rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, accounts, and system operations
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Accounts
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All account types
            </p>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Status
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Management */}
        <Card className="banking-card flex flex-col h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Users Management</span>
              </CardTitle>
              <Button size="sm" variant="outline" asChild>
                <a href="/admin/users">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Users
                </a>
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="banking-input pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[800px]">
            <div className="space-y-4 ">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>

                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={async () => {
                      setSelectedUser(user);
                      setShowViewUser(true);
                      try {
                        const accs = await userService.getUserAccounts(user.id);
                        setUserAccounts(accs);
                      } catch {
                        setUserAccounts([]);
                      }
                    }}><Eye className="h-4 w-4 mr-1" /> View</Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedUser(user);
                      setEditUserForm({ name: user.name, email: user.email, mobileNo: user.mobileNo, address: user.address });
                      setShowEditUser(true);
                    }}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={async () => {
                      if (!confirm(`Delete user ${user.name}?`)) return;
                      try {
                        await userService.deleteUser(user.id);
                        toast({ title: 'Deleted', description: 'User removed' });
                        setUsers(prev => prev.filter(u => u.id !== user.id));
                      } catch {
                        toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
                      }
                    }}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Overview */}
        <Card className="banking-card flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Accounts Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[800px]">
            <div className="banking-table min-h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(showAllAccounts ? accounts : accounts.slice(0, 10)).map((account) => (
                    <TableRow key={account.id}>
                     { <TableCell className="font-mono">
                        {account.accountNumber}
                      </TableCell>}
                      <TableCell>
                        <Badge className={getAccountTypeColor(account.accountType)}>
                          {account.accountType}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-semibold ${
                        account.balance >= 0 ? 'balance-positive' : 'balance-negative'
                      }`}>
                        {formatCurrency(account.balance)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {account.user?.name || 'Unknown'}
                        <div className="mt-2">
                          <Button size="sm" variant="outline" onClick={() => openTransactions(account)}>
                            <Eye className="h-4 w-4 mr-1" /> View Transactions
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {accounts.length > 10 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" onClick={() => setShowAllAccounts(v => !v)} ></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card className="banking-card">
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <a href="/admin/deposit">
                <DollarSign className="h-6 w-6 mb-2" />
                Deposit Funds
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <a href="/admin/accounts">
                <CreditCard className="h-6 w-6 mb-2" />
                Manage Accounts
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <a href="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                User Management
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col banking-button-secondary" asChild>
              <a href="/admin/reports">
                <TrendingUp className="h-6 w-6 mb-2" />
                System Reports
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">All Transactions</h3>
                <p className="text-sm text-muted-foreground">Account •••• {selectedAccount.accountNumber.slice(-4)}</p>
              </div>
              <Button variant="ghost" onClick={closeTransactions}>Close</Button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {isTxLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <div className="banking-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((t, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{formatDate(t.createdAt)}</TableCell>
                          <TableCell><Badge>{t.type}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{t.description}</TableCell>
                          <TableCell className={`text-right ${t.type === 'WITHDRAWAL' ? 'balance-negative' : 'balance-positive'}`}>{formatCurrency(t.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User View Modal */}
      {showViewUser && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background rounded-t-lg">
              <h3 className="text-lg font-semibold">User Details</h3>
              <Button variant="ghost" onClick={() => setShowViewUser(false)}>Close</Button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Mobile:</strong> {selectedUser.mobileNo}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <div className="banking-table mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAccounts.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono">{a.accountNumber}</TableCell>
                        <TableCell><Badge>{a.accountType}</Badge></TableCell>
                        <TableCell className="text-right">{formatCurrency(a.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showEditUser && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background rounded-t-lg">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <Button variant="ghost" onClick={() => setShowEditUser(false)}>Close</Button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
              <Input value={editUserForm.name ?? ''} onChange={e => setEditUserForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="banking-input" />
              <Input value={editUserForm.email ?? ''} onChange={e => setEditUserForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="banking-input" />
              <Input value={editUserForm.mobileNo ?? ''} onChange={e => setEditUserForm(f => ({ ...f, mobileNo: e.target.value }))} placeholder="Mobile" className="banking-input" />
              <Input value={editUserForm.address ?? ''} onChange={e => setEditUserForm(f => ({ ...f, address: e.target.value }))} placeholder="Address" className="banking-input" />
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowEditUser(false)}>Cancel</Button>
                <Button className="banking-button-primary" onClick={async () => {
                  try {
                    if (!selectedUser) return;
                    const updated = await userService.updateUser(selectedUser.id, editUserForm);
                    toast({ title: 'Saved', description: 'User updated' });
                    setShowEditUser(false);
                    setUsers(prev => prev.map(u => u.id === selectedUser.id ? updated : u));
                  } catch {
                    toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
                  }
                }}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}