package com.maildispatcher.core.api

import com.fasterxml.jackson.annotation.JsonProperty
import com.maildispatcher.application.dto.NotificationEmailConfirmationDto

data class NotificationEmailConfirmationInput(
    val email: String,
    val token: String
) {
    fun toNotificationEmailConfirmationDto(): NotificationEmailConfirmationDto {
        return NotificationEmailConfirmationDto(token, email)
    }
}
