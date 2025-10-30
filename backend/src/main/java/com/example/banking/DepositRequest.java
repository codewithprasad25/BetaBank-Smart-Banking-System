package com.example.banking;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DepositRequest {

    @NotNull(message = "Account No is Required")
    private Long accountNo;

    @NotNull(message = "Amount is Required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Long amount;

}
