package com.expensemaster.core.queue;

import com.expensemaster.application.user.Queue.ICommand;
import com.expensemaster.core.ISpanAdapter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class Command implements ICommand {

    private final Logger logger = LoggerFactory.getLogger(Command.class);
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
            logger.info("Publicando evento na Exchange: " + exchange + " e " + "routingKey: " + routingKey);
            final var context = this.spanAdapter.contextPropagationQueue();
            final var payload = mapper.writeValueAsString(data);
            rabbitTemplate.setExchange(exchange);
            rabbitTemplate.setRoutingKey(routingKey);
            final var message = new Message(payload.getBytes(), context);
            spanAdapter.startSpan("producer.create.user.event", () -> rabbitTemplate.convertAndSend(message));
            logger.info("Evento publicado com sucesso");
        } catch (JsonProcessingException e) {
            logger.error(e.getMessage(), e);
        }
    }
}
