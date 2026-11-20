package com.tanettoapp.tanetto;

/** Pure age-band policy shared by native AdMob enforcement and unit tests. */
final class AgePolicy {
    private AgePolicy() {}

    /** A saved birth month/year is immutable; an explicit skip may be replaced by one answer. */
    static boolean canReplace(boolean hasExisting, boolean existingSkip, int existingYear, int existingMonth,
                              boolean incomingSkip, int incomingYear, int incomingMonth) {
        if (!hasExisting || existingSkip) return true;
        return !incomingSkip && existingYear == incomingYear && existingMonth == incomingMonth;
    }

    static String band(boolean skip, int birthYear, int birthMonth, int currentYear, int currentMonth) {
        if (skip) return "teen";
        if (birthYear < 1900 || birthYear > currentYear || birthMonth < 1 || birthMonth > 12
                || currentMonth < 1 || currentMonth > 12) return "pending";
        int years = currentYear - birthYear - (currentMonth <= birthMonth ? 1 : 0);
        return years < 13 ? "child" : years < 18 ? "teen" : "adult";
    }
}
