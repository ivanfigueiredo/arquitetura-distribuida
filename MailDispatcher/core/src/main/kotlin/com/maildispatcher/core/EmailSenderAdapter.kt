package com.maildispatcher.core

import com.maildispatcher.application.IEmailSenderAdapter
import emailConfirmationTemplate
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Component

@Component
class EmailSenderAdapter(private var javaMailSender: JavaMailSender) : IEmailSenderAdapter {
    override fun send(to: String, subject: String, text: String) {
        val mimeMessage = javaMailSender.createMimeMessage()
        val message = MimeMessageHelper(mimeMessage, "UTF-8")
        val body = emailConfirmationTemplate(to, text)
        message.setTo(to)
        message.setSubject(subject)
        message.setText(body, true)
        javaMailSender.send(mimeMessage)
    }
}