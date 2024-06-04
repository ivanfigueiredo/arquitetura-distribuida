package com.maildispatcher.application

import com.maildispatcher.application.dto.NotificationEmailConfirmationDto

class NotificationEmailConfirmation : INotificationEmailConfirmation {
    override fun execute(dto: NotificationEmailConfirmationDto) {
        println("==================>>>>>>> Gouache: $dto")
    }
}