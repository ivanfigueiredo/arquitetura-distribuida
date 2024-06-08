package com.expensemaster.user.template;

public class Template {
    private Template() {}

    public static String confirmedEmail() {
        return "<!DOCTYPE html>" +
                "<html lang=\"pt-BR\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Verificação de E-mail</title>" +
                "    <style>" +
                "        body {" +
                "            font-family: Arial, sans-serif;" +
                "            background-color: #f4f4f9;" +
                "            display: flex;" +
                "            justify-content: center;" +
                "            align-items: center;" +
                "            height: 100vh;" +
                "            margin: 0;" +
                "        }" +
                "        .container {" +
                "            background-color: white;" +
                "            padding: 20px;" +
                "            border-radius: 10px;" +
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" +
                "            text-align: center;" +
                "        }" +
                "        h1 {" +
                "            color: #4CAF50;" +
                "        }" +
                "        p {" +
                "            font-size: 1.2em;" +
                "            color: #333;" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"container\">" +
                "        <h1>Verificação de E-mail</h1>" +
                "        <p>Seu e-mail foi verificado com sucesso!</p>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
