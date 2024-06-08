fun emailConfirmationTemplate(sendTo: String, code: String): String {
    val activationUrl = "http://localhost:8004/users/activate?email=$sendTo&code=$code"
    return """
        <html>
        <body>
            <h1>Bem-vindo!</h1>
            <p>Por favor, clique no botão abaixo para ativar seu e-mail:</p>
            <a href="$activationUrl" style="text-decoration: none;">
                <button style="padding: 10px 20px; background-color: #008CBA; color: white; border: none; border-radius: 5px;">Ativar E-mail</button>
            </a>
        </body>
        </html>
    """.trimIndent()
}