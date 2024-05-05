package com.expensemaster.application.user.dto;

import java.io.Serial;
import java.io.Serializable;

public class BudgetDto {
    final int totalLimit;
    final String startDate;

    public BudgetDto(final int totalLimit, final String startDate) {
        this.startDate = startDate;
        this.totalLimit = totalLimit;
    }

    public int getTotalLimit() {
        return totalLimit;
    }

    public String getStartDate() {
        return startDate;
    }
}
