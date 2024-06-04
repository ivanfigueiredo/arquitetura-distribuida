package com.maildispatcher.application

import com.maildispatcher.application.dto.NotificationEmailConfirmationDto

interface INotificationEmailConfirmation {
    fun execute(dto: NotificationEmailConfirmationDto);
}