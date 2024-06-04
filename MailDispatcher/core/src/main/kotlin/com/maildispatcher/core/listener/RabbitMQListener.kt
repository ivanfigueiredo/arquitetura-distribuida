package com.maildispatcher.core.listener

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.maildispatcher.application.NotificationEmailConfirmation
import com.maildispatcher.application.dto.NotificationEmailConfirmationDto
import com.maildispatcher.core.ISpan
import org.springframework.amqp.core.Message
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.stereotype.Component

@Component
class RabbitMQListener(
    private var notificationEmailConfirmation: NotificationEmailConfirmation,
    private var span: ISpan
) {
    @RabbitListener(id = "mailDispatcher", queues = ["\${spring.rabbitmq.queue}"])
    fun onGenerateEmailTokenConfirmation(@Payload message: Message) {
        val mapper = jacksonObjectMapper()
        val result = mapper.readValue<NotificationEmailConfirmationDto>(message.body, NotificationEmailConfirmationDto::class.java)
        span.setHeaders(message.messageProperties.headers)
        span.startSpan("notification.email.confirmation.queue") {
            notificationEmailConfirmation.execute(result)
        }
    }
}