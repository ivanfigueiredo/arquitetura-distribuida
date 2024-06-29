package com.expensemaster.core.configuration;

import com.expensemaster.application.client.ClientService;
import com.expensemaster.core.queue.Command;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClientServiceConfig {
    @Bean
    public ClientService clientService(final Command command) {
        return new ClientService(command);
    }
}
