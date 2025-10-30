package com.example.banking;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserService userService;
    private final UserRepository userRepository;


    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;

    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest){

        //Converting DTO to User Entity
        BankUser bankUser = new BankUser();
        bankUser.setName(registerRequest.getName());
        bankUser.setEmail(registerRequest.getEmail());
        bankUser.setPassword(registerRequest.getPassword());
        bankUser.setMobileNo(registerRequest.getMobileNo());
        bankUser.setAddress(registerRequest.getAddress());

        //Getting Account Type
        String accountType=registerRequest.getAccountType();

        //Checking if User Already Exists in Database
        if(userService.emailExists(bankUser.getEmail())){
            return ResponseEntity.badRequest().body("Email is already Registered");
        }
        // If User doest exists A New User is Registered
        UserResponse userResponse = userService.registerUser(bankUser,accountType);
        return ResponseEntity.ok(userResponse);

    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest){
        try{
            LoginResponse loginResponse = userService.login(loginRequest.getEmail(),loginRequest.getPassword());
            return ResponseEntity.ok(loginResponse);
        } catch(RuntimeException E){
            return ResponseEntity.badRequest().body(E.getMessage());
        }
    }

    // Returns the current authenticated user's profile
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        BankUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse userResponse = new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getMobileNo(),
                user.getAddress()
        );

        return ResponseEntity.ok(userResponse);
    }

    // Simple token verification endpoint for frontend
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        BankUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of(
                "valid", true,
                "email", email,
                "userId", user.getUserId()
        ));
    }

}
