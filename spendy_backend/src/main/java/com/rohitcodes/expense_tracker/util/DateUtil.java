package com.rohitcodes.expense_tracker.util;

import java.time.LocalDate;
import java.time.YearMonth;

public final class DateUtil {

    private DateUtil() {
    }

    public static LocalDate getMonthStart(Integer year, Integer month) {
        validateYearMonth(year, month);
        return YearMonth.of(year, month).atDay(1);
    }

    public static LocalDate getMonthEnd(Integer year, Integer month) {
        validateYearMonth(year, month);
        return YearMonth.of(year, month).atEndOfMonth();
    }

    public static boolean isValidRange(LocalDate startDate, LocalDate endDate) {
        return startDate != null && endDate != null && !startDate.isAfter(endDate);
    }

    public static void validateYearMonth(Integer year, Integer month) {
        if (year == null) {
            throw new IllegalArgumentException("Year is required");
        }

        if (month == null || month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
    }
}