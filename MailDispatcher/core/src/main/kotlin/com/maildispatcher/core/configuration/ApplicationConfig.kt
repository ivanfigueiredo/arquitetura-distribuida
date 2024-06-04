package com.maildispatcher.core.configuration

import com.maildispatcher.application.NotificationEmailConfirmation
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
open class ApplicationConfig {

    @Bean
    open fun generateEmailConfirmationToken(): NotificationEmailConfirmation {
        return NotificationEmailConfirmation()
    }
}