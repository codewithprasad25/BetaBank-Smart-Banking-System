package com.example.banking;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Account type is required")
    private String accountType;

    @NotBlank(message = "Mobile No type is required")
    private String mobileNo;

    @NotBlank(message = "Address is required")
    private String address;

}
