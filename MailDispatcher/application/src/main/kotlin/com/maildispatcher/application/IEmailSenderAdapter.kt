package com.maildispatcher.application

interface IEmailSenderAdapter {
    fun send(to: String, subject: String, text: String)
}