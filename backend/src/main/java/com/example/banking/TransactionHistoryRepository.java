package com.example.banking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory,Long> {
    List<TransactionHistory> findByAccountNo(Long accountNo);
    List<TransactionHistory> findTop5ByAccountNoOrderByTimeStampDesc(Long accountNo);

}
