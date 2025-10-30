import { useEffect, useState } from 'react';
import { accountService } from '@/services/accountService';
import { Account } from '@/types/banking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { CreditCard, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminAccounts() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAccount, setViewAccount] = useState<Account | null>(null);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [editType, setEditType] = useState<Account['accountType']>('SAVINGS');

  const load = async () => {
    setLoading(true);
    try {
      const data = await accountService.getAllAccounts();
      setAccounts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

  return (
    <div className="container mx-auto p-6">
      <Card className="banking-card">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>All Accounts</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="banking-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono">{a.accountNumber}</TableCell>
                    <TableCell><Badge>{a.accountType}</Badge></TableCell>
                    <TableCell className="text-right">{formatCurrency(a.balance)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setViewAccount(a)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Modal */}
      {viewAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Account Details</h3>
              <Button variant="ghost" onClick={() => setViewAccount(null)}>Close</Button>
            </div>
            <div className="p-4 space-y-2">
              <p><strong>Account:</strong> {viewAccount.accountNumber}</p>
              <p><strong>Type:</strong> {viewAccount.accountType}</p>
              <p><strong>Balance:</strong> {formatCurrency(viewAccount.balance)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Account</h3>
              <Button variant="ghost" onClick={() => setEditAccount(null)}>Close</Button>
            </div>
            <div className="p-4 space-y-3">
              <p><strong>Account:</strong> {editAccount.accountNumber}</p>
              <div>
                <label className="text-sm mb-1 block">Account Type</label>
                <Select value={editType} onValueChange={(v) => setEditType(v as Account['accountType'])}>
                  <SelectTrigger className="banking-input"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                    <SelectItem value="CHECKING">CHECKING</SelectItem>
                    <SelectItem value="BUSINESS">BUSINESS</SelectItem>
                    <SelectItem value="CURRENT">CURRENT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditAccount(null)}>Cancel</Button>
                <Button className="banking-button-primary" onClick={async () => {
                  try {
                    if (!editAccount) return;
                    const updated = await accountService.adminUpdateAccountType(editAccount.accountNumber, editType);
                    toast({ title: 'Updated', description: 'Account type updated' });
                    setEditAccount(null);
                    load();
                  } catch (e) {
                    toast({ title: 'Error', description: 'Failed to update account', variant: 'destructive' });
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


