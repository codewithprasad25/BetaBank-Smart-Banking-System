import { Transaction } from '@/types/banking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  limit?: number;
}

export function TransactionList({ transactions, title = "Recent Transactions", limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'TRANSFER':
        return <ArrowRightLeft className="h-4 w-4 text-primary" />;
      default:
        return <ArrowRightLeft className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (type === 'DEPOSIT') return 'transaction-credit';
    if (type === 'WITHDRAWAL') return 'transaction-debit';
    return amount > 0 ? 'transaction-credit' : 'transaction-debit';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-success text-success-foreground';
      case 'PENDING':
        return 'bg-warning text-warning-foreground';
      case 'FAILED':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
    
    if (type === 'WITHDRAWAL') return `-${formattedAmount}`;
    if (type === 'DEPOSIT') return `+${formattedAmount}`;
    return formattedAmount;
  };

  return (
    <Card className="banking-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.createdAt), 'MMM dd, yyyy • hh:mm a')}
                    </p>
                    {(transaction.fromAccount || transaction.toAccount) && (
                      <p className="text-xs text-muted-foreground">
                        {transaction.fromAccount && `From: ${transaction.fromAccount.accountNumber}`}
                        {transaction.fromAccount && transaction.toAccount && ' → '}
                        {transaction.toAccount && `To: ${transaction.toAccount.accountNumber}`}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <span className={`font-semibold ${getTransactionColor(transaction.type, transaction.amount)}`}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </span>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}