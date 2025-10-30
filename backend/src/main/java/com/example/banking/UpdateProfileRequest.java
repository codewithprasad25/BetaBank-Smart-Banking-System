package com.example.banking;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Mobile No is required")
    private String mobileNo;

    @NotBlank(message = "Address is required")
    private String address;
}


