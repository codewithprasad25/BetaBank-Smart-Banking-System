package com.example.banking;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AccountService accountService;
    private final AccountRepository accountRepository;

    public AdminController(UserRepository userRepository, AccountService accountService, AccountRepository accountRepository){
        this.userRepository=userRepository;
        this.accountService=accountService;
        this.accountRepository=accountRepository;
    }

    //Getting Single user
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BankUser> getUserById(@PathVariable Long id) {
        BankUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    //Admin get all accounts
    @GetMapping("/accounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AccountInfo>> getAllAccounts() {
        var accounts = accountRepository.findAll().stream().map(acc -> new AccountInfo(
                acc.getAccountNo(),
                acc.getBalance(),
                acc.getAccountType(),
                List.of()
        )).toList();
        return ResponseEntity.ok(accounts);
    }



    //Getting all Users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BankUser>> getAllUsers(){
        return ResponseEntity.ok(userRepository.findAll());
    }


    //Updating user Info
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BankUser> updateUser(@PathVariable Long id ,@RequestBody BankUser updatedUser){
        BankUser user =userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User Not found"));
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setAddress(updatedUser.getAddress());
        user.setMobileNo(updatedUser.getMobileNo());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    // Also accept PATCH for partial updates
    @PatchMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> patchUser(@PathVariable Long id ,@RequestBody BankUser updatedUser){
        BankUser user =userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User Not found"));
        if(updatedUser.getName()!=null && !updatedUser.getName().isBlank()) user.setName(updatedUser.getName());
        if(updatedUser.getEmail()!=null && !updatedUser.getEmail().isBlank()) {
            String newEmail = updatedUser.getEmail();
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.findByEmail(newEmail).isPresent()) {
                return ResponseEntity.badRequest().body("Email is already registered");
            }
            user.setEmail(newEmail);
        }
        if(updatedUser.getAddress()!=null && !updatedUser.getAddress().isBlank()) {
            String addr = updatedUser.getAddress().trim();
            if (addr.length() > 255) {
                addr = addr.substring(0,255);
            }
            user.setAddress(addr);
        }
        if(updatedUser.getMobileNo()!=null && !updatedUser.getMobileNo().isBlank()) user.setMobileNo(updatedUser.getMobileNo());
        if(updatedUser.getRole()!=null && !updatedUser.getRole().isBlank()) user.setRole(updatedUser.getRole());
        try {
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Validation error: " + (e.getMostSpecificCause()!=null? e.getMostSpecificCause().getMessage(): e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        BankUser user =userRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("User Not found"));
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }


    //Deposit service
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/deposit")
    public ResponseEntity<AccountInfo> adminDeposit(@Valid @RequestBody DepositRequest request){
        AccountInfo updated = accountService.Deposit(request);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/transfer")
    public ResponseEntity<String> MoneyTransfer(@Valid @RequestBody TransferRequest request){
        String message = accountService.MoneyTransfer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);

    }

    // Get accounts for a specific user
    @GetMapping("/users/{id}/accounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AccountInfo>> getUserAccounts(@PathVariable Long id) {
        BankUser user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        var accounts = accountRepository.findByBankUser(user).stream().map(acc -> new AccountInfo(
                acc.getAccountNo(),
                acc.getBalance(),
                acc.getAccountType(),
                List.of()
        )).toList();
        return ResponseEntity.ok(accounts);
    }

    // Update account (e.g., accountType) by account number
    @PutMapping("/accounts/{accountNo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccountInfo> updateAccount(@PathVariable Long accountNo, @RequestBody BankAccount updated) {
        BankAccount acc = accountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (updated.getAccountType() != null) {
            acc.setAccountType(updated.getAccountType());
        }
        accountRepository.save(acc);
        return ResponseEntity.ok(new AccountInfo(acc.getAccountNo(), acc.getBalance(), acc.getAccountType(), List.of()));
    }

    // Delete account by account number
    @DeleteMapping("/accounts/{accountNo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long accountNo) {
        BankAccount acc = accountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(acc);
        return ResponseEntity.noContent().build();
    }
}
