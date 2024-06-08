package com.maildispatcher.application

interface EmailSenderGateway {
    fun send(to: String, subject: String)
}