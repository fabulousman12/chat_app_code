package com.swipe;

import android.app.Activity;
import android.util.Log;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;
import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.StartAppSDK;
import com.startapp.sdk.adsbase.adlisteners.AdEventListener;
import com.startapp.sdk.adsbase.adlisteners.VideoListener;
import com.startapp.sdk.adsbase.model.AdPreferences;

import org.json.JSONException;
import androidx.annotation.Keep;

@Keep
@CapacitorPlugin(name = "StartioHelper")
public class StartioHelper extends Plugin {

    private StartAppAd rewardedAd;
    private boolean isInitialized = false;

    @PluginMethod
    public void init(PluginCall call) {
        Activity activity = getActivity();
        String appId = call.getString("appId");

        try {
            StartAppSDK.init(activity, appId, true);
            StartAppAd.disableSplash();
            isInitialized = true;

            // Load the first rewarded ad
            rewardedAd = new StartAppAd(activity);
            rewardedAd.loadAd(StartAppAd.AdMode.REWARDED_VIDEO, new AdPreferences(), null);

            call.resolve();
        } catch (Exception e) {
            call.reject("Init failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void showRewarded(PluginCall call) {
        if (!isInitialized || rewardedAd == null) {
            call.reject("Ad not initialized");
            return;
        }

        Activity activity = getActivity();
      if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        rewardedAd.setVideoListener(new VideoListener() {
            @Override
            public void onVideoCompleted() {
                 JSObject result = new JSObject();
                result.put("rewarded", true);
                call.resolve(result);
            }
        });

        rewardedAd.loadAd(StartAppAd.AdMode.REWARDED_VIDEO, new AdPreferences(), new AdEventListener() {
            @Override
            public void onReceiveAd(com.startapp.sdk.adsbase.Ad ad) {
                rewardedAd.showAd();
            }

            @Override
            public void onFailedToReceiveAd(com.startapp.sdk.adsbase.Ad ad) {
                call.reject("Failed to load rewarded ad");
            }
        });
    }
}
