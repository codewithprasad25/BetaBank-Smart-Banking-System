import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { accountService } from '@/services/accountService';
import { Account, TransferRequest } from '@/types/banking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowRightLeft, 
  Send, 
  CreditCard, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Transfer() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<TransferRequest>({
    fromAccountId: searchParams.get('from') || '',
    toAccountNumber: '',
    amount: 0,
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const accountsData = await accountService.getAccounts();
      setAccounts(accountsData);
      
      // Set default from account if not already set
      if (!formData.fromAccountId && accountsData.length > 0) {
        setFormData(prev => ({ ...prev, fromAccountId: accountsData[0].id }));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load accounts",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromAccountId) newErrors.fromAccountId = 'Please select a source account';
    if (!formData.toAccountNumber.trim()) {
      newErrors.toAccountNumber = 'Destination account number is required';
    } else if (!/^\d{10,16}$/.test(formData.toAccountNumber.replace(/\s/g, ''))) {
      newErrors.toAccountNumber = 'Account number must be 10-16 digits';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (formData.amount > 50000) {
      newErrors.amount = 'Transfer limit is $50,000 per transaction';
    }

    // Check sufficient funds
    const sourceAccount = accounts.find(acc => acc.id === formData.fromAccountId);
    if (sourceAccount && formData.amount > sourceAccount.balance) {
      newErrors.amount = 'Insufficient funds in source account';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const cleanAccountNumber = formData.toAccountNumber.replace(/\s/g, '');
      
      await accountService.transfer({
        ...formData,
        toAccountNumber: cleanAccountNumber,
      });

      toast({
        title: "Transfer Successful",
        description: `$${formData.amount.toFixed(2)} has been transferred successfully.`,
      });

      // Reset form
      setFormData({
        fromAccountId: accounts[0]?.id || '',
        toAccountNumber: '',
        amount: 0,
        description: '',
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setErrors({ general: err.message || 'Transfer failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({ ...prev, amount: value }));
    
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format account number with spaces
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({ ...prev, toAccountNumber: formatted }));
    
    if (errors.toAccountNumber) {
      setErrors(prev => ({ ...prev, toAccountNumber: '' }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const selectedAccount = accounts.find(acc => acc.id === formData.fromAccountId);

  if (isLoadingAccounts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 banking-hero rounded-2xl mb-4">
            <ArrowRightLeft className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Transfer Money</h1>
          <p className="text-muted-foreground mt-2">
            Send money securely to another account
          </p>
        </div>

        <Card className="banking-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-primary" />
              <span>Transfer Details</span>
            </CardTitle>
            <CardDescription>
              Fill in the details to transfer money between accounts
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* From Account */}
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Input
                    placeholder="Type account number"
                    value={formData.fromAccountId}
                    onChange={(e) => setFormData(prev => ({ ...prev, fromAccountId: e.target.value.replace(/\D/g, '') }))}
                    className={`banking-input ${errors.fromAccountId ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.fromAccountId && <p className="text-xs text-destructive">{errors.fromAccountId}</p>}
                
                {selectedAccount && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <CreditCard className="h-4 w-4" />
                    <span>Available balance: {formatCurrency(selectedAccount.balance)}</span>
                  </div>
                )}
              </div>

              {/* To Account */}
              <div className="space-y-2">
                <Label htmlFor="toAccount">To Account Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="toAccount"
                    placeholder="1234 5678 9012 3456"
                    value={formData.toAccountNumber}
                    onChange={handleAccountNumberChange}
                    className={`banking-input pl-10 ${errors.toAccountNumber ? 'border-destructive' : ''}`}
                    maxLength={19} // 16 digits + 3 spaces
                    required
                  />
                </div>
                {errors.toAccountNumber && <p className="text-xs text-destructive">{errors.toAccountNumber}</p>}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Transfer Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    max="50000"
                    value={formData.amount || ''}
                    onChange={handleAmountChange}
                    className={`banking-input pl-10 ${errors.amount ? 'border-destructive' : ''}`}
                    required
                  />
                </div>
                {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                <p className="text-xs text-muted-foreground">
                  Maximum transfer limit: ₹50,000 per transaction
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What is this transfer for?"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`banking-input ${errors.description ? 'border-destructive' : ''}`}
                  maxLength={100}
                  required
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              {/* Transfer Summary */}
              {formData.amount > 0 && selectedAccount && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p><strong>Transfer Summary:</strong></p>
                      <p>From: •••• {selectedAccount.accountNumber.slice(-4)} ({selectedAccount.accountType})</p>
                      <p>To: {formData.toAccountNumber || '••••'}</p>
                      <p>Amount: {formatCurrency(formData.amount)}</p>
                      <p>Description: {formData.description || 'N/A'}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="banking-button-primary flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Transfer {formData.amount > 0 ? formatCurrency(formData.amount) : 'Money'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}