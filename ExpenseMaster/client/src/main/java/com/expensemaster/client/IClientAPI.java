package com.expensemaster.client;

import com.expensemaster.client.input.ClientRegistrationInput;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "client")
public interface IClientAPI {
    @PostMapping(
            value = "registration",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Void> registration(final HttpServletRequest request, @RequestBody final ClientRegistrationInput input);
}
