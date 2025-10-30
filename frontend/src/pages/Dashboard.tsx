import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { accountService } from '@/services/accountService';
import { Account, Transaction } from '@/types/banking';
import { AccountCard } from '@/components/banking/AccountCard';
import { TransactionList } from '@/components/banking/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Plus,
  CreditCard,
  BarChart3,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { state } = useAuth();
  const { toast } = useToast();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [showAllTx, setShowAllTx] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [state.user?.role]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const accountsData = state.user?.role === 'ADMIN'
        ? await accountService.getAllAccounts()
        : await accountService.getAccounts();

      setAccounts(accountsData);
      if (accountsData.length > 0) {
        const first = accountsData[0];
        const tx = await accountService.getAccountTransactions(first.id, 5);
        setRecentTransactions(tx);
      } else {
        setRecentTransactions([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {state.user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your financial activity
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" asChild>
            <Link to={state.user?.role === 'ADMIN' ? '/admin/accounts' : '/dashboard'}>
              <CreditCard className="h-4 w-4 mr-2" />
              View Accounts
            </Link>
          </Button>
          <Button className="banking-button-primary" asChild>
            <Link to="/transfer">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Transfer Money
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calculateTotalBalance())}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Accounts
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All accounts active
            </p>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Transactions
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentTransactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Status
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {state.user?.role === 'ADMIN' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" onClick={async () => {
              try {
                const list: Transaction[] = [];
                for (const a of accounts) {
                  const txs = await accountService.getAccountTransactions(a.id);
                  list.push(...txs);
                }
                list.sort((a,b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setAllTransactions(list);
                setShowAllTx(true);
              } catch (e) {
                toast({ title: 'Error', description: 'Failed to load all transactions', variant: 'destructive' });
              }
            }}>View All</Button>
          </div>

          <TransactionList 
            transactions={recentTransactions}
            title="Latest Transactions"
            limit={5}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Accounts</h2>
            </div>

            <div className="space-y-4">
              {accounts.length === 0 ? (
                <Card className="banking-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Accounts Found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Contact your administrator to set up an account.
                    </p>
                    <Button variant="outline">Contact Support</Button>
                  </CardContent>
                </Card>
              ) : (
                accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="ghost" size="sm" onClick={async () => {
                try {
                  const list: Transaction[] = [];
                  for (const a of accounts) {
                    const txs = await accountService.getAccountTransactions(a.id);
                    list.push(...txs);
                  }
                  list.sort((a,b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                  setAllTransactions(list);
                  setShowAllTx(true);
                } catch (e) {
                  toast({ title: 'Error', description: 'Failed to load all transactions', variant: 'destructive' });
                }
              }}>View All</Button>
            </div>
            
            <TransactionList 
              transactions={recentTransactions}
              title="Latest Transactions"
              limit={5}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="banking-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/transfer">
                <ArrowUpRight className="h-6 w-6 mb-2" />
                Send Money
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to={state.user?.role === 'ADMIN' ? '/admin/accounts' : '/dashboard'}>
                <CreditCard className="h-6 w-6 mb-2" />
                View Accounts
              </Link>
            </Button>
            {state.user?.role !== 'ADMIN' && (
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/profile">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Account Settings
                </Link>
              </Button>
            )}
            {state.user?.role === 'ADMIN' && (
              <Button variant="outline" className="h-20 flex-col banking-button-secondary" asChild>
                <Link to="/admin">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Admin Panel
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Transactions Modal */}
      {showAllTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background rounded-t-lg">
              <h3 className="text-lg font-semibold">All Transactions</h3>
              <Button variant="ghost" onClick={() => setShowAllTx(false)}>Close</Button>
            </div>
            <div className="p-4 overflow-y-auto">
              <TransactionList transactions={allTransactions} title="All Transactions" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}