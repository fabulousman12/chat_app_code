package com.swipe;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

public final class CallPrefsUtil {

    private static final String PREF_NAME = "CapacitorStorage";
    private static final String KEY_CALL_DATA  = "incoming_call_data";
    private static final String KEY_CALL_OFFER = "incoming_call_offer";

    // Prevent instantiation
    private CallPrefsUtil() {}

    // --------------------------------------------------
    // Clear all incoming call-related prefs
    // --------------------------------------------------
    public static void clearIncomingCall(Context context) {
        try {
            SharedPreferences prefs =
                    context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

            prefs.edit()
                    .remove(KEY_CALL_DATA)
                    .remove(KEY_CALL_OFFER)
                    .apply();

            Log.d("CallPrefsUtil", "Incoming call prefs cleared");
        } catch (Exception e) {
            Log.e("CallPrefsUtil", "Failed to clear incoming call prefs", e);
        }
    }

    // --------------------------------------------------
    // Store offer safely (replaces existing)
    // --------------------------------------------------
    public static void storeOffer(Context context, String offerJson) {
        if (offerJson == null) return;

        SharedPreferences prefs =
                context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        prefs.edit()
                .remove(KEY_CALL_OFFER)
                .putString(KEY_CALL_OFFER, offerJson)
                .apply();
    }

    // --------------------------------------------------
    // Get offer (nullable)
    // --------------------------------------------------
    public static String getOffer(Context context) {
        SharedPreferences prefs =
                context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        return prefs.getString(KEY_CALL_OFFER, null);
    }

    // --------------------------------------------------
    // Store incoming call metadata
    // --------------------------------------------------
    public static void storeCallData(Context context, String dataJson) {
        if (dataJson == null) return;

        SharedPreferences prefs =
                context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        prefs.edit()
                .putString(KEY_CALL_DATA, dataJson)
                .apply();
    }

    // --------------------------------------------------
    // Get incoming call metadata
    // --------------------------------------------------
    public static String getCallData(Context context) {
        SharedPreferences prefs =
                context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        return prefs.getString(KEY_CALL_DATA, null);
    }
}
