package com.expensemaster.infra.configuration;

import com.expensemaster.infra.SpanAdapter;
import com.expensemaster.infra.queue.Command;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class CommandConfig {

    private final RabbitTemplate rabbitTemplate;
    private final SpanAdapter spanAdapter;

    public CommandConfig(
            final RabbitTemplate rabbitTemplate,
            final SpanAdapter spanAdapter
    ) {
        this.rabbitTemplate = Objects.requireNonNull(rabbitTemplate);
        this.spanAdapter = Objects.requireNonNull(spanAdapter);
    }

    public Command createCommand() {
        return new Command(rabbitTemplate, spanAdapter);
    }
}
