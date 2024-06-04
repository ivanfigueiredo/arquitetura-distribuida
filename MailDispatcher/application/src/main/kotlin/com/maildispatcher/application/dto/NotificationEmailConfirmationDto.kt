package com.maildispatcher.application.dto

data class NotificationEmailConfirmationDto(
    val token: String,
    val email: String
) {
    override fun toString(): String {
        return "GenerateEmailConfirmationTokenDto(token: $token, email: $email)"
    }
}
