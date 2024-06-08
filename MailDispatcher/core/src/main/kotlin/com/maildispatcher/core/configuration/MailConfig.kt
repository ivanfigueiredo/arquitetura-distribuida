package com.maildispatcher.core.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl

@Configuration
open class MailConfig {
    @Value("\${mail.sender.host}")
    private lateinit var host: String

    @Value("\${mail.sender.port}")
    private lateinit var port: String

    @Value("\${mail.sender.username}")
    private lateinit var username: String

    @Value("\${mail.sender.password}")
    private lateinit var password: String
    @Bean
    open fun mailSender(): JavaMailSender {
        val mailSender = JavaMailSenderImpl()
        mailSender.host = host
        mailSender.port = port.toInt()
        mailSender.username = username
        mailSender.password = password

        val props = mailSender.javaMailProperties
        props["mail.transport.protocol"] = "smtp"
        props["mail.smtp.auth"] = "true"
        props["mail.smtp.starttls.enable"] = "true"
        props["mail.debug"] = "true"

        return mailSender
    }
}