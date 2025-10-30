package com.example.banking;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AccountInfo {


    private Long accountNo;
    private Long balance;
    private String accountType;
    private List<TransactionInfo> transactions;

}
