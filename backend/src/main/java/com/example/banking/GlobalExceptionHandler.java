package com.example.banking;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    //AccountNotFoundException
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleAccountNotFound(AccountNotFoundException ex){
        return buildResponse(HttpStatus.NOT_FOUND,ex.getMessage());
    }

    //InsufficientBalanceException
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Map<String,Object>> handleInsufficientBalanceException(InsufficientBalanceException ex){
        return buildResponse(HttpStatus.BAD_REQUEST,ex.getMessage());
    }

    //InvalidTransactionException
    @ExceptionHandler(InvalidTransactionException.class)
    public ResponseEntity<Map<String,Object>> handleInvalidTransactionException(InvalidTransactionException ex){
        return buildResponse(HttpStatus.BAD_REQUEST,ex.getMessage());
    }

    //General exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleException(Exception ex){
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
    }


    //Generic Exception Handling

    //IllegalArgumentException
    //that's Invalid Inputs
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,Object>> handleIllegalArgument(IllegalArgumentException ex){
        return buildResponse(HttpStatus.BAD_REQUEST,ex.getMessage());

    }


    //RuntimeException
    //handles exceptions like account not found etc
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,Object>> handleRuntime(RuntimeException ex){
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,"Unexpected Error"+ex.getMessage());

    }

    //Validation Error
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex){
        Map<String,Object> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(
                error ->fieldErrors.put(error.getField(),error.getDefaultMessage())
        );
        Map<String,Object> body = new HashMap<>();
        body.put("timestamp" , LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error","Validation Error");
        body.put("fieldErrors", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);

    }

    //Generic method to build exception Responses
    private ResponseEntity<Map<String,Object>> buildResponse(HttpStatus status, String message){
        Map<String,Object> body = new HashMap<>();
        body.put("timestamp" , LocalDateTime.now());
        body.put("status", status.value());
        body.put("error",status.getReasonPhrase());
        body.put("message", message);

        return new ResponseEntity<>(body,status);

    }
}
