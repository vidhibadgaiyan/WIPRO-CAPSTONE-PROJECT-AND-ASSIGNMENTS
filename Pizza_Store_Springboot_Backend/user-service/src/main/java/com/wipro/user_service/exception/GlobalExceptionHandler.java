
package com.wipro.user_service.exception;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

@ExceptionHandler(RuntimeException.class)

public ResponseEntity<String> handleRuntimeException(RuntimeException ex){

return new ResponseEntity<>(ex.getMessage(),HttpStatus.BAD_REQUEST);

}

}