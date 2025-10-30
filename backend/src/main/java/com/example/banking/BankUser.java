package com.example.banking;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name="users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank(message="Name is Required")
    private String name;

    @Email(message="Email should be valid")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password is Required")
    private String password;

    @NotBlank(message = "Mobile no is Required")
    @Pattern(regexp="\\d{10}", message="Mobile number must be 10 digits")
    private String mobileNo;

    @NotBlank(message = "Address is Required")
    private String address;

    private String role="USER";

    @OneToMany(mappedBy = "bankUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<BankAccount> accounts;


}
