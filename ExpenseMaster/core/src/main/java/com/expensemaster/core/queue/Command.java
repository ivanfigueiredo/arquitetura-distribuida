package com.expensemaster.core.queue;

import com.expensemaster.application.user.Queue.ICommand;
import com.expensemaster.core.ISpanAdapter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class Command implements ICommand {

    private final RabbitTemplate rabbitTemplate;
    private final ISpanAdapter spanAdapter;

    public Command(
            final RabbitTemplate rabbitTemplate,
            final ISpanAdapter spanAdapter
    ) {
        this.rabbitTemplate = Objects.requireNonNull(rabbitTemplate);
        this.spanAdapter = Objects.requireNonNull(spanAdapter);
    }

    @Override
    public <T> void sendCommand(String exchange, String routingKey, T data) {
        final var mapper = new ObjectMapper();
        try {
            final var context = this.spanAdapter.contextPropagation();
            final var payload = mapper.writeValueAsString(data);
            rabbitTemplate.setExchange(exchange);
            rabbitTemplate.setRoutingKey(routingKey);
            final var message = new Message(payload.getBytes(), context);
            spanAdapter.startSpan("producer.create.user.event", () -> rabbitTemplate.convertAndSend(message));
            System.out.println("Message sent successfully");
        } catch (JsonProcessingException e) {
            System.err.println(e.getMessage());
        }
    }
}
