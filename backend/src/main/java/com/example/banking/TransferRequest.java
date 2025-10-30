package com.example.banking;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferRequest {

    @NotNull(message = "Source account number is required")
    private Long fromAccountNo;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Long amount;

    @NotNull(message = "Destination account number is required")
    private Long toAccountNo;
}
