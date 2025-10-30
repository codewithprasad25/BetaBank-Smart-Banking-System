package com.example.banking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<BankAccount,Long> {

    //Get All accounts for Specific User
    List<BankAccount> findByBankUser(BankUser bankUser);

    //Check if Account Number Exists
    boolean existsByAccountNo(Long accountNo);

    //Optional <T> its a container that may or may not hold a non-null value either BankAccount or just empty not null
    Optional<BankAccount> findByAccountNo(Long accountNo);
}
