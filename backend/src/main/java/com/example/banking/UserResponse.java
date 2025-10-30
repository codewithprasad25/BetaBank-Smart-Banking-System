package com.example.banking;


import lombok.AllArgsConstructor;
import lombok.Data;

// import java.util.List;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String mobileNo;
    private String address;

}
