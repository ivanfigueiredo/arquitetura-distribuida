package com.maildispatcher.application

import com.maildispatcher.application.dto.NotificationEmailConfirmationDto

class NotificationEmailConfirmation(private var emailSenderAdapter: IEmailSenderAdapter) : INotificationEmailConfirmation {
    override fun execute(dto: NotificationEmailConfirmationDto) {
        val subject = "Confirmação de Email"
        emailSenderAdapter.send(dto.email, subject, dto.code)
    }
}