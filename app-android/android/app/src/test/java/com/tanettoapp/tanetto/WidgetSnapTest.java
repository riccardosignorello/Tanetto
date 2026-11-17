package com.tanettoapp.tanetto;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Calendar;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

/** 1.0.11: cosa mostra il widget secondo la fotografia e il giorno; mezzanotte; impronta del telefono. */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 34)
public class WidgetSnapTest {

    static final String SNAP = "{\"v\":1,\"pet\":\"ondi\",\"name\":\"Ondi\",\"day\":\"2026-11-16\",\"st\":\"part\",\"d\":2,\"t\":5,\"badge\":\"2/5\","
        + "\"label\":\"goals done today\",\"line\":\"Nice pace, keep it up\",\"a11y\":\"Ondi. 2 of 5 goals today. Nice pace\",\"open\":\"Open Tanetto\","
        + "\"tom\":{\"day\":\"2026-11-17\",\"st\":\"todo\",\"d\":0,\"t\":4,\"badge\":\"0/4\",\"label\":\"goals done today\",\"line\":\"A new day with Ondi\",\"a11y\":\"Ondi. 0 of 4\"}}";

    @Test
    public void todayTomorrowAndOldSnapshots() {
        WidgetSnap a = WidgetSnap.pick(SNAP, "2026-11-16", 0L, "x");
        assertTrue(a.fresh); assertEquals("part", a.state); assertEquals("2/5", a.badge); assertEquals(2, a.done); assertEquals(5, a.total);
        assertEquals(R.drawable.wpet_ondi_part, a.petRes()); assertEquals(R.drawable.wblob_ondi, a.blobRes());
        /* a mezzanotte: il giorno nuovo preparato dall'app */
        WidgetSnap b = WidgetSnap.pick(SNAP, "2026-11-17", 0L, "x");
        assertTrue(b.fresh); assertEquals("todo", b.state); assertEquals("0/4", b.badge); assertEquals("A new day with Ondi", b.line);
        /* due giorni dopo (app non aperta): niente numeri vecchi, il compagno saluta e "Apri Tanetto" nella lingua dell'app */
        WidgetSnap c = WidgetSnap.pick(SNAP, "2026-11-18", 0L, "Apri");
        assertFalse(c.fresh); assertEquals("todo", c.state); assertEquals("", c.badge); assertEquals("Open Tanetto", c.line); assertEquals("Ondi", c.name);
        assertEquals(R.drawable.wpet_ondi_todo, c.petRes());
    }

    @Test
    public void missingBrokenOrStrangeSnapshotsNeverCrash() {
        for (String s : new String[] {null, "", "{", "[]", "{\"pet\":\"drago\",\"st\":\"boh\",\"day\":\"2026-11-16\",\"d\":-4,\"t\":900}"}) {
            WidgetSnap w = WidgetSnap.pick(s, "2026-11-16", 0L, "Open Tanetto");
            assertEquals("germo", w.pet);
            assertTrue(w.petRes() != 0);
            assertTrue(w.done >= 0 && w.done <= w.total && w.total <= 99);
        }
        WidgetSnap w = WidgetSnap.pick(null, "2026-11-16", 0L, "Open Tanetto");
        assertEquals("Tanetto", w.name); assertEquals("Open Tanetto", w.line); assertFalse(w.fresh);
        /* nome lunghissimo: si accorcia (poi il layout mette i puntini) */
        String longName = "{\"name\":\"" + "A".repeat(200) + "\",\"day\":\"2026-11-16\",\"st\":\"todo\",\"t\":3,\"badge\":\"0/3\"}";
        assertEquals(24, WidgetSnap.pick(longName, "2026-11-16", 0L, "x").name.length());
    }

    @Test
    public void tripEndsWhileAppIsClosed() {
        String s = "{\"pet\":\"germo\",\"name\":\"Germo\",\"day\":\"2026-11-16\",\"st\":\"away\",\"line\":\"Germo is on a trip\",\"until\":1000,\"back\":\"Germo is back home\"}";
        WidgetSnap before = WidgetSnap.pick(s, "2026-11-16", 999L, "x");
        assertEquals("away", before.state); assertEquals(1000L, before.until); assertEquals(R.drawable.wpet_germo_away, before.petRes());
        WidgetSnap after = WidgetSnap.pick(s, "2026-11-16", 1000L, "x");
        assertEquals("todo", after.state); assertEquals("Germo is back home", after.line); assertEquals(0L, after.until);
    }

    @Test
    public void nextUpdateAtMidnightOrWhenTheTripEnds() {
        Calendar k = Calendar.getInstance(); k.set(2026, Calendar.NOVEMBER, 16, 22, 30, 0); k.set(Calendar.MILLISECOND, 0);
        long now = k.getTimeInMillis();
        Calendar m = Calendar.getInstance(); m.setTimeInMillis(TanettoWidget.nextMidnight(now));
        assertEquals(17, m.get(Calendar.DAY_OF_MONTH)); assertEquals(0, m.get(Calendar.HOUR_OF_DAY)); assertEquals(20, m.get(Calendar.SECOND));
        assertEquals(TanettoWidget.nextMidnight(now), TanettoWidget.nextTick(now, 0L));
        assertEquals(now + 3600000L + 20000L, TanettoWidget.nextTick(now, now + 3600000L));          /* gita che finisce alle 23:30 */
        assertEquals(TanettoWidget.nextMidnight(now), TanettoWidget.nextTick(now, now + 5 * 3600000L)); /* gita che finisce domani */
        assertEquals(TanettoWidget.nextMidnight(now), TanettoWidget.nextTick(now, now - 1000L));       /* gita gia' finita */
    }

    @Test
    public void deviceFingerprintIsStableHexAndNotTheId() {
        String h = GrowthPlugin.hash("abc123", "com.tanettoapp.tanetto");
        assertTrue(h.matches("^[0-9a-f]{64}$"));
        assertEquals(h, GrowthPlugin.hash("abc123", "com.tanettoapp.tanetto"));
        assertFalse(h.equals(GrowthPlugin.hash("abc124", "com.tanettoapp.tanetto")));
        assertFalse(h.contains("abc123"));
    }
}
