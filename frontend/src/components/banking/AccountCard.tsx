import { Account } from '@/types/banking';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccountCardProps {
  account: Account;
  showActions?: boolean;
}

export function AccountCard({ account, showActions = true }: AccountCardProps) {
  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(balance);
  };

  const formatAccountNumber = (accountNumber: string) => {
    return accountNumber;
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

  return (
    <Card className="banking-card hover:scale-[1.02] transition-transform duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <Badge className={getAccountTypeColor(account.accountType)}>
              {account.accountType}
            </Badge>
          </div>
          {account.user && (
            <span className="text-sm text-muted-foreground">{account.user.name}</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Account Number</p>
          <p className="font-mono text-lg">{formatAccountNumber(account.accountNumber)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className={`text-2xl font-bold ${
            account.balance >= 0 ? 'balance-positive' : 'balance-negative'
          }`}>
            {formatBalance(account.balance)}
          </p>
        </div>

        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/accounts/${account.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
            <Button size="sm" className="banking-button-primary" asChild>
              <Link to={`/transfer?from=${account.id}`}>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Transfer
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}