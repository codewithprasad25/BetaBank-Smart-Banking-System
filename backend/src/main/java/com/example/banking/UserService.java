package com.example.banking;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository userRepository, AccountRepository accountRepository, JwtUtil jwtUtil, TransactionHistoryRepository transactionHistoryRepository1){
        this.userRepository=userRepository;
        this.accountRepository=accountRepository;
        this.jwtUtil=jwtUtil;
    }

    //Registering New User
    public UserResponse registerUser(BankUser bankUser, String accountType){

        //Log of registration request
        logger.info("Registration Request Requested from email : {}" ,bankUser.getEmail());


        if(userRepository.findByEmail(bankUser.getEmail()).isPresent()){
            throw new RuntimeException("User Already Exists !");
        }

        //Hashing Password Before Saving
        bankUser.setPassword(passwordEncoder.encode(bankUser.getPassword()));

        BankUser savedBankUser = userRepository.save(bankUser);

        //Creating Account in Database
        BankAccount bankAccount = new BankAccount();
        bankAccount.setBankUser(savedBankUser);
        bankAccount.setAccountNo(generateAccountNo());
        bankAccount.setBalance(0L);
        bankAccount.setAccountType(accountType);
        accountRepository.save(bankAccount);



//        AccountInfo accountInfo= new AccountInfo(
//                bankAccount.getAccountNo(),
//                bankAccount.getBalance(),
//                bankAccount.getAccountType()
//
//        );

        //Registration Success Log
        logger.info("User Successfully Registered with User ID  : {}" ,bankUser.getUserId());



        return  new UserResponse(
                savedBankUser.getUserId(),
                savedBankUser.getName(),
                savedBankUser.getEmail(),
                savedBankUser.getRole(),
                savedBankUser.getMobileNo(),
                savedBankUser.getAddress()

        );

    }

    //Loging In User
    public LoginResponse login(String email, String password){

        //Login Log
        logger.info("Login Request Requested from email : {}" ,email);

        BankUser bankUser = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User Not Found"));

        if(!passwordEncoder.matches(password, bankUser.getPassword())){
            throw new RuntimeException("Incorrect Password !");
        }

        //Generate JWT(JSON Web Token)
        String token = jwtUtil.generateToken(bankUser.getEmail());

        // Accounts are fetched separately where needed


        UserResponse userResponse = new UserResponse(
                bankUser.getUserId(),
                bankUser.getName(),
                bankUser.getEmail(),
                bankUser.getRole(),
                bankUser.getMobileNo(),
                bankUser.getAddress()

        );
        logger.info("User Successfully Logged in with email : {}" ,email);


        return new LoginResponse(token,userResponse);
    }

    public UserResponse getProfileByEmail(String email){
        BankUser bankUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        return new UserResponse(
                bankUser.getUserId(),
                bankUser.getName(),
                bankUser.getEmail(),
                bankUser.getRole(),
                bankUser.getMobileNo(),
                bankUser.getAddress()
        );
    }

    public UserResponse updateProfile(String email, UpdateProfileRequest request){
        BankUser bankUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        bankUser.setName(request.getName());
        bankUser.setMobileNo(request.getMobileNo());
        bankUser.setAddress(request.getAddress());
        userRepository.save(bankUser);
        return new UserResponse(
                bankUser.getUserId(),
                bankUser.getName(),
                bankUser.getEmail(),
                bankUser.getRole(),
                bankUser.getMobileNo(),
                bankUser.getAddress()
        );
    }

    public void changePassword(String email, String oldPassword, String newPassword){
        BankUser bankUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        if(!passwordEncoder.matches(oldPassword, bankUser.getPassword())){
            throw new RuntimeException("Incorrect Password !");
        }
        bankUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(bankUser);
    }


    //Generating Random Account Number
    public Long generateAccountNo(){
        Long accountNo;
        do{
            accountNo = 1000000000L + (long)(Math.random()*9000000000L);
        }while(accountRepository.existsByAccountNo(accountNo));
        return accountNo;
    }


    //Checking whether Email Already Exists
    public boolean emailExists(String email){
        return userRepository.findByEmail(email).isPresent();
    }



}
