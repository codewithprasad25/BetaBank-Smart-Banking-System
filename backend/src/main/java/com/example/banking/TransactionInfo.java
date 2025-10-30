package com.example.banking;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TransactionInfo {
    private String transactionType;
    private Long amount;
    private String description;
    private LocalDateTime timeStamp;

}
