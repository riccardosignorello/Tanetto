package com.tanettoapp.tanetto;

import android.content.Context;
import android.content.SharedPreferences;
import android.provider.Settings;
import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * 1.0.11 "Invita un amico" (solo adulti, la logica e' nell'app: src/98zz_n111_invite.js).
 *  - referrer(): legge UNA volta il referrer di Google Play (Play Install Referrer API) e lo ricorda; le volte dopo
 *    risponde con quello salvato (Google consiglia una sola chiamata dopo l'installazione: i dati restano 90 giorni).
 *    Il file "tanetto_ref" non va nel backup di Google (regole in res/xml): su un telefono nuovo vale l'installazione nuova.
 *  - device(): impronta del dispositivo per i controlli contro gli abusi (stesso telefono che invita e si fa invitare,
 *    stesso telefono che riceve il regalo piu' volte). E' SHA-256 di ANDROID_ID con un prefisso fisso dell'app: non si
 *    puo' tornare indietro all'ID e da Android 8 l'ID e' diverso per ogni app. Si chiede solo quando un adulto usa
 *    l'invito (mai a bambini, ragazzi o a chi non ha detto l'eta': lo decide l'app prima di chiamare).
 */
@CapacitorPlugin(name = "TanettoGrowth")
public class GrowthPlugin extends Plugin {

    static final String PREFS = "tanetto_ref";
    static final int MAX_TRIES = 3;

    private SharedPreferences prefs() { return getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    private static JSObject fromPrefs(SharedPreferences p) {
        JSObject o = new JSObject();
        o.put("done", true);
        o.put("ref", p.getString("ref", ""));
        o.put("click", p.getLong("click", 0L));
        o.put("install", p.getLong("install", 0L));
        return o;
    }

    @PluginMethod
    public void referrer(PluginCall call) {
        final SharedPreferences p = prefs();
        if (p.getBoolean("done", false)) { call.resolve(fromPrefs(p)); return; }
        final int tries = p.getInt("tries", 0);
        if (tries >= MAX_TRIES) { p.edit().putBoolean("done", true).apply(); call.resolve(fromPrefs(p)); return; }
        p.edit().putInt("tries", tries + 1).apply();
        final InstallReferrerClient client;
        try {
            client = InstallReferrerClient.newBuilder(getContext()).build();
        } catch (Exception e) {
            JSObject o = new JSObject(); o.put("done", false); call.resolve(o); return;
        }
        final boolean[] answered = {false};
        try {
            client.startConnection(new InstallReferrerStateListener() {
                @Override
                public void onInstallReferrerSetupFinished(int code) {
                    if (answered[0]) return;
                    answered[0] = true;
                    if (code == InstallReferrerClient.InstallReferrerResponse.OK) {
                        try {
                            ReferrerDetails d = client.getInstallReferrer();
                            String ref = d.getInstallReferrer();
                            p.edit().putBoolean("done", true)
                                .putString("ref", ref == null ? "" : (ref.length() > 600 ? ref.substring(0, 600) : ref))
                                .putLong("click", d.getReferrerClickTimestampSeconds())
                                .putLong("install", d.getInstallBeginTimestampSeconds())
                                .apply();
                        } catch (Exception e) { /* si riprova al prossimo avvio (al massimo 3 volte) */ }
                    } else if (code == InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED) {
                        p.edit().putBoolean("done", true).apply();   /* Play Store troppo vecchio o assente: niente referrer */
                    }
                    try { client.endConnection(); } catch (Exception e) { /* niente */ }
                    if (p.getBoolean("done", false)) call.resolve(fromPrefs(p));
                    else { JSObject o = new JSObject(); o.put("done", false); call.resolve(o); }
                }

                @Override
                public void onInstallReferrerServiceDisconnected() {
                    if (answered[0]) return;
                    answered[0] = true;
                    JSObject o = new JSObject(); o.put("done", false); call.resolve(o);
                }
            });
        } catch (Exception e) {
            if (!answered[0]) { answered[0] = true; JSObject o = new JSObject(); o.put("done", false); call.resolve(o); }
        }
    }

    static String hash(String id, String pkg) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] h = md.digest(("tanetto-invite-v1|" + pkg + "|" + id).getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(64);
            for (byte b : h) sb.append(String.format("%02x", b & 0xff));
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    @PluginMethod
    public void device(PluginCall call) {
        String id = null;
        try { id = Settings.Secure.getString(getContext().getContentResolver(), Settings.Secure.ANDROID_ID); } catch (Exception e) { id = null; }
        if (id == null || id.isEmpty() || "9774d56d682e549c".equals(id)) { call.reject("no device id", "unavailable"); return; }
        JSObject o = new JSObject();
        o.put("dev", hash(id, getContext().getPackageName()));
        call.resolve(o);
    }
}
