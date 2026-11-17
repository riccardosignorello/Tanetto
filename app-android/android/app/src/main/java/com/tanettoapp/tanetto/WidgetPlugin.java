package com.tanettoapp.tanetto;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONObject;

/**
 * Ponte app -> widget (1.0.11). L'app manda una "fotografia" del giorno (compagno, nome, obiettivi fatti, frasi gia'
 * tradotte e il giorno dopo gia' pronto per la mezzanotte); qui si salva in SharedPreferences e si ridisegnano i widget.
 * Niente immagini dall'app: le pose 3D sono nell'APK. Puo' anche chiedere ad Android di aggiungere un widget alla Home.
 */
@CapacitorPlugin(name = "TanettoWidget")
public class WidgetPlugin extends Plugin {

    static final int MAX_SNAP = 4000;

    @PluginMethod
    public void update(PluginCall call) {
        Context c = getContext();
        try {
            if (Boolean.TRUE.equals(call.getBoolean("reset", false))) {
                /* uscita dall'account o "Ricomincia da capo": il widget torna quello iniziale */
                c.getSharedPreferences(TanettoWidget.PREFS, Context.MODE_PRIVATE).edit().clear().apply();
                TanettoWidget.refreshAll(c);
                call.resolve();
                return;
            }
            JSONObject snap = call.getObject("snap");
            if (snap == null) { call.reject("no snapshot", "bad"); return; }
            String s = snap.toString();
            if (s.length() > MAX_SNAP) { call.reject("snapshot too big", "bad"); return; }
            c.getSharedPreferences(TanettoWidget.PREFS, Context.MODE_PRIVATE).edit().clear().putString(TanettoWidget.SNAP, s).apply();
            TanettoWidget.refreshAll(c);
            JSObject o = new JSObject();
            o.put("count", TanettoWidget.count(c));
            call.resolve(o);
        } catch (Exception e) {
            call.reject("widget update failed", "error");
        }
    }

    static boolean canPin(Context c) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return false;
        try { return AppWidgetManager.getInstance(c).isRequestPinAppWidgetSupported(); } catch (Exception e) { return false; }
    }

    @PluginMethod
    public void info(PluginCall call) {
        Context c = getContext();
        JSObject o = new JSObject();
        int small = TanettoWidget.ids(c, TanettoWidget.class).length, wide = TanettoWidget.ids(c, TanettoWidgetWide.class).length;
        o.put("count", small + wide);
        o.put("small", small);
        o.put("wide", wide);
        o.put("canPin", canPin(c));
        o.put("sdk", Build.VERSION.SDK_INT);
        call.resolve(o);
    }

    /** Android mostra la sua finestra "Aggiungi alla schermata Home" (API 26+, se il launcher lo permette). */
    @PluginMethod
    public void pin(PluginCall call) {
        Context c = getContext();
        if (!canPin(c)) { call.reject("pin not supported", "unsupported"); return; }
        try {
            Class<?> cls = "wide".equals(call.getString("size", "small")) ? TanettoWidgetWide.class : TanettoWidget.class;
            boolean ok = AppWidgetManager.getInstance(c).requestPinAppWidget(new ComponentName(c, cls), null, null);
            JSObject o = new JSObject();
            o.put("asked", ok);
            call.resolve(o);
        } catch (Exception e) {
            call.reject("pin failed", "unsupported");
        }
    }
}
