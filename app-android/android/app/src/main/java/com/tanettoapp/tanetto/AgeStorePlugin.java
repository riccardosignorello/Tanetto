package com.tanettoapp.tanetto;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

/**
 * Local age-choice store.
 *
 * The file lives in Context.getNoBackupFilesDir(): Android excludes it from
 * Auto Backup and device-to-device transfer. The WebView must treat this
 * native store as the source of truth; it must not mirror the choice into
 * Local Storage, snapshots, exports, or cloud backups.
 */
@CapacitorPlugin(name = "TanettoAge")
public class AgeStorePlugin extends Plugin {
    private static final String FILE_NAME = "tanetto-age.json";
    private static final Object LOCK = new Object();

    private File storeFile() {
        return new File(getContext().getNoBackupFilesDir(), FILE_NAME);
    }

    private JSONObject readChoice() throws Exception {
        File f = storeFile();
        if (!f.isFile()) return null;
        long length = f.length();
        if (length <= 0 || length > 4096) throw new IllegalStateException("invalid_age_store");
        byte[] data = new byte[(int) length];
        try (FileInputStream in = new FileInputStream(f)) {
            int offset = 0;
            while (offset < data.length) {
                int n = in.read(data, offset, data.length - offset);
                if (n < 0) throw new IllegalStateException("truncated_age_store");
                offset += n;
            }
        }
        JSONObject value = new JSONObject(new String(data, StandardCharsets.UTF_8));
        validate(value);
        return value;
    }

    private static void validate(JSONObject value) {
        if (value == null) throw new IllegalArgumentException("missing_age_choice");
        if (value.optBoolean("skip", false)) return;
        int year = value.optInt("y", -1);
        int month = value.optInt("m", -1);
        int currentYear = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR);
        if (year < 1900 || year > currentYear || month < 1 || month > 12) {
            throw new IllegalArgumentException("invalid_age_choice");
        }
    }

    @PluginMethod
    public void get(PluginCall call) {
        synchronized (LOCK) {
            try {
                JSONObject choice = readChoice();
                JSObject result = new JSObject();
                result.put("hasChoice", choice != null);
                if (choice != null) result.put("choice", choice);
                call.resolve(result);
            } catch (Exception e) {
                // An unreadable choice is never trusted. Let the app ask again;
                // a subsequent set() atomically replaces the damaged file.
                JSObject result = new JSObject();
                result.put("hasChoice", false);
                result.put("storageIssue", true);
                call.resolve(result);
            }
        }
    }

    @PluginMethod
    public void set(PluginCall call) {
        synchronized (LOCK) {
            try {
                JSObject input = call.getData();
                JSONObject supplied = new JSONObject(input.toString());
                validate(supplied);
                // Store only the minimum choice fields; never retain timestamps or unrelated JS properties.
                JSONObject choice = new JSONObject();
                if (supplied.optBoolean("skip", false)) {
                    choice.put("skip", true);
                } else {
                    choice.put("y", supplied.getInt("y"));
                    choice.put("m", supplied.getInt("m"));
                }

                File dir = getContext().getNoBackupFilesDir();
                if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("age_store_directory");
                File target = storeFile();
                File temp = new File(dir, FILE_NAME + ".tmp");
                byte[] bytes = choice.toString().getBytes(StandardCharsets.UTF_8);
                try (FileOutputStream out = new FileOutputStream(temp, false)) {
                    out.write(bytes);
                    out.flush();
                    out.getFD().sync();
                }
                // POSIX rename on Android replaces the previous file atomically.
                // A failed write therefore leaves the last valid choice intact.
                android.system.Os.rename(temp.getAbsolutePath(), target.getAbsolutePath());
                JSONObject verified = readChoice();
                if (verified == null || !choice.toString().equals(verified.toString())) throw new IllegalStateException("age_store_verify");

                JSObject result = new JSObject();
                result.put("saved", true);
                call.resolve(result);
            } catch (Exception e) {
                call.reject("age_store_write_failed", "age_store_write_failed");
            }
        }
    }
}
