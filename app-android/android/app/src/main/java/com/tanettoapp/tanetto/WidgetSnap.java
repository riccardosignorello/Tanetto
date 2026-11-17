package com.tanettoapp.tanetto;

import org.json.JSONObject;

/**
 * 1.0.11: cosa mostra il widget, calcolato dalla "fotografia" che l'app salva (WidgetPlugin.update) e dal giorno di oggi.
 * Tutti i testi arrivano dall'app gia' tradotti nella lingua scelta in Tanetto (che puo' essere diversa da quella del
 * telefono): qui non si traduce niente, si sceglie solo quale parte della fotografia vale oggi.
 *  - fotografia di oggi            -> stato del giorno (da fare / in corso / tutto fatto / libero / in gita);
 *  - fotografia di ieri, giorno di domani gia' preparato dall'app -> il giorno nuovo (0 fatti su N), cambia a mezzanotte;
 *  - piu' vecchia o mancante       -> il compagno che saluta e "Apri Tanetto", senza numeri vecchi.
 * Nessun dato personale: compagno, nome del compagno, numeri e frasi dell'app.
 */
final class WidgetSnap {
    static final String[] PETS = {"germo", "ondi", "lumi", "miko", "rufi", "pingo", "dori"};
    static final String[] STATES = {"todo", "part", "done", "free", "away"};

    String pet = "germo";
    String state = "todo";
    String name = "";
    String badge = "";      /* "2/5"; vuoto = niente pillola */
    String label = "";      /* "obiettivi fatti oggi" (solo nel widget largo) */
    String line = "";       /* frase del giorno */
    String a11y = "";       /* frase intera per TalkBack */
    int done = 0, total = 0;
    boolean fresh = false;  /* false = fotografia mancante o vecchia: si mostra "Apri Tanetto" */
    long until = 0;         /* fine della gita (ms), 0 = nessuna gita in corso */

    static boolean known(String[] list, String v) {
        if (v == null) return false;
        for (String x : list) if (x.equals(v)) return true;
        return false;
    }

    private static String str(JSONObject o, String k, int max) {
        if (o == null) return "";
        String s = o.optString(k, "");
        if (s == null) return "";
        s = s.replace('\n', ' ').trim();
        return s.length() > max ? s.substring(0, max) : s;
    }

    private static int num(JSONObject o, String k) {
        if (o == null) return 0;
        int n = o.optInt(k, 0);
        return Math.max(0, Math.min(99, n));
    }

    /**
     * @param json  fotografia salvata dall'app (puo' essere null o rovinata)
     * @param today giorno di oggi "yyyy-MM-dd" nell'ora del telefono
     * @param now   ora attuale (ms): serve per la fine della gita
     * @param fallbackOpen "Apri Tanetto" nella lingua del telefono, se l'app non ha mai mandato niente
     */
    static WidgetSnap pick(String json, String today, long now, String fallbackOpen) {
        WidgetSnap w = new WidgetSnap();
        w.name = "Tanetto";
        w.line = fallbackOpen;
        w.a11y = fallbackOpen;
        JSONObject o = null;
        try { if (json != null && !json.isEmpty()) o = new JSONObject(json); } catch (Exception e) { o = null; }
        if (o == null) return w;
        String pet = o.optString("pet", "germo");
        w.pet = known(PETS, pet) ? pet : "germo";
        String nm = str(o, "name", 24);
        if (!nm.isEmpty()) w.name = nm;
        String open = str(o, "open", 60);
        if (!open.isEmpty()) { w.line = open; w.a11y = nm.isEmpty() ? open : nm + ". " + open; }
        JSONObject cur = null;
        if (today.equals(o.optString("day", ""))) cur = o;
        else {
            JSONObject tom = o.optJSONObject("tom");
            if (tom != null && today.equals(tom.optString("day", ""))) cur = tom;
        }
        if (cur == null) { w.state = "todo"; return w; }   /* vecchia: saluta, "Apri Tanetto" */
        String st = cur.optString("st", "todo");
        w.state = known(STATES, st) ? st : "todo";
        w.done = num(cur, "d");
        w.total = num(cur, "t");
        if (w.done > w.total) w.done = w.total;
        w.badge = str(cur, "badge", 12);
        w.label = str(cur, "label", 60);
        String line = str(cur, "line", 90);
        if (!line.isEmpty()) w.line = line;
        String a = str(cur, "a11y", 160);
        w.a11y = a.isEmpty() ? (w.name + ". " + w.line) : a;
        if ("free".equals(w.state) || "away".equals(w.state) || w.total == 0) { w.badge = ""; w.label = ""; }
        /* gita finita mentre l'app e' chiusa: il compagno e' di nuovo a casa (saluta), con la frase del ritorno */
        if ("away".equals(w.state) && cur == o) {
            w.until = Math.max(0L, o.optLong("until", 0L));
            String back = str(o, "back", 90);
            if (w.until > 0 && now >= w.until && !back.isEmpty()) {
                w.state = "todo"; w.line = back; w.a11y = w.name + ". " + back; w.until = 0;
            }
        }
        w.fresh = true;
        return w;
    }

    /** Immagine del compagno per lo stato (le 35 pose 3D sono nell'APK: res/drawable-nodpi/wpet_*). */
    int petRes() {
        switch (pet + "_" + state) {
            case "germo_todo": return R.drawable.wpet_germo_todo;
            case "germo_part": return R.drawable.wpet_germo_part;
            case "germo_done": return R.drawable.wpet_germo_done;
            case "germo_free": return R.drawable.wpet_germo_free;
            case "germo_away": return R.drawable.wpet_germo_away;
            case "ondi_todo": return R.drawable.wpet_ondi_todo;
            case "ondi_part": return R.drawable.wpet_ondi_part;
            case "ondi_done": return R.drawable.wpet_ondi_done;
            case "ondi_free": return R.drawable.wpet_ondi_free;
            case "ondi_away": return R.drawable.wpet_ondi_away;
            case "lumi_todo": return R.drawable.wpet_lumi_todo;
            case "lumi_part": return R.drawable.wpet_lumi_part;
            case "lumi_done": return R.drawable.wpet_lumi_done;
            case "lumi_free": return R.drawable.wpet_lumi_free;
            case "lumi_away": return R.drawable.wpet_lumi_away;
            case "miko_todo": return R.drawable.wpet_miko_todo;
            case "miko_part": return R.drawable.wpet_miko_part;
            case "miko_done": return R.drawable.wpet_miko_done;
            case "miko_free": return R.drawable.wpet_miko_free;
            case "miko_away": return R.drawable.wpet_miko_away;
            case "rufi_todo": return R.drawable.wpet_rufi_todo;
            case "rufi_part": return R.drawable.wpet_rufi_part;
            case "rufi_done": return R.drawable.wpet_rufi_done;
            case "rufi_free": return R.drawable.wpet_rufi_free;
            case "rufi_away": return R.drawable.wpet_rufi_away;
            case "pingo_todo": return R.drawable.wpet_pingo_todo;
            case "pingo_part": return R.drawable.wpet_pingo_part;
            case "pingo_done": return R.drawable.wpet_pingo_done;
            case "pingo_free": return R.drawable.wpet_pingo_free;
            case "pingo_away": return R.drawable.wpet_pingo_away;
            case "dori_todo": return R.drawable.wpet_dori_todo;
            case "dori_part": return R.drawable.wpet_dori_part;
            case "dori_done": return R.drawable.wpet_dori_done;
            case "dori_free": return R.drawable.wpet_dori_free;
            case "dori_away": return R.drawable.wpet_dori_away;
            default: return R.drawable.wpet_germo_todo;
        }
    }

    /** Cerchio morbido dietro al compagno, del colore del compagno (chiaro o scuro secondo il tema: risorse values-night). */
    int blobRes() {
        switch (pet) {
            case "ondi": return R.drawable.wblob_ondi;
            case "lumi": return R.drawable.wblob_lumi;
            case "miko": return R.drawable.wblob_miko;
            case "rufi": return R.drawable.wblob_rufi;
            case "pingo": return R.drawable.wblob_pingo;
            case "dori": return R.drawable.wblob_dori;
            default: return R.drawable.wblob_germo;
        }
    }

    int pillRes() {
        switch (pet) {
            case "ondi": return R.drawable.wpill_ondi;
            case "lumi": return R.drawable.wpill_lumi;
            case "miko": return R.drawable.wpill_miko;
            case "rufi": return R.drawable.wpill_rufi;
            case "pingo": return R.drawable.wpill_pingo;
            case "dori": return R.drawable.wpill_dori;
            default: return R.drawable.wpill_germo;
        }
    }

    int leafRes() {
        switch (pet) {
            case "ondi": return R.drawable.wleaf_ondi;
            case "lumi": return R.drawable.wleaf_lumi;
            case "miko": return R.drawable.wleaf_miko;
            case "rufi": return R.drawable.wleaf_rufi;
            case "pingo": return R.drawable.wleaf_pingo;
            case "dori": return R.drawable.wleaf_dori;
            default: return R.drawable.wleaf_germo;
        }
    }

    int accentColorRes() {
        switch (pet) {
            case "ondi": return R.color.widget_acc_ondi;
            case "lumi": return R.color.widget_acc_lumi;
            case "miko": return R.color.widget_acc_miko;
            case "rufi": return R.color.widget_acc_rufi;
            case "pingo": return R.color.widget_acc_pingo;
            case "dori": return R.color.widget_acc_dori;
            default: return R.color.widget_acc_germo;
        }
    }
}
