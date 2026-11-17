package com.tanettoapp.tanetto;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.util.SizeF;
import android.view.View;
import android.widget.RemoteViews;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Widget della schermata Home (1.0.11, rifatto): il compagno in 3D con la posa dello stato del giorno, il suo nome,
 * quanti obiettivi sono fatti oggi e una frase. Due misure nell'elenco dei widget (2x2 = questa classe, 4x2 =
 * TanettoWidgetWide); tutte e due si adattano se vengono allargate o strette. Tocco = apre Tanetto.
 * Si aggiorna quando l'app cambia stato (WidgetPlugin.update), a mezzanotte (sveglia non esatta, senza permessi),
 * quando cambiano ora o fuso orario, e ogni ora (updatePeriodMillis) come rete di sicurezza.
 * Colori: risorse values / values-night, quindi il tema chiaro o scuro lo decide il telefono anche a widget gia' disegnato.
 */
public class TanettoWidget extends AppWidgetProvider {

    static final String PREFS = "tanetto_widget";
    static final String SNAP = "snap";
    static final String ACTION_TICK = "com.tanettoapp.tanetto.WIDGET_TICK";
    /** larghezza (dp) da cui, sotto Android 12, si usa la forma larga */
    static final int WIDE_MIN_DP = 200;

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) manager.updateAppWidget(id, views(context, manager, id));
        scheduleNext(context, current(context));
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager manager, int id, Bundle newOptions) {
        manager.updateAppWidget(id, views(context, manager, id));
    }

    @Override
    public void onEnabled(Context context) { scheduleNext(context, current(context)); }

    @Override
    public void onDisabled(Context context) {
        if (count(context) == 0) cancelMidnight(context);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent == null ? null : intent.getAction();
        if (ACTION_TICK.equals(a) || Intent.ACTION_TIME_CHANGED.equals(a) || Intent.ACTION_TIMEZONE_CHANGED.equals(a)
                || Intent.ACTION_DATE_CHANGED.equals(a) || Intent.ACTION_LOCALE_CHANGED.equals(a)) {
            refreshAll(context);
            return;
        }
        super.onReceive(context, intent);
    }

    /* ---------------- disegno ---------------- */

    static String today() { return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date()); }

    static WidgetSnap current(Context c) {
        SharedPreferences p = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        return WidgetSnap.pick(p.getString(SNAP, null), today(), System.currentTimeMillis(), c.getString(R.string.widget_open));
    }

    /** Forma giusta per la misura del widget: su Android 12+ le due forme insieme (sceglie il telefono, anche ridimensionando). */
    static RemoteViews views(Context c, AppWidgetManager m, int id) {
        WidgetSnap w = current(c);
        if (Build.VERSION.SDK_INT >= 31) {
            Map<SizeF, RemoteViews> map = new HashMap<>();
            map.put(new SizeF(80f, 80f), build(c, w, false));
            map.put(new SizeF(WIDE_MIN_DP, 80f), build(c, w, true));
            return new RemoteViews(map);
        }
        return build(c, w, isWide(m, id));
    }

    static boolean isWide(AppWidgetManager m, int id) {
        try {
            Bundle o = m.getAppWidgetOptions(id);
            if (o != null) {
                int minW = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0);  /* larghezza in verticale */
                if (minW > 0) return minW >= WIDE_MIN_DP;
            }
            android.appwidget.AppWidgetProviderInfo info = m.getAppWidgetInfo(id);
            return info != null && info.provider != null && TanettoWidgetWide.class.getName().equals(info.provider.getClassName());
        } catch (Exception e) {
            return false;
        }
    }

    static RemoteViews build(Context c, WidgetSnap w, boolean wide) {
        RemoteViews v = new RemoteViews(c.getPackageName(), wide ? R.layout.widget_wide : R.layout.widget_small);
        v.setImageViewResource(R.id.w_blob, w.blobRes());
        v.setImageViewResource(R.id.w_pet, w.petRes());
        v.setTextViewText(R.id.w_name, w.name);
        boolean pill = !w.badge.isEmpty();
        v.setViewVisibility(R.id.w_pill, pill ? View.VISIBLE : View.GONE);
        if (pill) {
            v.setTextViewText(R.id.w_badge, w.badge);
            v.setInt(R.id.w_pill, "setBackgroundResource", w.pillRes());
            boolean all = "done".equals(w.state);
            v.setViewVisibility(R.id.w_leaf, all ? View.VISIBLE : View.GONE);
            if (all) v.setImageViewResource(R.id.w_leaf, w.leafRes());
        }
        if (wide) {
            v.setTextViewText(R.id.w_line, w.line);
            v.setViewVisibility(R.id.w_line, w.line.isEmpty() ? View.GONE : View.VISIBLE);
            boolean lab = pill && !w.label.isEmpty();
            v.setTextViewText(R.id.w_label, w.label);
            v.setViewVisibility(R.id.w_label, lab ? View.VISIBLE : View.GONE);
            boolean bar = w.fresh && w.total > 0 && !"away".equals(w.state) && !"free".equals(w.state);
            v.setViewVisibility(R.id.w_bar, bar ? View.VISIBLE : View.GONE);
            if (bar) {
                v.setProgressBar(R.id.w_bar, w.total, w.done, false);
                if (Build.VERSION.SDK_INT >= 31) v.setColorStateList(R.id.w_bar, "setProgressTintList", w.accentColorRes());
            }
        } else {
            /* nel widget piccolo, senza numeri (giorno libero, gita, app non aperta oggi), la frase breve sotto al nome */
            boolean showLine = !pill && !w.line.isEmpty();
            v.setTextViewText(R.id.w_line, w.line);
            v.setViewVisibility(R.id.w_line, showLine ? View.VISIBLE : View.GONE);
        }
        v.setContentDescription(R.id.widget_root, w.a11y);
        Intent open = new Intent(c, MainActivity.class);
        open.setAction(Intent.ACTION_MAIN);
        open.addCategory(Intent.CATEGORY_LAUNCHER);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        open.putExtra("from", "widget");
        PendingIntent pi = PendingIntent.getActivity(c, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        v.setOnClickPendingIntent(R.id.widget_root, pi);
        return v;
    }

    /* ---------------- aggiornamenti ---------------- */

    static int[] ids(Context c, Class<?> cls) {
        int[] r = AppWidgetManager.getInstance(c).getAppWidgetIds(new ComponentName(c, cls));
        return r == null ? new int[0] : r;
    }

    static int count(Context c) { return ids(c, TanettoWidget.class).length + ids(c, TanettoWidgetWide.class).length; }

    static void refreshAll(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        for (Class<?> cls : new Class<?>[] {TanettoWidget.class, TanettoWidgetWide.class})
            for (int id : ids(c, cls)) m.updateAppWidget(id, views(c, m, id));
        if (count(c) > 0) scheduleNext(c, current(c)); else cancelMidnight(c);
        /* la vecchia immagine del compagno disegnata dall'app (1.0.10) non serve piu' */
        try { new File(c.getFilesDir(), "widget_pet.png").delete(); } catch (Exception e) { /* niente */ }
    }

    /** Prossima mezzanotte (piu' 20 secondi) nell'ora del telefono. */
    static long nextMidnight(long now) {
        Calendar k = Calendar.getInstance();
        k.setTimeInMillis(now);
        k.add(Calendar.DAY_OF_YEAR, 1);
        k.set(Calendar.HOUR_OF_DAY, 0);
        k.set(Calendar.MINUTE, 0);
        k.set(Calendar.SECOND, 20);
        k.set(Calendar.MILLISECOND, 0);
        return k.getTimeInMillis();
    }

    private static PendingIntent tick(Context c) {
        Intent i = new Intent(c, TanettoWidget.class).setAction(ACTION_TICK);
        return PendingIntent.getBroadcast(c, 7, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Prossimo aggiornamento: mezzanotte, oppure prima se la gita finisce prima. */
    static long nextTick(long now, long until) {
        long m = nextMidnight(now);
        return (until > now && until < m) ? until + 20000L : m;
    }

    /** Sveglia NON esatta (nessun permesso): con il telefono in riposo puo' arrivare qualche minuto dopo, va bene cosi'. */
    static void scheduleNext(Context c, WidgetSnap w) {
        try {
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;
            am.setAndAllowWhileIdle(AlarmManager.RTC, nextTick(System.currentTimeMillis(), w == null ? 0L : w.until), tick(c));
        } catch (Exception e) { /* il controllo orario del widget resta */ }
    }

    static void cancelMidnight(Context c) {
        try {
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            if (am != null) am.cancel(tick(c));
        } catch (Exception e) { /* niente */ }
    }
}
