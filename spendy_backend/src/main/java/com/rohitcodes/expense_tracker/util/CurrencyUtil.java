package com.rohitcodes.expense_tracker.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Currency;
import java.util.Locale;

public final class CurrencyUtil {

    private CurrencyUtil() {
    }

    public static BigDecimal normalize(BigDecimal amount) {
        if (amount == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        return amount.setScale(2, RoundingMode.HALF_UP);
    }

    public static String format(BigDecimal amount) {
        Locale locale = new Locale(Constants.DEFAULT_LOCALE_LANGUAGE, Constants.DEFAULT_LOCALE_COUNTRY);
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        formatter.setCurrency(Currency.getInstance(Constants.DEFAULT_CURRENCY_CODE));
        return formatter.format(normalize(amount));
    }
}