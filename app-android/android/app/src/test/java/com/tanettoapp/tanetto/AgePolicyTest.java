package com.tanettoapp.tanetto;

import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class AgePolicyTest {
    @Test public void skipIsConservativelyTeen() {
        assertEquals("teen", AgePolicy.band(true, -1, -1, 2026, 11));
    }

    @Test public void birthdayMonthUsesConservativeBoundary() {
        assertEquals("teen", AgePolicy.band(false, 2013, 11, 2026, 11));
        assertEquals("child", AgePolicy.band(false, 2013, 12, 2026, 11));
        assertEquals("teen", AgePolicy.band(false, 2013, 10, 2026, 11));
    }

    @Test public void adultBoundaryIsEighteen() {
        assertEquals("teen", AgePolicy.band(false, 2008, 12, 2026, 11));
        assertEquals("adult", AgePolicy.band(false, 2008, 10, 2026, 11));
    }

    @Test public void invalidOrFutureChoicesFailClosed() {
        assertEquals("pending", AgePolicy.band(false, 2027, 1, 2026, 11));
        assertEquals("pending", AgePolicy.band(false, 2010, 13, 2026, 11));
        assertEquals("pending", AgePolicy.band(false, 2010, 1, 2026, 0));
    }
}
