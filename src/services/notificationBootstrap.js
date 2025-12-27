import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { stopCallRingtone, clearCallTimeout } from './callRingtone';

// Global intent flag
window.__CALL_NOTIFICATION_ACTION__ = null;

LocalNotifications.addListener(
  'localNotificationActionPerformed',
  async (event) => {
    const { notification, actionId } = event;
    const extra = notification?.extra || notification?.data || {};

    if (!extra.callId) return;

    console.log('📞 Notification action (BOOTSTRAP):', actionId);

    window.__CALL_NOTIFICATION_ACTION__ = actionId || 'TAP';
  stopCallRingtone();
   clearCallTimeout();
    // Clear state immediately
 
  }
);


