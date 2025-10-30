package com.example.banking;

import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

    public AccountService(AccountRepository accountRepository, TransactionHistoryRepository transactionHistoryRepository, UserRepository userRepository){
        this.accountRepository=accountRepository;
        this.transactionHistoryRepository=transactionHistoryRepository;
        this.userRepository=userRepository;
    }

    //Deposit for Admin Usage
    @Transactional
    public AccountInfo Deposit(DepositRequest request){

        //Deposit Log
        logger.info("Deposit Request by the admin for Account No : {}" ,request.getAccountNo());

        //Finding if Account Exists and getting it
        BankAccount bankAccount = accountRepository.findByAccountNo(request.getAccountNo())
                .orElseThrow(()-> new RuntimeException("Account Not Found"));
        if(request.getAmount() <= 0){
            throw new IllegalArgumentException("Amount must be Greater than 0");
        }

        //Mapping fields and saving account
        bankAccount.setBalance(bankAccount.getBalance() + request.getAmount());
        accountRepository.save(bankAccount);

        //Saving in Transaction History
        transactionHistoryRepository.save(new TransactionHistory(
                null, bankAccount.getAccountNo(), "DEPOSIT",request.getAmount(),
                "DEPOSITED"+request.getAmount(), LocalDateTime.now()
        ));
        logger.info("Deposit Successfully Done By the admin on Account : {}" ,request.getAccountNo());

        var transactions = transactionHistoryRepository
                .findTop5ByAccountNoOrderByTimeStampDesc(bankAccount.getAccountNo())
                .stream()
                .map(tx -> new TransactionInfo(
                        tx.getTransactionType(),
                        tx.getAmount(),
                        tx.getDescription(),
                        tx.getTimeStamp()
                ))
                .toList();


        return new AccountInfo(bankAccount.getAccountNo(),
                bankAccount.getBalance(),
                bankAccount.getAccountType(),
                transactions);
    }


    //Withdraw
    @Transactional
    public AccountInfo Withdraw(WithdrawRequest request){

        //Withdraw Log
        logger.info("Withdraw Request from Account No {} for Amount {}  " ,request.getAccountNo(),request.getAmount());

        //Finding if Account Exists and getting it
        BankAccount bankAccount = accountRepository.findByAccountNo(request.getAccountNo())
                .orElseThrow(()-> new RuntimeException("User Account not Found"));

        if(request.getAmount() <=0){
            throw new IllegalArgumentException("Amount must be Greater than 0");
        }
        if(bankAccount.getBalance() < request.getAmount()){
            throw new InsufficientBalanceException("Insufficient Balance for Withdraw");
        }

        bankAccount.setBalance(bankAccount.getBalance() - request.getAmount());
        accountRepository.save(bankAccount);

        //Saving in Transaction History
        transactionHistoryRepository.save(new TransactionHistory(
                null, bankAccount.getAccountNo(), "WITHDRAW",request.getAmount(),
                "WITHDREW"+request.getAmount(), LocalDateTime.now()
        ));

        //Withdraw Log
        logger.info("Successful Withdraw of Amount {} from Account No {}" ,request.getAmount(),request.getAccountNo());
        //Fetch recent transactions (optional: limit to top 5)
        var transactions = transactionHistoryRepository
                .findTop5ByAccountNoOrderByTimeStampDesc(bankAccount.getAccountNo())
                .stream()
                .map(tx -> new TransactionInfo(
                        tx.getTransactionType(),
                        tx.getAmount(),
                        tx.getDescription(),
                        tx.getTimeStamp()
                ))
                .toList();

        return new AccountInfo(bankAccount.getAccountNo(),
                bankAccount.getBalance(),
                bankAccount.getAccountType(),
                transactions
        );

    }


    //Transfer Money For Admin Usage
    @Transactional
    public String MoneyTransfer(TransferRequest request){


        //Money Transfer Log
        logger.info(" Admin Money Transfer Request from Account No{} to Account No {}" ,request.getFromAccountNo(),request.getToAccountNo());

        if(request.getAmount() <=0){
            throw new IllegalArgumentException("Transfer Amount must be Greater than 0");
        }
        if(request.getToAccountNo().equals(request.getFromAccountNo())){
            throw new InvalidTransactionException("Cannot Transfer to the same Account");
        }

        //Finding if Source Account Exists and getting it
        BankAccount toAccount = accountRepository.findByAccountNo(request.getToAccountNo())
                .orElseThrow(()-> new AccountNotFoundException("Account not found with Account Number :" + request.getToAccountNo()));

        //Finding if Destination Account Exists and getting it
        BankAccount fromAccount = accountRepository.findByAccountNo(request.getFromAccountNo())
                .orElseThrow(()->  new AccountNotFoundException("Account not found with Account Number :" + request.getFromAccountNo()));

        fromAccount.setBalance(fromAccount.getBalance() - request.getAmount());
        toAccount.setBalance(toAccount.getBalance() + request.getAmount());

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);


        transactionHistoryRepository.save(new TransactionHistory(
                null, fromAccount.getAccountNo(), " TRANSFER ",request.getAmount(),
                " TRANSFERRED TO "+request.getToAccountNo(), LocalDateTime.now()
        ));

        transactionHistoryRepository.save(new TransactionHistory(
                null, toAccount.getAccountNo(), " TRANSFER ",request.getAmount(),
                " RECEIVED FROM "+request.getFromAccountNo(), LocalDateTime.now()
        ));

        logger.info(" Successful Admin Money Transfer from Account No{} to Account No {}" ,request.getFromAccountNo(),request.getToAccountNo());

        return "Successfully Transferred " + request.getAmount() +" From "+request.getFromAccountNo()+" To " + request.getToAccountNo();

    }

    //Transfer Money for User usage
    @Transactional
    public String userMoneyTransfer(UserMoneyTransferRequest request){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        BankUser user = userRepository.findByEmail(email)
                .orElseThrow(()->new AccountNotFoundException("User Account Not Found"));

        //One Account Per User
        BankAccount sourceAccount = accountRepository.findByBankUser(user)
                .stream().findFirst().orElseThrow(()-> new AccountNotFoundException("User Account Not Found"));

        BankAccount toAccount = accountRepository.findByAccountNo(request.getToAccountNo())
                .orElseThrow(()-> new AccountNotFoundException("Target User Account Not found"));

        //Money transfer Log for User
        logger.info("Money Transfer Request from Account No{} to Account No {}" ,sourceAccount.getAccountNo(),request.getToAccountNo());

        if(sourceAccount.getBalance() < request.getAmount()){
            throw new InsufficientBalanceException("Insufficient Balance");
        }
        if(request.getAmount() <= 0) {
            throw new IllegalArgumentException("Transfer amount must be greater than zero");
        }

        sourceAccount.setBalance(sourceAccount.getBalance() - request.getAmount());
        toAccount.setBalance(toAccount.getBalance() + request.getAmount());

        accountRepository.save(sourceAccount);
        accountRepository.save(toAccount);

        //Money transfer Log for User
        logger.info("Successful Money Transfer from Account No{} to Account No {}" ,sourceAccount.getAccountNo(),request.getToAccountNo());

        return "Successfully Transferred " + request.getAmount() +" From "+sourceAccount.getAccountNo()+" To " + request.getToAccountNo();

    }

    public List<AccountInfo> getAccountsForUser(Long userId) {
        BankUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<BankAccount> accounts = accountRepository.findByBankUser(user);

        return accounts.stream().map(account -> {
            // Fetch last 5 transactions for each account
            List<TransactionInfo> txns = transactionHistoryRepository
                    .findTop5ByAccountNoOrderByTimeStampDesc(account.getAccountNo())
                    .stream()
                    .map(tx -> new TransactionInfo(
                            tx.getTransactionType(),
                            tx.getAmount(),
                            tx.getDescription(),
                            tx.getTimeStamp()
                    ))
                    .collect(Collectors.toList());

            return new AccountInfo(
                    account.getAccountNo(),
                    account.getBalance(),
                    account.getAccountType(),
                    txns
            );
        }).collect(Collectors.toList());
    }






}
