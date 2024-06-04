package com.maildispatcher.core

import jakarta.servlet.http.HttpServletRequest

interface ISpan {
    fun setHeaders(headers: Map<String, Any>);
    fun getHeaders(): MutableMap<String, String>
    fun startSpan(spanName: String, function: ICallback);
}