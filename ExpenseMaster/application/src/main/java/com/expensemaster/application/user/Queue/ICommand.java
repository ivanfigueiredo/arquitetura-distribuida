package com.expensemaster.application.user.Queue;

public interface ICommand {
    public <T> void sendCommand(
        final String exchange,
        final String routingKey,
        final T data
    );
}
