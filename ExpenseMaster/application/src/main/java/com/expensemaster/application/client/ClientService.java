package com.expensemaster.application.client;

import com.expensemaster.application.client.dto.ClientRegistrationDto;
import com.expensemaster.application.user.Queue.ICommand;

import java.util.Objects;

public class ClientService implements IClientService {

    private final ICommand command;

    public ClientService(final ICommand command) {
        this.command = Objects.requireNonNull(command);
    }

    @Override
    public void registration(ClientRegistrationDto dto) {
        final var exchange = "client.events";
        final var routingKey = "client.registration";
        this.command.sendCommand(exchange, routingKey, dto);
    }
}
