import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import { accountService } from '@/services/accountService';
import { User, Account } from '@/types/banking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Users, Search, Trash, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [editAccountNo, setEditAccountNo] = useState<string>('');
  const [editAccountType, setEditAccountType] = useState<Account['accountType']>('SAVINGS');

  const load = async () => {
    const data = await userService.getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onViewAccounts = async (user: User) => {
    setSelected(user);
    setShowView(true);
    try {
      const data = await userService.getUserAccounts(user.id);
      setAccounts(data);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load user accounts', variant: 'destructive' });
    }
  };

  const onDelete = async (user: User) => {
    try {
      await userService.deleteUser(user.id);
      toast({ title: 'Deleted', description: `${user.name} removed` });
      load();
      if (selected?.id === user.id) { setSelected(null); setAccounts([]); }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
    }
  };

  const onEdit = async (user: User) => {
    setSelected(user);
    setEditForm({ name: user.name, email: user.email, mobileNo: user.mobileNo, address: user.address });
    // load user's accounts for editing account type
    try {
      const accs = await userService.getUserAccounts(user.id);
      setAccounts(accs);
      if (accs.length > 0) {
        setEditAccountNo(accs[0].accountNumber);
        setEditAccountType(accs[0].accountType);
      } else {
        setEditAccountNo('');
      }
    } catch {
      setAccounts([]);
      setEditAccountNo('');
    }
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!selected) return;
    try {
      // Save user fields
      const updated = await userService.updateUser(selected.id, editForm);
      // If an account is selected, update its type as well
      if (editAccountNo && editAccountType) {
        await accountService.adminUpdateAccountType(editAccountNo, editAccountType);
      }
      toast({ title: 'Saved', description: 'User and account updated' });
      setShowEdit(false);
      setSelected(updated);
      // refresh lists
      load();
      if (selected) {
        try {
          const accs = await userService.getUserAccounts(selected.id);
          setAccounts(accs);
        } catch {}
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
    }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="banking-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Users</span>
          </CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="banking-input pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="banking-table max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell><Badge>{u.role}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => onViewAccounts(u)}><Eye className="h-4 w-4 mr-1" /> Accounts</Button>
                      <Button size="sm" variant="outline" className="ml-2" onClick={() => onEdit(u)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                      <Button size="sm" variant="ghost" className="text-destructive ml-2" onClick={() => onDelete(u)}><Trash className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Card className="banking-card">
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {selected ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">{selected.name} • {selected.email}</p>
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
                    {accounts.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono">{a.accountNumber}</TableCell>
                        <TableCell><Badge>{a.accountType}</Badge></TableCell>
                        <TableCell className="text-right">{formatCurrency(a.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Select a user to view accounts</p>
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      {showView && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background rounded-t-lg">
              <h3 className="text-lg font-semibold">User Details</h3>
              <Button variant="ghost" onClick={() => setShowView(false)}>Close</Button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Mobile:</strong> {selected.mobileNo}</p>
              <p><strong>Address:</strong> {selected.address}</p>
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
                    {accounts.map(a => (
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

      {/* Edit Modal */}
      {showEdit && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background rounded-t-lg">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <Button variant="ghost" onClick={() => setShowEdit(false)}>Close</Button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
              <Input value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="banking-input" />
              <Input value={editForm.email ?? ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="banking-input" />
              <Input value={editForm.mobileNo ?? ''} onChange={e => setEditForm(f => ({ ...f, mobileNo: e.target.value }))} placeholder="Mobile" className="banking-input" />
              <Input value={editForm.address ?? ''} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} placeholder="Address" className="banking-input" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm mb-1 block">Account</label>
                  <select className="banking-input" value={editAccountNo} onChange={e => {
                    const val = e.target.value; setEditAccountNo(val);
                    const acc = accounts.find(a => a.accountNumber === val);
                    if (acc) setEditAccountType(acc.accountType);
                  }}>
                    {accounts.length === 0 && <option value="">No accounts</option>}
                    {accounts.map(a => (
                      <option key={a.id} value={a.accountNumber}>{a.accountNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm mb-1 block">Current Account Type</label>
                  <div className="banking-input flex items-center h-10">{editAccountType}</div>
                </div>
              </div>
              <div>
                <label className="text-sm mb-1 block">Change Account Type</label>
                <select className="banking-input" value={editAccountType} onChange={e => setEditAccountType(e.target.value as Account['accountType'])}>
                  <option value="SAVINGS">SAVINGS</option>
                  <option value="CHECKING">CHECKING</option>
                  <option value="CURRENT">CURRENT</option>
                  <option value="BUSINESS">BUSINESS</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
                <Button className="banking-button-primary" onClick={saveEdit}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


