package com.example.banking;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;
    public AccountController(AccountService accountService, UserRepository userRepository){
        this.accountService=accountService;
        this.userRepository=userRepository;
    }

    //Withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<AccountInfo> withdraw(@Valid @RequestBody WithdrawRequest request){
        AccountInfo updated = accountService.Withdraw(request);
        return ResponseEntity.status(HttpStatus.OK).body(updated);

    }

    //Money Transfer for User
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/transfer")
    public ResponseEntity<String> MoneyTransfer(@Valid @RequestBody UserMoneyTransferRequest request){
        String message = accountService.userMoneyTransfer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);

    }

    //GET /api/accounts → return all accounts + recent transactions for logged-in user
    @GetMapping
    public ResponseEntity<List<AccountInfo>> getUserAccounts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        BankUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AccountInfo> accounts = accountService.getAccountsForUser(user.getUserId());
        return ResponseEntity.ok(accounts);
    }

    

}
