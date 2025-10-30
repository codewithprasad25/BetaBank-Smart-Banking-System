package com.example.banking;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        BankUser bankUser= userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found with email :"+ email));
        return User.builder()
                .username(bankUser.getEmail())
                .password(bankUser.getPassword())  // already bcrypt encoded
                .roles(bankUser.getRole()) // USER / ADMIN
                .build();
    }


}
