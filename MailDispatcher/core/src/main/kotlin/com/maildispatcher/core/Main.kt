package com.maildispatcher.core

import com.maildispatcher.core.configuration.WebServerConfig
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.core.env.AbstractEnvironment

@SpringBootApplication
open class Main {}

fun main(args: Array<String>) {
    System.setProperty(AbstractEnvironment.DEFAULT_PROFILES_PROPERTY_NAME, "local")
    SpringApplication.run(WebServerConfig::class.java)
}