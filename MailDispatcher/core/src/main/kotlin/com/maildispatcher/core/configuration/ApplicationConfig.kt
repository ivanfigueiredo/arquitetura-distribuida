package com.maildispatcher.core.configuration

import com.maildispatcher.application.NotificationEmailConfirmation
import com.maildispatcher.core.EmailSenderAdapter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
open class ApplicationConfig(private var emailSenderAdapter: EmailSenderAdapter) {

    @Bean
    open fun generateEmailConfirmationToken(): NotificationEmailConfirmation {
        return NotificationEmailConfirmation(emailSenderAdapter)
    }
}