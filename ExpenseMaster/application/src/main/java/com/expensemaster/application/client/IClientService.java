package com.expensemaster.application.client;

import com.expensemaster.application.client.dto.ClientRegistrationDto;

public interface IClientService {
    public void registration(final ClientRegistrationDto dto);
}
