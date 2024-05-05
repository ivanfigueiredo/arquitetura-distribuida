package com.expensemaster.infra.configuration;

import com.expensemaster.infra.queue.Command;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class CommandConfig {

    private final RabbitTemplate rabbitTemplate;

    public CommandConfig(final RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = Objects.requireNonNull(rabbitTemplate);
    }

    public Command createCommand() {
        return new Command(rabbitTemplate);
    }
}
