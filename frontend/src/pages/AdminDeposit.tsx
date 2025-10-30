import { useState } from 'react';
import { accountService } from '@/services/accountService';
import { useEffect } from 'react';
import { Account } from '@/types/banking';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDeposit() {
  const { toast } = useToast();
  const [accountNo, setAccountNo] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!accountNo || !/^\d{10,16}$/.test(accountNo)) {
      setError('Account number must be 10-16 digits');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    try {
      setLoading(true);
      const t = await accountService.adminDeposit(accountNo, Number(amount), 'Admin deposit');
      toast({ title: 'Success', description: `Deposited ${new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(amount))}` });
      setAmount('');
      setAccountNo('');
    } catch (err: any) {
      setError(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await accountService.getAllAccounts();
        setAccounts(data);
      } catch {}
    })();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card className="banking-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>Admin Deposit</span>
          </CardTitle>
          <CardDescription>Deposit funds into any account</CardDescription>
        </CardHeader>
        <form onSubmit={submit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="accountNo">Account Number</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="accountNo"
                    placeholder="1234567890"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                    className="banking-input pl-10"
                    maxLength={16}
                    required
                  />
                </div>
                <Select value={accountNo} onValueChange={setAccountNo}>
                  <SelectTrigger className="banking-input">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(a => (
                      <SelectItem key={a.id} value={a.accountNumber}>
                        •••• {a.accountNumber.slice(-4)} ({a.accountType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                className="banking-input"
                required
              />
            </div>

            <Button type="submit" className="banking-button-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Depositing...
                </>
              ) : (
                'Deposit'
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}


