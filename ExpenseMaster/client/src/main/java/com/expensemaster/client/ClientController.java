package com.expensemaster.client;

import com.expensemaster.application.client.IClientService;
import com.expensemaster.application.client.dto.Address;
import com.expensemaster.application.client.dto.ClientRegistrationDto;
import com.expensemaster.application.client.dto.Contact;
import com.expensemaster.application.client.dto.Document;
import com.expensemaster.client.input.ClientRegistrationInput;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.Objects;

@RestController
public class ClientController implements IClientAPI {
    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);

    private final IClientSpan span;

    private final IClientService clientService;

    public ClientController(
            final IClientSpan span,
            final IClientService clientService
    ) {
        this.span = Objects.requireNonNull(span);
        this.clientService = Objects.requireNonNull(clientService);
    }
    @Override
    public ResponseEntity<Void> registration(final HttpServletRequest request, @Valid final ClientRegistrationInput input) {
        this.span.setHttpRequest(request);
        final var dto = ClientRegistrationDto.with(
                input.getName(),
                input.getFullName(),
                input.getCompanyReason(),
                input.getPhoneNumber(),
                input.getUserId(),
                input.getBirthDate(),
                input.getClientType(),
                Address.with(
                        input.getAddress().getState(),
                        input.getAddress().getCity(),
                        input.getAddress().getCountry(),
                        input.getAddress().getPostalCode(),
                        input.getAddress().getStreet()
                ),
                Contact.with(
                        input.getContact().getName(),
                        input.getContact().getEmail(),
                        input.getContact().getPhoneNumber(),
                        input.getContact().getRelationship()
                ),
                Document.with(input.getDocument().getDocumentName(), input.getDocument().getDocumentNumber())
        );
        this.span.startSpan("bus.receive.from.kong", () -> {
            this.clientService.registration(dto);
        });
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
