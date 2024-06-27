package com.maildispatcher.application

import com.maildispatcher.application.dto.NotificationEmailConfirmationDto
import java.util.logging.Logger

class NotificationEmailConfirmation(
    private var emailSenderAdapter: IEmailSenderAdapter
) : INotificationEmailConfirmation {
    private var log = Logger.getLogger(NotificationEmailConfirmation::class.java.name)

    override fun execute(dto: NotificationEmailConfirmationDto) {
        log.info("Iniciando execucao do servicao para notificacao por E-mail")
        val subject = "Confirmação de Email"
        log.info("Enviando notificacao por E-mail para ${dto.email}")
        emailSenderAdapter.send(dto.email, subject, dto.code)
    }
}