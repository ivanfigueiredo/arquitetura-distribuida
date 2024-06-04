package com.maildispatcher.core.api

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping

@RequestMapping(value = ["/"])
interface IMailDispatcher {
    @PostMapping(
        value = ["notification-email-confirmation"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun generateEmailConfirmationToken(request: HttpServletRequest,  @RequestBody input: NotificationEmailConfirmationInput): ResponseEntity<String>;
}