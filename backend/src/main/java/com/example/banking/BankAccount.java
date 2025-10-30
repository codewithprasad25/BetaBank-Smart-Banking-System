package com.example.banking;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount {

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonIgnore
    private BankUser bankUser;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(unique = true)
    private Long accountNo;

    @Column(nullable = false)
    private Long balance;

    @Column(nullable = false)
    private String accountType;

}
