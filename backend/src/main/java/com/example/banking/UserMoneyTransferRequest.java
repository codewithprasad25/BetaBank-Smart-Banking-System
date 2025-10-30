package com.example.banking;

import jakarta.validation.constraints.Min;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class UserMoneyTransferRequest {

    @NotNull(message = "Account No Should not be Blank")
    private Long toAccountNo;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Long amount;
}
