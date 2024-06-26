package com.maildispatcher.core.api

import com.maildispatcher.application.INotificationEmailConfirmation
import com.maildispatcher.core.ISpan
import io.opentelemetry.api.trace.SpanKind
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import java.util.logging.Logger

@RestController
class MainDispatcher(
    private val notificationEmailConfirmation: INotificationEmailConfirmation,
    private val span: ISpan
) : IMailDispatcher {
    private var log = Logger.getLogger(MainDispatcher::class.java.name)

    override fun generateEmailConfirmationToken(request: HttpServletRequest, input: NotificationEmailConfirmationInput): ResponseEntity<String> {
        val headers = headersToMap(request)
        span.setHeaders(headers)
        span.startSpan("notification.email.confirmation", SpanKind.SERVER) {
            log.info("Recebendo requisicao HTTP para notificacao por E-mail")
            notificationEmailConfirmation.execute(input.toNotificationEmailConfirmationDto())
        }
        return ResponseEntity("OK", HttpStatus.OK)
    }

    private fun headersToMap(request: HttpServletRequest): Map<String, Any> {
        val headers = mutableMapOf<String, Any>()
        val headersNames = request.headerNames
        while (headersNames.hasMoreElements()) {
            val key = headersNames.nextElement()
            val value = request.getHeader(key)
            headers[key] = value
        }
        return headers
    }
}