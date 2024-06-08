package com.maildispatcher.application.dto

data class NotificationEmailConfirmationDto(
    val code: String,
    val email: String
) {
    override fun toString(): String {
        return "GenerateEmailConfirmationTokenDto(token: $code, email: $email)"
    }
}
