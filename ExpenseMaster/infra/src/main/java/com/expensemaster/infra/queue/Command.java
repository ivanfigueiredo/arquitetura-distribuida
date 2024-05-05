package com.expensemaster.infra.queue;

import com.expensemaster.application.user.Queue.ICommand;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class Command implements ICommand {

    private final RabbitTemplate rabbitTemplate;

    public Command(final RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = Objects.requireNonNull(rabbitTemplate);
    }

    @Override
    public <T> void sendCommand(String exchange, String routingKey, T data) {
        final var mapper = new ObjectMapper();
        try {
            final var payload = mapper.writeValueAsString(data);
            rabbitTemplate.setExchange(exchange);
            rabbitTemplate.setRoutingKey(routingKey);
            rabbitTemplate.convertAndSend(payload);
            System.out.println("Message sent successfully");
        } catch (JsonProcessingException e) {
            System.err.println(e.getMessage());
        }
    }
}
