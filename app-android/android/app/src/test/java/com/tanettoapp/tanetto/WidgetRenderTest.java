package com.tanettoapp.tanetto;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.text.Layout;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.RemoteViews;
import android.widget.TextView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;
import org.robolectric.annotation.GraphicsMode;

/**
 * 1.0.11: il widget disegnato davvero (grafica nativa di Robolectric) con le fotografie vere dell'app nelle 14 lingue
 * (src/test/resources/n111_snaps.json, scritte da tests/t110/t_n111_native.py), nelle due forme, a tre misure
 * (telefono 360 dp, telefono 412 dp, tablet) e nei temi chiaro e scuro. Controlla che nome, pillola e frasi non vengano
 * tagliati e che niente esca dal widget; salva le immagini in build/n111_widget (o nella cartella N111_WSHOTS).
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 34, qualifiers = "w412dp-h915dp-port-notnight-xxhdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
public class WidgetRenderTest {

    static final String Q = "w412dp-h915dp-port";
    static final String[] STATES = {"todo", "part", "done", "free", "away"};
    /* misure del widget in dp: {larghezza, altezza} per 2x2 e 4x2 nelle tre griglie (launcher comuni) */
    static final int[][] SMALL = {{150, 150}, {170, 176}, {220, 210}};
    static final int[][] WIDE = {{320, 150}, {366, 176}, {460, 210}};
    static final String[] SIZE = {"360", "412", "tablet"};
    static final float DENSITY = 3f;  /* xxhdpi, come i telefoni comuni (qualificatore "xxhdpi" sotto) */

    static JSONObject snaps() throws Exception {
        try (InputStream in = WidgetRenderTest.class.getResourceAsStream("/n111_snaps.json")) {
            return new JSONObject(new String(in.readAllBytes(), StandardCharsets.UTF_8));
        }
    }

    static File outDir() {
        String d = System.getenv("N111_WSHOTS");
        File f = new File(d == null || d.isEmpty() ? "build/n111_widget" : d);
        f.mkdirs();
        return f;
    }

    /** Disegna il widget alla misura data (dp) e restituisce la vista (gia' misurata). */
    static View render(Context c, WidgetSnap w, boolean wide, int wdp, int hdp) {
        RemoteViews rv = TanettoWidget.build(c, w, wide);
        FrameLayout parent = new FrameLayout(c);
        View v = rv.apply(c, parent);
        int wpx = Math.round(wdp * DENSITY), hpx = Math.round(hdp * DENSITY);
        v.measure(View.MeasureSpec.makeMeasureSpec(wpx, View.MeasureSpec.EXACTLY), View.MeasureSpec.makeMeasureSpec(hpx, View.MeasureSpec.EXACTLY));
        v.layout(0, 0, wpx, hpx);
        return v;
    }

    static Bitmap draw(View v) {
        Bitmap b = Bitmap.createBitmap(v.getWidth(), v.getHeight(), Bitmap.Config.ARGB_8888);
        v.draw(new Canvas(b));
        return b;
    }

    /** Problemi: testo tagliato (puntini) o fuori dal widget; pillola o nome tagliati. */
    static List<String> problems(View root, String where) {
        List<String> out = new ArrayList<>();
        walk(root, root, where, out);
        return out;
    }

    private static void walk(View root, View v, String where, List<String> out) {
        if (v.getVisibility() != View.VISIBLE) return;
        if (v instanceof TextView) {
            TextView t = (TextView) v;
            Layout l = t.getLayout();
            String name = root.getResources().getResourceEntryName(t.getId());
            if (l != null && t.getText().length() > 0) {
                for (int i = 0; i < l.getLineCount(); i++)
                    if (l.getEllipsisCount(i) > 0) out.add(where + " " + name + " tagliato: \"" + t.getText() + "\"");
                if (t.getWidth() < 4) out.add(where + " " + name + " senza spazio");
            }
            int[] p = new int[2];
            int x = 0, y = 0;
            for (View q = v; q != root && q != null; q = (View) q.getParent()) { x += q.getLeft(); y += q.getTop(); }
            if (x + v.getWidth() > root.getWidth() + 1 || y + v.getHeight() > root.getHeight() + 1)
                out.add(where + " " + name + " esce dal widget");
        }
        if (v instanceof ViewGroup) {
            ViewGroup g = (ViewGroup) v;
            for (int i = 0; i < g.getChildCount(); i++) walk(root, g.getChildAt(i), where, out);
        }
    }

    static void save(Bitmap b, File f) throws Exception {
        try (FileOutputStream o = new FileOutputStream(f)) { b.compress(Bitmap.CompressFormat.PNG, 100, o); }
    }

    /** Un foglio per lingua e tema: righe = stati del giorno, colonne = 2x2 e 4x2 (misura 412), su uno sfondo da Home. */
    private void sheet(Context c, JSONObject all, String lang, boolean night, List<String> bad) throws Exception {
        JSONObject l = all.getJSONObject(lang);
        int pad = 36, gap = 30, k = 1;
        int sw = Math.round(SMALL[k][0] * DENSITY), sh = Math.round(SMALL[k][1] * DENSITY), ww = Math.round(WIDE[k][0] * DENSITY);
        Bitmap page = Bitmap.createBitmap(pad * 2 + sw + gap + ww, pad * 2 + STATES.length * (sh + gap) - gap, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(page);
        page.eraseColor(night ? Color.rgb(28, 32, 44) : Color.rgb(196, 214, 232));   /* sfondo come uno sfondo della Home */
        Paint dot = new Paint(Paint.ANTI_ALIAS_FLAG); dot.setColor(night ? Color.rgb(44, 50, 66) : Color.rgb(176, 198, 222));
        for (int i = 0; i < 40; i++) cv.drawCircle((i * 97) % page.getWidth(), (i * 151) % page.getHeight(), 60, dot);
        for (int r = 0; r < STATES.length; r++) {
            WidgetSnap w = WidgetSnap.pick(l.getJSONObject(STATES[r]).toString(), "2026-11-16", 0L, "Open Tanetto");
            assertTrue(lang + " " + STATES[r] + " fotografia di oggi", w.fresh);
            for (int col = 0; col < 2; col++) {
                boolean wide = col == 1;
                for (int s = 0; s < SIZE.length; s++) {
                    int[] d = wide ? WIDE[s] : SMALL[s];
                    View v = render(c, w, wide, d[0], d[1]);
                    bad.addAll(problems(v, lang + (night ? " scuro " : " chiaro ") + SIZE[s] + " " + (wide ? "4x2 " : "2x2 ") + STATES[r]));
                    if (s == k) {
                        cv.save();
                        cv.translate(pad + (wide ? sw + gap : 0), pad + r * (sh + gap));
                        v.draw(cv);
                        cv.restore();
                    }
                }
            }
        }
        save(page, new File(outDir(), "widget_" + lang + (night ? "_scuro" : "_chiaro") + ".png"));
    }

    @Test
    public void widgetIn14LanguagesThreeSizesLightAndDark() throws Exception {
        JSONObject all = snaps();
        List<String> bad = new ArrayList<>();
        int langs = 0;
        for (Iterator<String> it = all.keys(); it.hasNext(); ) {
            String lang = it.next(); langs++;
            RuntimeEnvironment.setQualifiers(Q + "-notnight-xxhdpi");
            sheet(RuntimeEnvironment.getApplication(), all, lang, false, bad);
            RuntimeEnvironment.setQualifiers(Q + "-night-xxhdpi");
            sheet(RuntimeEnvironment.getApplication(), all, lang, true, bad);
        }
        RuntimeEnvironment.setQualifiers(Q + "-notnight-xxhdpi");
        assertEquals(14, langs);
        assertTrue(String.join("\n", bad), bad.isEmpty());
    }

    @Test
    public void themeColorsFollowTheSystem() throws Exception {
        JSONObject all = snaps();
        WidgetSnap w = WidgetSnap.pick(all.getJSONObject("it").getJSONObject("part").toString(), "2026-11-16", 0L, "Apri Tanetto");
        RuntimeEnvironment.setQualifiers(Q + "-notnight-xxhdpi");
        Context c = RuntimeEnvironment.getApplication();
        Bitmap light = draw(render(c, w, false, 170, 176));
        RuntimeEnvironment.setQualifiers(Q + "-night-xxhdpi");
        c = RuntimeEnvironment.getApplication();
        Bitmap dark = draw(render(c, w, false, 170, 176));
        RuntimeEnvironment.setQualifiers(Q + "-notnight-xxhdpi");
        int pl = light.getPixel(light.getWidth() / 2, light.getHeight() - 30), pd = dark.getPixel(dark.getWidth() / 2, dark.getHeight() - 30);
        assertTrue("chiaro: fondo crema", Color.red(pl) > 230 && Color.green(pl) > 225);
        assertTrue("scuro: fondo scuro", Color.red(pd) < 70 && Color.green(pd) < 70);
    }

    @Test
    public void smallWidgetShowsPillOrLineAndWideShowsBar() throws Exception {
        JSONObject all = snaps();
        Context c = RuntimeEnvironment.getApplication();
        WidgetSnap part = WidgetSnap.pick(all.getJSONObject("en").getJSONObject("part").toString(), "2026-11-16", 0L, "Open Tanetto");
        View s = render(c, part, false, 170, 176);
        assertEquals(View.VISIBLE, s.findViewById(R.id.w_pill).getVisibility());
        assertEquals("2/5", ((TextView) s.findViewById(R.id.w_badge)).getText().toString());
        assertEquals(View.GONE, s.findViewById(R.id.w_line).getVisibility());
        assertEquals(View.GONE, s.findViewById(R.id.w_leaf).getVisibility());
        View w = render(c, part, true, 366, 176);
        ProgressBar bar = w.findViewById(R.id.w_bar);
        assertEquals(View.VISIBLE, bar.getVisibility());
        assertEquals(5, bar.getMax());
        assertEquals(2, bar.getProgress());
        assertEquals("goals done today", ((TextView) w.findViewById(R.id.w_label)).getText().toString());
        WidgetSnap done = WidgetSnap.pick(all.getJSONObject("en").getJSONObject("done").toString(), "2026-11-16", 0L, "Open Tanetto");
        assertEquals(View.VISIBLE, render(c, done, false, 170, 176).findViewById(R.id.w_leaf).getVisibility());
        WidgetSnap free = WidgetSnap.pick(all.getJSONObject("en").getJSONObject("free").toString(), "2026-11-16", 0L, "Open Tanetto");
        View f = render(c, free, false, 170, 176);
        assertEquals(View.GONE, f.findViewById(R.id.w_pill).getVisibility());
        assertEquals(View.VISIBLE, f.findViewById(R.id.w_line).getVisibility());
        assertEquals(View.GONE, render(c, free, true, 366, 176).findViewById(R.id.w_bar).getVisibility());
        /* TalkBack: una frase intera sul widget */
        assertTrue(s.getContentDescription().toString().contains("2 of 5"));
        assertTrue(s.getContentDescription().toString().startsWith(part.name));
    }

    /** Anteprime per l'elenco dei widget (Android 11 e precedenti): Germo, 2 obiettivi su 4, tema chiaro. */
    @Test
    public void writePickerPreviews() throws Exception {
        JSONObject en = snaps().getJSONObject("en").getJSONObject("part");
        en.put("name", "Germo").put("pet", "germo").put("badge", "2/4").put("d", 2).put("t", 4);
        RuntimeEnvironment.setQualifiers(Q + "-notnight-xxhdpi");
        Context c = RuntimeEnvironment.getApplication();
        WidgetSnap w = WidgetSnap.pick(en.toString(), "2026-11-16", 0L, "Open Tanetto");
        save(draw(render(c, w, false, 170, 176)), new File(outDir(), "widget_preview_small.png"));
        save(draw(render(c, w, true, 366, 176)), new File(outDir(), "widget_preview_wide.png"));
        assertTrue(new File(outDir(), "widget_preview_wide.png").length() > 1000);
    }
}
