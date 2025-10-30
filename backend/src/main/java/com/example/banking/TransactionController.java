package com.example.banking;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts/{accountNo}")
public class TransactionController {
    private final TransactionHistoryRepository transactionHistoryRepository;

    public TransactionController(TransactionHistoryRepository transactionHistoryRepository){
        this.transactionHistoryRepository=transactionHistoryRepository;
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionInfo>> getTransactions(@PathVariable Long accountNo){
        List<TransactionInfo> transactions = transactionHistoryRepository.findByAccountNo(accountNo)
                .stream().map(tx-> new TransactionInfo(
                        tx.getTransactionType(),
                        tx.getAmount(),
                        tx.getDescription(),
                        tx.getTimeStamp()
                )).toList();
        return ResponseEntity.ok(transactions);
    }


}
