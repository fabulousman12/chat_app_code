import React, { useEffect, useState,useRef, useContext } from 'react';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonSpinner, IonLoading } from '@ionic/react';
import { BrowserRouter as Router, Route, Switch, Redirect,useLocation  } from 'react-router-dom';

// import WebSocketService from './services/WebsokcetService';
import { LoginProvider } from './Contexts/UserContext';
import { MessageProvider } from './Contexts/MessagesContext';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import './tailwind.css';
import { useHistory } from 'react-router';
//import { Permissions } from '@capacitor/permissions';
import SettingsPage from './pages/experment_settings'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import NewChatWindow from './pages/Newchatwindo';
import { Storage, Drivers } from '@ionic/storage';
import NewChat from './pages/newchat';

import { App as CapacitorApp } from '@capacitor/app';
import {  setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';
import Maindata from './data';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import { isPlatform } from '@ionic/react';
import VideoCallScreen from "./components/VideoCallScreen"
import  ForwardScreen from './pages/ForwardScreen';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { MessageContext } from './Contexts/MessagesContext';
import useUserStore from './services/useUserStore'; 
import './theme/variables.css';
import { CallRuntime } from "./store/CallRuntime";   
import {
  startCall,
  answerCall,
  endCall,
} from './components/webrtc/callHandler';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//import  CallRuntimeRenderer from './CallRuntimeRenderer' 
import { LocalNotifications } from '@capacitor/local-notifications';
import TestChatComponent from './additatinalfiles/TestChatComponent';
import AdminChat from './pages/AdminChat';
// import { initializeApp } from 'firebase/app';
// import { getMessaging } from 'firebase/messaging';
import ArchivedChats from './pages/Archived';
import useMessageStore from './services/useMessageStore.js';
import ChatWindow from './pages/chatwindo';
import { Preferences } from '@capacitor/preferences';
import {WebSocketContext} from './services/websokcetmain'
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import Blocklist from './components/Blocklist'
import StarLoader  from './pages/StarLoader';
import ProfilePage from './pages/ProfilePage';

import HelpInfoChat from './pages/HelpInfoChat';
import UpdateModal from './components/UpdateModal';
setupIonicReact();
import { Capacitor } from '@capacitor/core';
//import FloatingGlobal  from './components/FloatingGlobal'
import { startCallRingtone,stopCallRingtone,startCallTimeout,clearCallTimeout } from './services/callRingtone';

import img from '/img.jpg';

export default function App() {
//  //console.log('%c Is this on developing phase :' + Maindata.IsDev, 'color: blue; font-size: 15px; font-weight: bold;');
 // const { connect, isConnected, close,socket,db,messages,setMessages,getmessages } = useWebSocket(); // Use WebSocket context methods
const {getMessagesFromSQLite,storeMessageInSQLite,getunreadcount,updateUnreadCountInSQLite,resetUnreadCountInSQLite,fetchAllMessages} = useContext(WebSocketContext)

let ws; // reu
 
const {setSelectedUser1} = useContext(MessageContext)
  const [initialRoute, setInitialRoute] = useState('/home'); // Default route is Home
 // const wsService = WebSocketService();

//  const history = useHistory(); 
//const [isConnected, setIsConnected] = useState(false);
  const [link, setLink] = useState(null);
  let store;
  const [isIntialized,setIsIntialized] = useState(false)
//const {usersMain, setUsersMain} = useContext(MessageContext);
  const socket = useRef(null);
  const host = `https://${Maindata.SERVER_URL}`;
 // const [initialMessageUserIds, setInitialMessageUserIds] = useState(new Set());
//  const [unreadCounts, setUnreadCounts] = useState({});\
const history = useHistory()
  const [messages, setMessages] = useState([]);
  const selectedUser = useRef(null);
  const [latestMessageTimestamps, setLatestMessageTimestamps] = useState(new Map());
  const [currentUser, setCurrenuser] = useState({});
 const currentuserRef = useRef(JSON.parse(localStorage.getItem('currentuser')) || null);
let heartbeatIntervalId = null;
  let db; // Ref to store the database connection
  const dbRef = useRef(null);
  const messagesRef = useRef([]);
 
//const [islogin,setislogin] = useState(false)
const [mutedlist,setmutedList] = useState([])
const [usersMain, setUsersMain] = useState([]);
  const [localinit, setlocalinital] = useState(false);
 // let pingInterval = null;
let heartbeatTimeoutId = null; // 👈 new, to track the 20s timeout
let coldCallHandled = false;

  //  const { usersMain, setUsersMain, addUserToMain, removeUserFromMain } = useUserStore()
     const { messagestest, setMessagestest } = useMessageStore();
     const {usersMaintest,setUsersMaintest} = useUserStore()
    const [isnotmute,setismute] = useState(true)
    const [customSounds, setCustomSounds] = useState([]);
    const [ForAllSounfds,setForAllSounds] = useState(null)
    const [mode, setMode] = useState('normal');
const [isload,setIsload] = useState(false)

//const [isactive,setisactive] = useState(false);
const isAcitve = useRef(false);
     const [showModal2, setShowModal2] = useState(false);
  const [criticalUpdate, setCriticalUpdate] = useState(false);
  const [serverVersion, setServerVersion] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const CURRENT_APP_VERSION = Maindata.AppVersion;
const [blockedUsers, setBlockedUsers] = useState(new Set());
const [blockedBy, setBlockedBy] = useState(new Set());

 const [force, forceUpdate] = useState(false);
// const firebaseConfig = {
//   apiKey: "AIzaSyBQ6GMp7jixdrvnNy9r32gIWJD4x2UYHgo",
//   authDomain: "echoid-22ed5.firebaseapp.com",
//   projectId: "echoid-22ed5",
//   storageBucket: "echoid-22ed5.firebasestorage.app",
//   messagingSenderId: "673276204374",
//   appId: "1:673276204374:web:ae809ed9aff513587732f7",
//   measurementId: "G-THMF9SM692"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
  useEffect(() => {
    const reRender = () => {forceUpdate(x => !x)

       console.log("showtime",CallRuntime.showScreen)
    }

    ;   // ONLY triggers rerender
   
    window.addEventListener("render-call-ui", reRender);
    return () => window.removeEventListener("render-call-ui", reRender);
  }, []);

window.addEventListener("CallPermissionResult", async (e) => {
  const { camera, microphone } = e.detail;

  console.log("Native permission result →", camera, microphone);

  if (camera !== "granted" || microphone !== "granted") {
    console.warn("User denied native permissions");
    return;
  }

  // NOW SAFE TO CALL getUserMedia()
  console.log("Requesting browser getUserMedia now...");
  window._resolvePermission && window._resolvePermission();
});
window.addEventListener("NativeCallPermissionResult", (event) => {
  console.log("Native permission event:", event.detail);

  if (window._resolvePermission) {
    window._resolvePermission(event.detail.granted);
    window._resolvePermission = null; // cleanup
  }
});


// Only apply mocks in browser (ionic serve)
if (!Capacitor.isNativePlatform()) {
  console.warn("⚠️ Mocking Capacitor plugins for web preview mode");

  // Mock Filesystem
  window.Capacitor = window.Capacitor || {};
  window.Capacitor.Plugins = window.Capacitor.Plugins || {};
  window.Capacitor.Plugins.Filesystem = {
    readFile: async () => ({ data: "" }),
    writeFile: async () => ({ uri: "mock://file" }),
    mkdir: async () => {},
    stat: async () => ({}),
    readdir: async () => ({ files: [] }),
    deleteFile: async () => {},
  };

  // Mock Preferences
  window.Capacitor.Plugins.Preferences = {
    get: async () => ({ value: null }),
    set: async () => {},
    remove: async () => {},
    clear: async () => {},
  };

  // Mock FileChooser & FilePath if used
  window.FileChooser = {
    open: (opts, success) => {
      console.log("Mock FileChooser called");
      success && success("mock://audio.mp3");
    },
  };
  window.FilePath = {
    resolveNativePath: (uri, success) => {
      console.log("Mock FilePath.resolveNativePath called");
      success && success("/mock/path/to/audio.mp3");
    },
  };

  // Add any other plugin mocks you use frequently
}

  useEffect(() => {
    const GetInitialRoute = async () => {
      setIsload(true)
//console.log('Current origin:', window.location.origin);

      try {
        store = new Storage({
          name: 'ionicstoreconversaDB',
          driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
        });
    
         
        await store.defineDriver(CordovaSQLiteDriver);
        await store.create();
     

        const token = localStorage.getItem('token');


        if (token) {

           const { value } = await Preferences.get({ key: 'privateKey' });

  if (!value) {
    // Preference key doesn't exist, check localStorage
    const localKey = localStorage.getItem('privateKey');

    if (localKey) {
      // Save the key in Preferences
      await Preferences.set({
        key: 'privateKey',
        value: localKey,
      });
   
    } else {
      console.log('No key found in localStorage');
    }
  } else {
    console.log('Key already exists in Preferences');
  }

 

                 setmutedList(JSON.parse(localStorage.getItem('mutedUsers')) || []);
        setismute(JSON.parse(localStorage.getItem('ismute')) || true);
        const stored = JSON.parse(localStorage.getItem('customSounds')) || [];
        setCustomSounds(stored);
        setMode(localStorage.getItem('mode') || 'normal');
        setForAllSounds(JSON.parse(localStorage.getItem('ForAllSoundNotification')) || null);

          await sendPublicKeyToBackend(token);
          const { value: ionic_token } = await Preferences.get({ key: 'token' });
//await sendPublicKeyToBackend(token);
     
          setInitialRoute('/home');

await ensureOverlayPermission()
          if(!ionic_token){
store.set('token', token);
     await Preferences.set({
            key: 'token',
            value: token,
          });
          }
        
          currentuserRef.current =(JSON.parse(localStorage.getItem('currentuser'))) ;
          //console.log("current user",currentuserRef.current._id)
          if(currentuserRef.current === null){
            try {
              const token = localStorage.getItem('token')
              const response = await fetch(`${host}/user/getuser`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Auth': token,
                },
              });
              const json = await response.json();
              try {
        
                if(json.success){
               // await Storage.set({ key: 'currentuser', value: JSON.stringify(json) });
               localStorage.setItem('currentuser',JSON.stringify(json.userResponse))
    
        
               currentuserRef.current = json.userResponse;
        
                return json.userResponse;
                }else{
                  return false
                }
        
                
              } catch (error) {
                console.error("error in saving current user in storage",error)
              }
        
              
            } catch (error) {
        
              showToast("Error fetching user");
              return false;
            }
          }
    
          const wsUrl = `wss://${Maindata.SERVER_URL}?token=${token}`;
   await initSQLiteDB();
          setlocalinital(true)
          await getmessages();
          await mergerusers();
        
          await connect(wsUrl);
      window.__JS_READY = true;

   

          setLink(wsUrl);
              await maybeHandleColdStartCall();
        } else {
          setInitialRoute('/login');
        }
        await LocalNotifications.registerActionTypes({
  types: [
    {
      id: "CALL_ACTION",
      actions: [
        { id: "ANSWER", title: "Answer" },
        { id: "DECLINE", title: "Decline" },
      ],
    },
  ],
});

      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
  if(localinit === false){
    
  
    GetInitialRoute();



    // CapacitorApp.addListener('appStateChange', (state) => {
    //   if (state.isActive) {
    //     //console.log('App is in the foreground');
    //   } else {
    //     //console.log('App is in the background');
    //    // handleBackgroundTask();
    //   }
    // });
  }


    setIsload(false)
 
 fetchBlockedFromServer();
   //runLiveUpdate()
    
  }, []);



  const loadBlockedFromStorage = () => {
  try {
    const bu = JSON.parse(localStorage.getItem('blockedUsers')) || [];
    const bb = JSON.parse(localStorage.getItem('blockedBy')) || [];

    setBlockedUsers(new Set(bu));
    setBlockedBy(new Set(bb));
  } catch (e) {
    console.error('Failed to load block list from storage', e);
    setBlockedUsers(new Set());
    setBlockedBy(new Set());
  }
};

const fetchBlockedFromServer = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`${host}/user/blocked`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Auth: token,
      },
    });

    const json = await response.json();
    if (!json.success) return;

    // 🔒 Normalize → ONLY IDs
    const blockedUsersIds = (json.blockedUsers || [])
      .map(u => typeof u === 'string' ? u : u?._id)
      .filter(Boolean);

    const blockedByIds = (json.blockedBy || [])
      .map(u => typeof u === 'string' ? u : u?._id)
      .filter(Boolean);

    // Update state (Set<string>)
    setBlockedUsers(new Set(blockedUsersIds));
    setBlockedBy(new Set(blockedByIds));

    // Persist for offline use (array of string IDs)
    localStorage.setItem(
      'blockedUsers',
      JSON.stringify(blockedUsersIds)
    );
    localStorage.setItem(
      'blockedBy',
      JSON.stringify(blockedByIds)
    );

  } catch (err) {
    console.error('Failed to fetch block list', err);
  }
};


  CapacitorApp.addListener("appStateChange", (state) => {
  if (state.isActive && socket.current) {
    maybeHandleColdStartCall();
  }
});

async function maybeHandleColdStartCall() {
  try {
    if (coldCallHandled) return;
    if (!window.__JS_READY) return;
    let autpstart = true;
// 🔴 BLOCK IF USER DECLINED FROM NOTIFICATION
if (window.__CALL_NOTIFICATION_ACTION__ === 'DECLINE') {
  console.log('🚫 Call declined via notification — skipping resume logic');
const pref = await Preferences.get({ key: "incoming_call_data" });
if (!pref.value) {
  window.__CALL_NOTIFICATION_ACTION__ = null;
  return;
}
    data = JSON.parse(pref.value);
  window.__CALL_NOTIFICATION_ACTION__ = null;
  setTimeout(async() =>{
 socket?.send(JSON.stringify({
    type: 'call-declined',
    targetId: data.callerId,
    calleeId: data.callOnly,
  }));

   console.log("sedning consolemessafe")
  },1000)

  
 

  await Preferences.remove({ key: 'incoming_call_data' });
  await Preferences.remove({ key: 'incoming_call_offer' });

  return; // ⛔ STOP EVERYTHING
}


if(window.__CALL_NOTIFICATION_ACTION__ !== null){
  autpstart =  false
}else{
  autpstart = true
}

  
    const pref = await Preferences.get({ key: "incoming_call_data" });
    if (!pref.value) return;
  const offerdata = await Preferences.get({ key: "incoming_call_offer" });
  if (!offerdata.value) {
  // give native fetch a moment
  await new Promise(r => setTimeout(r, 300));

  const retry = await Preferences.get({ key: "incoming_call_offer" });
  if (!retry.value) return;

  offerdata.value = retry.value;
}

    let data = null;
    let offer = null;

    try {
      data = JSON.parse(pref.value);
      offer = JSON.parse(offerdata.value)

    } catch (e) {
      console.error("parse error", e);
      await Preferences.remove({ key: "incoming_call_data" });
      await Preferences.remove({ key: "incoming_call_offer" });
      return;
    }

    // Always clear to avoid double triggers
    await Preferences.remove({ key: "incoming_call_data" });
    await Preferences.remove({ key: "incoming_call_offer" });
    // =====================================================
    //  TIMESTAMP CHECK (reject old / future)
    // =====================================================
let rawTs = data?.ts;

// Convert string → number safely
const ts = typeof rawTs === "string"
  ? Number(rawTs)
  : rawTs;

// Validate
if (!Number.isFinite(ts)) {
  console.warn("⏳ Missing or invalid ts, ignoring cold-start call:", rawTs);
  return;
}

const now = Date.now();
const diff = now - ts;

console.log("cold diff ms =", diff);

// Older than 38s OR timestamp in future (unexpected)
if (diff > 38_000 || diff < -12_000) {
  console.warn("☎️ Cold-start call expired, ignoring:", diff, "ms");
  return;
}
    console.log("showtime in handlecold",JSON.stringify(CallRuntime))

    // =====================================================
    // Already in call UI? skip
    // =====================================================

    if (CallRuntime.showScreen) return;

    // =====================================================
    // Build user object
    // =====================================================

    const userdet = usersMain.find(u => u.id === data.callerId);

    // Dispatch event
    window.dispatchEvent(new CustomEvent("incoming-call", {
      detail: {
        mode: "answer",
        callerId: data.callerId,
        offer: offer,
        userId: currentuserRef.current._id,
        callOnly: data.callOnly,
        userdetail: userdet,
        Answer:true,
        Autostart:autpstart



      }
    }));

    console.log("☎️ Cold start incoming call handled");

  } catch (err) {
    console.error("cold start call err", err);
  }
}
const getNativeVersion = async () => {
  const v = await Preferences.get({ key: 'native_version_code' });
  return Number(v.value);
};
const versionCodeToString = (code) => {
  // Ensure integer
  const str = String(code);

  if (str.length < 3) {
    // fallback, e.g. 12 → 0.0.12
    return `0.0.${str}`;
  }

  const major = str[0];          // first digit
  const minor = str[1];          // second digit
  const patch = str.slice(2);    // rest (variable length)

  return `${major}.${minor}.${patch}`;
};

useEffect(() => {
  const bootstrapUpdates = async () => {
    try {
      // 1️⃣ Native version (authority)
      const nativeVersion = await getNativeVersion();
      console.log('[BOOT] Native version:', nativeVersion);

      if (Number.isNaN(nativeVersion)) {
        console.error('[BOOT] Invalid native version');
        return;
      }

            const nativeVersionStr = versionCodeToString(nativeVersion);

      // 2️⃣ Ask server
      const res = await fetch(`https://${Maindata.SERVER_URL}/user/version`);
      const data = await res.json(); // { version: "1.5" }

      // 3️⃣ Native update exists → HARD BLOCK OTA
      if (isVersionGreater(data.version, nativeVersionStr)) {
        console.warn('[BOOT] Native update available → blocking OTA');

        // 🔥 wipe ALL OTA bundles
        await LiveUpdate.reset();

        const updatedetails = await fetch(
          `https://${Maindata.SERVER_URL}/user/updatedetails`
        );
        const dat = await updatedetails.json();

        setCriticalUpdate(isCritical(data.version));
        setServerVersion(data.version);
        setDownloadUrl(dat.resposnse_url || 'https://example.com/download');
        setShowModal2(true);

        return; // 🚫 STOP HERE
      }

      // 4️⃣ Native is current → OTA allowed
      if (!Maindata.IsDev) {
        const OTA_CHANNEL = `Live-update-${nativeVersionStr}`;
        const OTA_TESTCHANNEL = `Live-update-test-${nativeVersionStr}`
        console.log('[BOOT] OTA allowed → channel: also for test now', Maindata.testchannel_actuve ? OTA_TESTCHANNEL : OTA_CHANNEL);
const final = Maindata.testchannel_actuve ? OTA_TESTCHANNEL : OTA_CHANNEL
        await LiveUpdate.ready();

        const syncResult = await LiveUpdate.sync({
          channel: final,
        });

        console.log('[LiveUpdate] Sync result:', syncResult);

        if (syncResult.nextBundleId) {
          console.log('[LiveUpdate] New bundle installed → reloading');
          await LiveUpdate.reload();
        } else {
          console.log('[LiveUpdate] App already up-to-date');
        }
      }
    } catch (err) {
      console.error('[BOOT] Version / OTA bootstrap failed', err);
    }
  };

  bootstrapUpdates();
}, []);


function isCritical(versionStr) {
  const parts = versionStr.split('.');
  if (parts.length < 2) return false;

  const major = Number(parts[0]);
  const minor = Number(parts[1]);

  if (isNaN(major) || isNaN(minor)) return false;
if (major === 0 && minor === 0) return false;
  const versionSum = major + minor / 10;
  console.log("version sum",versionSum%0.5 === 0);
  return versionSum % 0.5 === 0;
}function isVersionGreater(v1, v2) {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
console.log("isVersionGreater",v1,v2,a,b)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const num1 = a[i] || 0;
    const num2 = b[i] || 0;
    if (num1 > num2) return true;
    if (num1 < num2) return false;
  }
  return false; // versions are equal
}

//     useEffect(() => {
//       const checkVersion = async () => {
//         try {
//           const res = await fetch(`https://${Maindata.SERVER_URL}/user/version`);
//           const data = await res.json(); // expects { version: "1.5", url: "..." }


//           if (isVersionGreater(data.version, CURRENT_APP_VERSION)) {
//             const updatedetails = await fetch(`https://${Maindata.SERVER_URL}/user/updatedetails`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
               
//               }
//             })
//             const dat = await updatedetails.json()
     
//             //updatedetails.resposnse_url
//             setCriticalUpdate(isCritical(data.version));
//             setServerVersion(data.version);
//             setDownloadUrl(dat.resposnse_url || 'https://example.com/download'); // Fallback URL if not provided
//             setShowModal2(true);
//           }
//         } catch (err) {
//           console.error("Version check failed", err);
//         }
//       };
  
//       checkVersion();
//     }, []);
window.__CALL_NOTIFICATION_ACTION__ = null;
// possible values: 'ANSWER', 'DECLINE', 'TAP'

let restoringNow = false;
useEffect(() => {
  const handler = (e) => {
    
    console.log("Overlay restored!", e.detail);
    CallRuntime.overlayActive = false
  CallRuntime.isRestoring = true;
restoringNow = true
  // give UI time to settle
  setTimeout(() => {
    CallRuntime.isRestoring = false;
    restoringNow=false
  }, 300); // 0.6s is enough
    // resume UI, navigate, etc
  };

  window.addEventListener("RestoreOverlay", handler);
  return () => window.removeEventListener("RestoreOverlay", handler);
}, []);


/* BACK BUTTON → minimize */
useEffect(() => {
  const back = CapacitorApp.addListener('backButton', () => {
        console.log("all states",CallRuntime.showScreen,CallRuntime.overlayActive,restoringNow)
      if (!restoringNow && CallRuntime.showScreen && !CallRuntime.overlayActive) {
          enableOverlay();
      }
  });

  const bg = CapacitorApp.addListener("appStateChange", ({isActive }) => {
    console.log("all states",isActive,CallRuntime.showScreen,CallRuntime.overlayActive,restoringNow)
      if (!isActive && CallRuntime.showScreen && !CallRuntime.overlayActive && !restoringNow) {
          enableOverlay();
      }
  });// isactuive is not updating first

  return () => { back.remove(); bg.remove(); };
}, []);


/* RETURN FOREGROUND → RESTORE */
useEffect(() => {
  
  const fg = CapacitorApp.addListener("appStateChange", (state) => {
      if (state.isActive && CallRuntime.overlayActive && !restoringNow) {
          restoreNormal();
      }
  });

  return () => fg.remove();
}, []);

// const runLiveUpdate = async () => {
//   try {

// if(!Maindata.IsDev){

// console.log("main dev",Maindata.IsDev)
//   await LiveUpdate.setChannel({ channel: 'Live-update' });
//     // 1️⃣ READY → inspect current state
//     await LiveUpdate.ready();

//     // 2️⃣ SYNC → check for updates
//     const syncResult = await LiveUpdate.sync();

//     console.log('[LiveUpdate] Sync result: part2', syncResult);

//     // 3️⃣ RELOAD APP IF NEW BUNDLE INSTALLED
//     if (syncResult.nextBundleId) {
//       console.log(`[LiveUpdate] New bundle installed: ${syncResult.nextBundleId}`);
//       console.log('[LiveUpdate] Reloading app to apply update...');

//       // Capacitor official reload (Android + iOS)
//       await LiveUpdate.reload();
//     } else {
//       console.log('[LiveUpdate] No new updates available. App is already up-to-date.');
//     }
//   }
//   } catch (err) {
//     console.error('[LiveUpdate] Error:', err);
//   }
// };
// useEffect(() => {
//     function handleKey(e) {
//         if ((e.key === "Escape" || e.key === "Backspace") &&
//             CallRuntime.showScreen && 
//             !CallRuntime.overlayActive) 
//         {
//             enableOverlay();  // no need async, but fine if you await
//             e.preventDefault();
//         }
//     }

//     window.addEventListener("keydown", handleKey);

//     return () => window.removeEventListener("keydown", handleKey);
// }, []);

async function enableOverlay() {
    await ensureOverlayPermission();
   
    CallRuntime.overlayActive = true;

    if (window.NativeAds?.enableOverlayMode) {
        window.NativeAds.enableOverlayMode();
    }

    window.dispatchEvent(new CustomEvent("render-call-ui"));
}




// Helper to convert base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
  try{
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}catch (error) {
  console.error("Error converting base64 to ArrayBuffer:", error);
  throw new Error("Invalid base64 string");
  }
}

// Import RSA private key from PEM (similar to public key, but "pkcs8" format)
async function importPrivateKeyFromJwk(jwkString) {
  try{
    let jwk;
if (!jwkString || typeof jwkString !== 'string') {
  throw new Error("Invalid JWK format");

}else{
  jwk = JSON.parse(jwkString);

}


  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}catch (error) {
  console.error("Error importing private key from JWK:", error);
  throw new Error("Invalid JWK format");
  }
}


// Hybrid decryption function
async function decryptMessageHybrid(encryptedAesKeyB64, ivB64, ciphertextB64, privateKeyPem) {
  // 1. Import RSA private key
try{

  const privateKey = await importPrivateKeyFromJwk(privateKeyPem);

  // 2. Decode base64 to ArrayBuffer
  const encryptedAesKeyBuffer = base64ToArrayBuffer(encryptedAesKeyB64);
  
  const ivBuffer = base64ToArrayBuffer(ivB64);
  const ciphertextBuffer = base64ToArrayBuffer(ciphertextB64);


  console.log("Encrypted AES Key Length:", encryptedAesKeyBuffer.byteLength);

  // 3. Decrypt AES key using RSA private key
let aesKeyRaw;
try {
  // Try modern RSA-OAEP-256 (preferred)
  aesKeyRaw = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP", hash: "SHA-256" },
    privateKey,
    encryptedAesKeyBuffer
  );
} catch (err1) {
  console.warn("⚠️ RSA-OAEP-256 decryption failed, retrying with SHA-1 fallback:", err1);
  try {
    // Try legacy RSA-OAEP (SHA-1) for older WebViews (Realme, Oppo, Vivo)
    aesKeyRaw = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP", hash: "SHA-1" },
      privateKey,
      encryptedAesKeyBuffer
    );
  } catch (err2) {
    console.error("❌ Both RSA-OAEP-256 and fallback RSA-OAEP failed:", err2);
    throw new Error("RSA decryption failed on this device");
  }
}

  // 4. Import decrypted AES key as CryptoKey
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    aesKeyRaw,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // 5. Decrypt the ciphertext using AES-GCM with the IV
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
    aesKey,
    ciphertextBuffer
  );

  // 6. Decode decrypted ArrayBuffer to string
  const decryptedMessage = new TextDecoder().decode(decryptedBuffer);

  return decryptedMessage;
} catch (error) {
  console.error("Hybrid decryption failed:", error);
  throw new Error("Hybrid decryption failed");
}
}


async function sendPublicKeyToBackend(userId) {

  console.log("we are at pulbic keys")
  const currentUserStr = localStorage.getItem('currentuser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  const publicKeyPem = currentUser?.publicKey || null;
  const privateKeyJwkStr = localStorage.getItem('privateKey') || null;


  const testMessage = "keypair-test";

  if (publicKeyPem && privateKeyJwkStr) {
    try {
      const publicKey = await importPublicKeyFromPem(publicKeyPem);
      const privateKey = await window.crypto.subtle.importKey(
        "jwk",
        JSON.parse(privateKeyJwkStr),
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
      );

      const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        new TextEncoder().encode(testMessage)
      );

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encrypted
      );
      const decrypted = new TextDecoder().decode(decryptedBuffer);

      if (decrypted === testMessage) {
       console.log("✔️ Existing keypair is valid.");
        return { message: "✔️ Keys exist and are valid." };
      } else {
        console.warn("❌ Keys mismatch.");
      }
    } catch (err) {
      console.error("❌ Key validation failed:", err);
    }
  }


  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const spki = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const jwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

  const pem = convertSpkiToPem(spki);



  const response = await fetch(`https://${Maindata.SERVER_URL}/user/updateKey`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Auth": userId,
    },
    body: JSON.stringify({ publicKey: pem }),
  });

  if (!response.ok) throw new Error("❌ Failed to update public key on backend");

  const result = await response.json();
console.log("resuklt",result)
  if (result.success) {
    if (currentUser) {
      currentUser.publicKey = pem;
await Preferences.remove({ key: "privateKey" });
await Preferences.remove({ key: "currentuser" });
localStorage.removeItem("privateKey");
localStorage.removeItem("currentuser");

      console.log("pem",pem)
      localStorage.setItem("currentuser", JSON.stringify(currentUser));
      await Preferences.set({ key: "currentuser", value: JSON.stringify(currentUser) });
    }
    localStorage.setItem("privateKey", JSON.stringify(jwk));
    console.log("jwk",jwk)
    await Preferences.set({ key: "privateKey", value: JSON.stringify(jwk) });
    console.log("💾 Keys saved locally.");
  }

  return result;
}





function convertSpkiToPem(spkiBuffer) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(spkiBuffer)));
  const formatted = base64.match(/.{1,64}/g)?.join('\n');
  return `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`;
}

async function importPublicKeyFromPem(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}
useEffect(() => {
  const setupNotifications = async () => {
    try {
      // Request notification permission (Cordova handles internally)
 
        
        const permission = await LocalNotifications.requestPermissions();
        await LocalNotifications.createChannel({
  id: "call",
  name: "Incoming Calls Js",
  description: "Call alerts",
   sound: null,  
  importance: 5,       // 🔥 REQUIRED
  vibration: true,     // 🔥 REQUIRED for heads-up
});

        console.log('🧩 Capacitor Notification permission:', permission);
      
    } catch (err) {
      console.error('❌ Error setting up notifications:', err);
    }
  };

  setupNotifications();
}, []);


// Hook to register notification click listener once
useEffect(() => {
  if (window.cordova && cordova.plugins?.notification?.local) {
    cordova.plugins.notification.local.on('click', (notification) => {
      const senderId = notification.data?.senderId;
      console.log('🔗 Notification clicked:', senderId);

      if (selectedUser.current !== senderId) {
        setSelectedUser1(senderId);
        selectedUser.current = senderId;
        const userMain = JSON.parse(localStorage.getItem('usersMain') || '[]');
        const user = userMain.find((user) => user.id === senderId);
        history.push('/chatwindow', {
          userdetails: user,
          callback: 'goBackToUserList',
          currentUserId: currentuserRef.current._id,
        });
      }
    });
  } else {
    // Capacitor fallback
 // Capacitor fallback
LocalNotifications.addListener(
  'localNotificationActionPerformed',
  async (event) => {
    const { notification, actionId } = event;
stopCallRingtone();
    const extra = notification.extra || notification.data || {};
    console.log('🔗 Notification action:', actionId, extra);

    /* =====================================================
       📞 CALL NOTIFICATION
       ===================================================== */
    if (extra.callId) {
      console.log('📞 Call notification action:', actionId);

      // Always cancel the notification
      await LocalNotifications.cancel({
        notifications: [{ id: notification.id }],
      });

      // ❌ DECLINE → clear prefs & stop
      if (actionId === 'DECLINE') {
        console.log('❌ Call declined from notification');

        await Preferences.remove({ key: 'incoming_call_data' });
        await Preferences.remove({ key: 'incoming_call_offer' });

        // Optional: notify server here
        // sendCallDecline(extra.callId);

        window.__CALL_ACTION__ = 'DECLINE';
        return; // ⛔ DO NOT open call UI
      }

      // ✅ ANSWER or TAP → let resume logic handle it
      window.__CALL_ACTION__ = actionId || 'TAP';
      return;
    }

    /* =====================================================
       💬 CHAT NOTIFICATION (UNCHANGED)
       ===================================================== */
    const senderId = extra.senderId;
    if (!senderId) return;

    console.log('💬 Chat notification clicked:', senderId);

    if (selectedUser.current !== senderId) {
      setSelectedUser1(senderId);
      selectedUser.current = senderId;

      const userMain = JSON.parse(
        localStorage.getItem('usersMain') || '[]'
      );

      const user = userMain.find((u) => u.id === senderId);

      history.push('/chatwindow', {
        userdetails: user,
        callback: 'goBackToUserList',
        currentUserId: currentuserRef.current._id,
      });
    }
  }
);

  }
}, []);

// -----------------


  // Function to save notification data to the app storage (e.g., AsyncStorage or database)

  // Function to delete or mark the notification as processed
 

const showCustomNotification = async (message) => {
  const { sender, content } = message;
  console.log(`🔔 New message from ${sender}: ${content}`);

  const soundEntry = customSounds.find((item) => item.senderId === sender);
  const soundToPlay = soundEntry?.soundPath || ForAllSounfds || null;

  try {
    const users = JSON.parse(localStorage.getItem('usersMain') || '[]');
    const matchingUser = users.find((user) => user.id === sender);

    await showVisualNotification(
      sender,
      matchingUser?.name || 'Unknown',
      content,
      matchingUser?.avatar,
      soundToPlay
    );
  } catch (error) {
    console.error('❌ Error playing notification sound:', error);
  }
};

  
const showVisualNotification = async (id, sender, content, base64Image, sound) => {
  try {
    // ---- 1️⃣ Schedule notification ----
    if (window.cordova && cordova.plugins?.notification?.local) {
      // Cordova Local Notification
      cordova.plugins.notification.local.schedule({
        id: Math.floor(Date.now() % 100000),
        title: `New message from ${sender}`,
        text: content,
        attachments: base64Image ? [base64Image] : [],
       
        data: { senderId: id },
        foreground: true, // show even when app in foreground
        sound: null, // handled manually below,
      trigger: { at: new Date(Date.now() + 200) },
       channel: 'silent_channel_id' 

        
      });
      console.log("📱 Cordova local notification scheduled");
    } else {
      // Fallback for web / Capacitor preview
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Date.now() % 100000),
            title: `New message from ${sender}`,
            body: content,
            attachments: base64Image ? [{ id: 'img', url: base64Image }] : [],
            data: { senderId: id },
          },
        ],
      });
      console.log("💻 Capacitor notification scheduled (fallback)");
    }

    // ---- 2️⃣ Handle sound playback ----
    setTimeout(async () => {

      if (sound) {
        try {
          // Custom sound from Filesystem
           const audioSrc = Capacitor.convertFileSrc(sound);

          console.log("🔊 Playing custom sound:", audioSrc);
          const audio = new Audio(audioSrc);
          await audio.play();
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, 2300);
          return;
        } catch (err) {
          console.warn('⚠️ Failed custom sound, fallback next:', err);
        }
      }

      // Fallback: play default notification sound
      console.log("🎵 Playing default notification sound");
      const defaultAudio = new Audio('/defaulatNoti.wav'); // in /public folder
      await defaultAudio.play();
      setTimeout(() => {
        defaultAudio.pause();
        defaultAudio.currentTime = 0;
      }, 2300);
    }, 500);

  } catch (err) {
    console.error('❌ showVisualNotification error:', err);
  }
};


 
  // Function to send token to Firebase Cloud Messaging (FCM)






const loadMessagesFromPreferencesToSQLite = async (db) => {
  const migratedMessages = [];

  try {
    const { keys } = await Preferences.keys();
    const messageKeys = keys.filter(k => k.startsWith('message_'));

    if (messageKeys.length === 0) {
      // No messages found
      return [];
    }

//    const privateKey = localStorage.getItem('privateKey');
    const formattedMessages = [];

    // Step 1️⃣: Collect all messages first
    for (const key of messageKeys) {
      try {
        const { value } = await Preferences.get({ key });
        if (!value) continue;

        const rawMessage = JSON.parse(value);

        const formattedMessage = {
          id: rawMessage.messageId || rawMessage.id,
          sender: rawMessage.sender,
          recipient: rawMessage.recipient,
          content: rawMessage.content || null,
          timestamp: rawMessage.timestamp || new Date().toISOString(),
          status: rawMessage.status || 'pending',
          read: 0,
          type: rawMessage.type || 'text',
          file_name: rawMessage.file_name || null,
          file_type: rawMessage.file_type || null,
          file_size: rawMessage.file_size || null,
          file_path: rawMessage.file_path || null,
          thumbnail: rawMessage.thumbnail || null,
          isDeleted: Number(rawMessage.isDeleted || 0),
          isDownload: Number(rawMessage.isDownload ?? 1),
          isSent: Number(rawMessage.isSent ?? 1),
          isError: Number(rawMessage.isError ?? 0),
          encryptedMessage: rawMessage.encryptedMessage || null,
          encryptedAESKey: rawMessage.encryptedAESKey || null,
          eniv: rawMessage.eniv || null
        };

        formattedMessages.push(formattedMessage);
      } catch (err) {
        console.warn(`⚠️ Skipping invalid message for key ${key}:`, err);
      }
    }

    if (formattedMessages.length === 0) {
      return [];
    }

    // Step 2️⃣: Batch insert in a single transaction for efficiency
    await new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          for (const msg of formattedMessages) {
            if (!msg?.id) continue;

            tx.executeSql(
              `
              INSERT OR REPLACE INTO messages (
                id, sender, recipient, content, timestamp, status, read, isDeleted, isDownload,
                type, file_name, file_type, file_size, thumbnail, file_path,
                isSent, isError, encryptedMessage, encryptedAESKey, eniv
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
              `,
              [
                msg.id,
                msg.sender,
                msg.recipient,
                msg.content,
                new Date(msg.timestamp).toISOString(),
                msg.status,
                msg.read,
                msg.isDeleted,
                msg.isDownload,
                msg.type,
                msg.file_name,
                msg.file_type,
                msg.file_size,
                msg.thumbnail,
                msg.file_path,
                msg.isSent,
                msg.isError,
                msg.encryptedMessage,
                msg.encryptedAESKey,
                msg.eniv
              ]
            );
          }
        },
        (txError) => {
          console.error('❌ SQLite batch insert failed:', txError);
          reject(txError);
        },
        () => {
          console.log(`✅ Migrated ${formattedMessages.length} messages to SQLite.`);
          resolve();
        }
      );
    });

    // Step 3️⃣: Remove migrated items from Preferences in parallel
    await Promise.all(messageKeys.map(key => Preferences.remove({ key })));

    console.log(`🧹 Cleaned up ${messageKeys.length} old Preferences entries.`);

    return formattedMessages;
  } catch (err) {
    console.error('❌ Error loading messages from Preferences:', err);
    return migratedMessages; // return what was successfully processed
  }
};

  // Initialize SQLite DB
  const initSQLiteDB = async () => {
    try {
      const dbName = 'Conversa_chats_store.db';
      if (!dbRef.current) {
        return new Promise((resolve, reject) => {
          db = window.sqlitePlugin.openDatabase({ name: dbName, location: 'default' });

          dbRef.current = db; // Store the database reference in the ref
          db.transaction(tx => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                sender TEXT,
                recipient TEXT,
                content TEXT,
                timestamp TEXT,
                status TEXT,
                read INTEGER DEFAULT 0,
                isDeleted INTEGER DEFAULT 0,
                isDownload INTEGER DEFAULT 0,
                type TEXT DEFAULT 'text',
                file_name TEXT,
                file_type TEXT DEFAULT null,
                file_size INTEGER,
                thumbnail BLOB DEFAULT null,
                file_path TEXT,
                isError INTEGER DEFAULT 0,
                isSent INTEGER DEFAULT 1,
                encryptedMessage TEXT DEFAULT null,
                encryptedAESKey TEXT DEFAULT null,
                eniv TEXT DEFAULT null
              );`,
              [],
              async () => {
                //console.log('✅ messages table created or exists.')
              


              }
              ,
              (tx, error) => {
                console.error('❌ Error creating messages table:', error);
                reject(error);
              }
            );
    
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS unreadCount (
                sender TEXT PRIMARY KEY,
                count INTEGER DEFAULT 0
              );`,
              [],
              () => {
                //console.log('✅ unreadCount table created or exists.');
                resolve(); // Resolve only after all tables
              },
              (tx, error) => {
                console.error('❌ Error creating unreadCount table:', error);
                reject(error);
              }
            );
          });
        });
      }
    } catch (err) {
      console.error('SQLite DB Error:', err);
    }
  };

  const mergerusers = async ()=>{
          const savedUsers = JSON.parse(localStorage.getItem('usersMain')) || [];

const capUsers = await Preferences.get({ key: 'usersMain' }).then(res => JSON.parse(res.value) || []);
//console.log("saved users",savedUsers)
//console.log("cap users",capUsers)
const localMap = new Map(savedUsers.map(user => [user.phoneNumber, user]));

for (const user of capUsers) {
  const localUser = localMap.get(user.phoneNumber);

  if (!localUser) {
    
    // User doesn't exist in localStorage, add directly
    localMap.set(user.phoneNumber, user);

  } else {
   const capTimestamp = new Date(user.timestamp || 0).getTime();
      const localTimestamp = new Date(localUser.timestamp || 0).getTime();

      const isCapNewer = capTimestamp > localTimestamp;

      if (isCapNewer) {
        console.log(`Updating user ${user.phoneNumber} in localStorage`,user);
        // Capacitor version is newer — update it
        localMap.set(user.phoneNumber, user);
      }else{
        console.log(`Keeping user ${user.phoneNumber} in localStorage`,user);
      }
  }
}

// Final merged users array
const mergedUsers = Array.from(localMap.values());
const mergedStr = JSON.stringify(mergedUsers);
try {
  localStorage.setItem('usersMain', mergedStr);
  setUsersMain(mergedUsers);
  setUsersMaintest(mergedUsers)
} catch (error) {
  console.warn("Could not store in localStorage, likely quota exceeded", error);
}

  }

useEffect(() => {
  const handleAppStateChange = async (state) => {
    if (state.isActive) {
      console.log("▶️ App resumed (foreground)");

 
      isAcitve.current = true;
      startHeartbeatbackbgroung(socket.current, false);
  await LocalNotifications.cancel({
      notifications: [{ id: 999 }],
    });

    stopCallRingtone();
     clearCallTimeout();
    console.log("Cuuting notif")

      const token = localStorage.getItem("token");
      const url = `wss://${Maindata.SERVER_URL}?token=${token}`;

      // ⚡ Reconnect WebSocket if needed
      if (!socket.current || socket.current.readyState === WebSocket.CLOSED) {
        console.log("Reconnecting WebSocket in foreground");
        await connect(url);
      }

      setTimeout(async () => {
        try {
          console.log("🔄 Running foreground sync...");

          // 🧩 STEP 1: Merge usersMain (native truth wins)
          const localUsers = JSON.parse(localStorage.getItem("usersMain") || "[]");
          const prefData = await Preferences.get({ key: "usersMain" });
          const nativeUsers = JSON.parse(prefData.value || "[]");

          const mergedMap = new Map();

          // Add all users from local first
          for (const u of localUsers) {
            mergedMap.set(u.id || u.phoneNumber, u);
          }

          // Merge native users — overwrite only if newer or missing  
          for (const native of nativeUsers) {
            const key = native.id || native.phoneNumber;
            const existing = mergedMap.get(key);

            const nativeTime = new Date(native.timestamp || 0).getTime();
            const localTime = new Date(existing?.timestamp || 0).getTime();

            if (!existing || nativeTime > localTime) {
              // native data is fresher or missing in local → replace
              mergedMap.set(key, native);
            } else {
              // local data is newer → keep, but still update lastMessage if missing
              if (!existing.lastMessage && native.lastMessage) {
                existing.lastMessage = native.lastMessage;
              }
            }
          }


          const mergedUsers = Array.from(mergedMap.values());

          // Save merged result back to both storage systems
          localStorage.setItem("usersMain", JSON.stringify(mergedUsers));
          await Preferences.set({ key: "usersMain", value: JSON.stringify(mergedUsers) });

          setUsersMain(mergedUsers);
          setUsersMaintest(mergedUsers);

          // 🧩 STEP 2: Ensure DB is open
          let db = dbRef.current;
          if (isPlatform("hybrid") && !db) {
            db = window.sqlitePlugin.openDatabase({
              name: "Conversa_chats_store.db",
              location: "default",
            });
            dbRef.current = db;
          }

          // 🧩 STEP 3: Load & merge messages (native → JS)
          const migratedMessages = await loadMessagesFromPreferencesToSQLite(db);
          console.log("🧾 Migrated messages:", migratedMessages?.length || 0);

          const currentMessages = messagesRef.current || [];
          const msgMap = new Map(currentMessages.map((m) => [m.id, m]));

          for (const msg of migratedMessages) {
            const existing = msgMap.get(msg.id);
            if (!existing || msg.timestamp > existing.timestamp) {
              msgMap.set(msg.id, msg);
            }
          }

          const mergedMessages = Array.from(msgMap.values()).sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );

          setMessages(mergedMessages);
          setMessagestest(mergedMessages);
          messagesRef.current = mergedMessages;

          console.log("✅ Foreground sync completed successfully");
        } catch (err) {
          console.error("❌ Error during foreground sync:", err);
        }
      }, 300);
    } else {
      console.log("⏸️ App paused",JSON.stringify(CallRuntime));
  
      isAcitve.current = false;

      if (socket.current?.readyState === WebSocket.OPEN) {
        if(!CallRuntime.showScreen && !restoringNow){
        startHeartbeatbackbgroung(socket.current, true);
        console.log("💓 WebSocket kept alive in background");
        }
      } else {
        socket.current = null;
      }
    }
  };

  const listener = CapacitorApp.addListener("appStateChange", handleAppStateChange);
  return () => listener.remove();
}, []);
async function ensureOverlayPermission() {
    if (!window.NativeAds) return false;

    return new Promise((resolve) => {
      console.log("overlay ask")
        if (!window.Android) window.NativeAds.requestOverlayPermission();

        // small delay to allow settings to update
        setTimeout(() => {
            resolve(true);
        }, 600);
    });
}

useEffect(() => {
  const handleIncoming = async(e) => {
    console.log("Incoming Call → Runtime Launch");
  if (CallRuntime.showScreen) {
      console.warn("⚠ Incoming call ignored — already in call screen");
      return;
    }

      const now = Date.now();
   const userdet = usersMain.find(u => u.id === e.detail.callerId);

  // =====================================================
  // 🔴 APP PAUSED (alive, not killed)
  // =====================================================
  if (!isAcitve.current && !e.detail.Autostart) {
    console.log("⏸️ App paused → saving call + showing notification");

    const payload = {
      callId: e.detail.callId || `${e.detail.callerId}_${now}`,
      callerId: e.detail.callerId,
      callOnly: e.detail.callOnly,
      ts: now, // 👈 REQUIRED FOR DIFF CHECK
    };

    startCallRingtone();

// Auto-timeout after 39 seconds
startCallTimeout(async () => {
  console.warn("⏰ Call timed out");

  stopCallRingtone();
  await LocalNotifications.cancel({ notifications: [{ id: 999 }] });

  await Preferences.remove({ key: "incoming_call_data" });
  await Preferences.remove({ key: "incoming_call_offer" });
});
    try {
      // Save minimal call data
      await Preferences.set({
        key: "incoming_call_data",
        value: JSON.stringify(payload),
      });

      await Preferences.set({
        key: "incoming_call_offer",
        value: JSON.stringify(e.detail.offer),
      });

      // 🔔 Show local notification
await LocalNotifications.schedule({
  notifications: [
    {
      id: 999, // fixed ID → replaces any previous call notification
      title: userdet?.name || "Incoming call",
      body: "Incoming call",
      schedule: { at: new Date(Date.now() + 100) },
  channelId: "call",
      // 🔔 Call-style behaviorH
      ongoing: true,
      autoCancel: false,
      sound: "defaulatNoti.wav",

      // 📞 Call category & priority
      category: "call",
      importance: 5, // IMPORTANCE_HIGH

      // 🎛 Action buttons
      actionTypeId: "CALL_ACTION",

      // Extra data for resume logic
      extra: {
        callId: payload.callId,
        callerId: payload.callerId,
        ts: payload.ts,
      },
    },
  ],
});


      console.log("📥 Call persisted + notification shown");
    } catch (err) {
      console.error("❌ Failed to persist paused call", err);
    }

    return; // ⛔ DO NOT open JS UI now
  }

 
    CallRuntime.set({
      mode: "answer",
      callerId: e.detail.callerId,
      offer: e.detail.offer,
      userId: e.detail.userId,
      callOnly: e.detail.callOnly,
      userdetail: userdet,
       Answer:e.detail.Answer ,
    });
  };

  window.addEventListener("incoming-call", handleIncoming);
  return () => window.removeEventListener("incoming-call", handleIncoming);
}, [usersMain]);


const connect = async (url) => {
  if (!socket.current || socket.current.readyState === WebSocket.CLOSED) {
    socket.current = new WebSocket(url);

    socket.current.addEventListener('open', () => {
      console.log('WebSocket connected');
      startHeartbeat(socket.current);
    });

   socket.current.addEventListener("message", async (event) => {
  let data;
  try { data = JSON.parse(event.data); }
  catch { return console.error("Invalid JSON"); }

  switch (data.type) {


    case "call-blocked" :{
       window.dispatchEvent(new CustomEvent("user-offline"));
      break;
    }
    /* 🔥 Caller sent offer → this becomes incoming-call event */
    case "incoming-call": {
      window.dispatchEvent(new CustomEvent("incoming-call", {
        detail: {
          callerId: data.callerId,
          offer: data.offer,
          userId: currentuserRef.current._id,
          callOnly:data.callOnly,
          Answer: false,
        }
      }));
      break;
    }

    /* 🔥 Callee accepted → Caller can now apply answer + flush ICE */
    case "call-answer": {
      window.dispatchEvent(new CustomEvent("call-answer", { detail: data.answer }));
      break;
    }

    /* 🔥 ICE exchange both ways */
    case "ice-candidate": {
      window.dispatchEvent(new CustomEvent("ice-candidate", { detail: data.candidate }));
      break;
    }

    /* ❌ Call Declined */
    case "call-declined": {
         if(CallRuntime.overlayActive && !restoringNow) {
        restoreNormal();
      }
      window.dispatchEvent(new CustomEvent("call-declined"));
      break;
    }

    /* ⚠ Remote offline */
    case "user-offline": {
         if(CallRuntime.overlayActive && !restoringNow) {
        restoreNormal();
      }
      window.dispatchEvent(new CustomEvent("user-offline"));
      break;
    }

    /* 📴 Remote ended call */
    case "end-call": {
          
  await LocalNotifications.cancel({
      notifications: [{ id: 999 }],
    });

    stopCallRingtone();
     clearCallTimeout();
      if(CallRuntime.overlayActive && !restoringNow) {
        restoreNormal();
      }
      window.dispatchEvent(new CustomEvent("end-call"));
      break;
    }
        /* 🎥 Remote toggled camera */
    case "camera-state": {
      window.dispatchEvent(
        new CustomEvent("camera-state", {
          detail: {
            senderId: data.senderId,
            enabled: data.enabled       // 🔥 true = video ON, false = OFF
          }
        })
      );
      break;
    }
case "ice-restart-offer": {
    window.dispatchEvent(new CustomEvent("ice-restart-offer", { 
        detail: {
            offer: data.offer,
            senderId: data.senderId,
            targetId: data.targetId
        }
    }));
    break;
}

case "ice-restart-answer": {
    window.dispatchEvent(new CustomEvent("ice-restart-answer", { 
        detail: data.answer 
    }));
    break;
}


    default:
      handleMessage(data);
  }
});


    socket.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      reconnect(url);
    });

    socket.current.addEventListener('close', (event) => {
      console.log('WebSocket closed:', event.reason);
      if (isAcitve.current) {
        reconnect(url);
      } else {
        socket.current = null;
      }
    });
  }
};

  function startHeartbeatbackbgroung(socket,offOnr) {
   if (!offOnr) {
    if (heartbeatIntervalId) {
      clearInterval(heartbeatIntervalId);
      heartbeatIntervalId = null;
    }
       if (heartbeatTimeoutId) {
      clearTimeout(heartbeatTimeoutId);
      heartbeatTimeoutId = null;
    }
    return;
  }
  if (heartbeatIntervalId || heartbeatTimeoutId) return;

     heartbeatIntervalId = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
      console.log("Ping sent in bg");
    }
  }, 15000);// Send a ping every  15 secx
     heartbeatTimeoutId  = setTimeout(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("⏳ Closing WebSocket after 20 seconds...");
      socket.close(1000, "Auto-close after 30s");
          if (heartbeatIntervalId) {
      clearInterval(heartbeatIntervalId);
      heartbeatIntervalId = null;
      console.log("🧹 Heartbeat interval cleared");

    }
        heartbeatTimeoutId = null;
    }
  }, CallRuntime.overlayActive ? 120000 : 50000);
  }

  // Send heartbeat to keep connection alive
  function startHeartbeat(socket) {
    setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
        console.log("Ping sent");
      }
    }, 1000 * 25); // Send a ping every 4 mins
  }

  // Handle messages received via WebSocket
  const handleMessage = async (data) => {
  
    try {
      if (isPlatform('hybrid')) {
        console.log(JSON.stringify(dbRef.current))
        if (!dbRef.current) {
          await initSQLiteDB();
        }
        await handleSQLiteStorage(dbRef.current, data);
      } else {
   
        await handleWebStorage(data);
      }
    } catch (err) {
      console.error("Error handling message:", err);
    }
  };

  // SQLite storage handling
  const handleSQLiteStorage = async (db, data) => {
    if (!db) {
      console.error('Database connection is not available.');
      return;
    }

    try {

      if(data.type === 'update'){
        if (data.updateType === 'delete') {
          console.log("Delete update received: ", data);
        
          const { messageIds } = data;
        
          // 1. Delete messages from SQLite
          const deleteQuery = `
            DELETE FROM messages
            WHERE id IN (${messageIds.map(() => '?').join(',')})
          `;
        
          db.executeSql(deleteQuery, messageIds, () => {
            //console.log("Messages deleted from SQLite");
        
            // 2. Delete messages from in-memory messagesRef.current
            messagesRef.current = messagesRef.current.filter((msg) =>
              !messageIds.includes(msg.id)
            );
        
            // 3. Update UI state to remove the deleted messages
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => !messageIds.includes(msg.id))
            );
        
            setMessagestest((prevMessages) =>
              prevMessages.filter((msg) => !messageIds.includes(msg.id))
            );
        
            // Optionally: You can also update unread counts if necessary, but for delete, it's less common.
            // No need to do anything here since the messages are deleted.
          });
        }
        
        if (data.type === 'update' && data.updateType === 'status') {
          console.log("Status update received: ", data);
        
          const { messageIds, status = 'sent' } = data;
        
          // 1. Update SQLite directly
          const updateQuery = `
            UPDATE messages
            SET status = ?
            WHERE id IN (${messageIds.map(() => '?').join(',')})
          `;
        
          db.executeSql(updateQuery, [status, ...messageIds], () => {
            //console.log("Messages updated in SQLite");
        
            // 2. Update in-memory messages
            messagesRef.current = messagesRef.current.map((msg) =>
              messageIds.includes(msg.id) ? { ...msg, status } : msg
            );
        
            // 3. Update UI state
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                messageIds.includes(msg.id) ? { ...msg, status } : msg
              )
            );
        
            setMessagestest((prevMessages) =>
              prevMessages.map((msg) =>
                messageIds.includes(msg.id) ? { ...msg, status } : msg
              )
            );
        
            // 4. Optional: reset unread count for sender
         
          });
        }
        

        if (data.updateType === 'unread') {
       
        
          const { messageIds } = data;
          if(!db){
            await initSQLiteDB();
          }
        console.log("Unread update received: ", data);
          // 1. Update SQLite directly
          const updateQuery = `
            UPDATE messages
            SET read = 1
            WHERE id IN (${messageIds.map(() => '?').join(',')})
          `;
        
          db.executeSql(updateQuery, messageIds, () => {
            //console.log("Messages marked as read in SQLite");
        
            // 2. Update in-memory messages (messagesRef.current)
            messagesRef.current = messagesRef.current.map((msg) =>
              messageIds.includes(msg.id) ? { ...msg, read: 1 } : msg
            );
        
            // 3. Update UI state for messages
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                messageIds.includes(msg.id) ? { ...msg, read: 1 } : msg
              )
            );
        
            setMessagestest((prevMessages) =>
              prevMessages.map((msg) =>
                messageIds.includes(msg.id) ? { ...msg, read: 1 } : msg
              )
            );
          
            // 4. Optionally reset unread count for sender (if applicable)
         
          });

        }
        
    }

    if (data.type === 'initialMessages') {
      try {
console.log("Initial messages received:", data);
    const androidMessages = await Promise.all(
  data.messages.map(convertServerToAndroidMessage)
);

        // Retrieve saved messages from SQLite
    
const newMessages = androidMessages.filter(
          msg => !messagesRef.current.some(existingMsg => existingMsg.id === msg.id)
        );

        
        // 2. Save all processed messages into SQLite
        const privateKeyPem = localStorage.getItem('privateKey'); // Must be stored locally
        for (const message of newMessages) {

          let decryptedContent = " new message " + message.file_type
          if(message.type !=='file'){
            console.log("Trying to decrypt message:", {
    encryptedAESKey: message.encryptedAESKey,
    eniv: message.eniv,
    encryptedMessage: message.encryptedMessage,
  });
 decryptedContent  = await decryptMessageHybrid(
  message.encryptedAESKey,
  message.eniv,
  message.encryptedMessage,
  privateKeyPem
  );
          }
          console.log("message",message)

          if (decryptedContent) {
            message.encryptedMessage = decryptedContent;
            message.content = decryptedContent;
          }

          await storeMessageInSQLite(db, message);

        
            if (message.sender === selectedUser.current && isAcitve.current === true) {
              message.read = 1; // Mark as read for the selected user
            }
            else {
              message.read = 0; // Mark as unread for others
              if(isnotmute){
                if (message.sender && !mutedlist.includes(message.sender)) {
                  //console.log("new message received",message.sender)

                  if(message.type === 'file'){
                    message.content = "New file received"+ " " + message.file_type;
                  }
                  showCustomNotification(message); // Show notification for unread messages
              // Shw notification
          //    showCustomNotification(message);
            
            
          }
        }
            
          }
        }
        
        //     const newMessages = androidMessages.map(message => {
        //   if (message.sender === selectedUser.current) {
        //     return { ...message, read: 1 };
        //   } else {

        //     if(isnotmute){
        //     if (message.sender && !mutedlist.includes(message.sender)) {
        //       //console.log("new message received",message.sender)
        //       // Shw notification
        //   //    showCustomNotification(message);
            
            
        //   }
        // }
        //     return { ...message, read: 0 };
        //   }
        // });
        
    
        // Handle unread counts and user IDs
        const unreadCountsMap = new Map();
        const userIds = new Set();
        const latestMessageTimestampsMap = new Map();
    
        newMessages.forEach(msg => {
          if (msg.read === 0 && msg.recipient === currentuserRef.current._id) {
            if (!unreadCountsMap.has(msg.sender)) {
              unreadCountsMap.set(msg.sender, 0);
            }
            unreadCountsMap.set(msg.sender, unreadCountsMap.get(msg.sender) + 1);
          }
          userIds.add(msg.sender);
          userIds.add(msg.recipient);
          latestMessageTimestampsMap.set(msg.sender, new Date(msg.timestamp).getTime());
          latestMessageTimestampsMap.set(msg.recipient, new Date(msg.timestamp).getTime());
        });
    
        // Update the local state with the new messages
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
        setMessagestest(prevMessages => [...prevMessages, ...newMessages]);
        messagesRef.current = [...messagesRef.current, ...newMessages];
    
        // Set user IDs, unread counts, and latest message timestamps
        // setInitialMessageUserIds(userIds);
    
        setLatestMessageTimestamps(latestMessageTimestampsMap);
    
        // Fetch usersMain array from localStorage
        const userMainArray = JSON.parse(localStorage.getItem('usersMain')) || [];
    
        // Add new users from the messages if they don't already exist
        for (let msg of newMessages) {
          const isSenderInUserMain = userMainArray.some(user => user.id === msg.sender);
    
          if (!isSenderInUserMain) {
            try {
              const response = await fetch(`${host}/user/fetchuser`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Auth': localStorage.getItem('token'),
                },
                body: JSON.stringify({ userid: msg.sender }),
              });
    
              const data = await response.json();
    
              if (data.success) {
                const { userResponse } = data;
    
                const newUser = {
                  id: userResponse.id,
                  name: userResponse.name,
                  avatar: userResponse.profilePic || img, // Assuming profilePic contains the image URL
                  lastMessage: msg.content,
                  timestamp: msg.timestamp,
                  phoneNumber: userResponse.phoneNumber,
                  unreadCount: 1, // This message is unread for the new user
                  About: userResponse.About,
                  updatedAt:userResponse.updatedAt,
                  DOB:userResponse.DOB,
                  Location:userResponse.Location,
                  gender:userResponse.gender,
                  publicKey:userResponse.publicKey
                };
    
                // Update usersMain by adding the new user and removing duplicates
                const updatedUsers = [...userMainArray, newUser].filter((user, index, self) =>
                  index === self.findIndex((u) => u.id === user.id)
                );
    
                // Update usersMain in localStorage and state
                localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
                Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
                userMainArray.push(newUser);
                setUsersMain(updatedUsers);
                setUsersMaintest(updatedUsers); // Assuming Zustand or another state management library
              }
    
            } catch (error) {
              console.error("Error fetching new user:", error);
            }
          }else {
            // ➤ Case: Existing user — update last message, timestamp, unread count, reset partial
            const updatedUsers = userMainArray.map(user => {
              if (user.id === msg.sender) {
                 const isSelected = selectedUser.current === msg.sender;

                // Compare the new message's timestamp with the stored timestamp
                const existingTimestamp = new Date(user.timestamp || 0);
                const incomingTimestamp = new Date(msg.timestamp);
            
                // If the incoming message is newer, update lastMessage and timestamp
                if (incomingTimestamp > existingTimestamp) {

                  return {
                    ...user,
                    lastMessage: msg.content,
                    timestamp: msg.timestamp,
                    unreadCount: isSelected ? 0 : msg.read === 0 ? (user.unreadCount || 0) + 1 : 0,
                    isPartialDelete: false, // Keep `isPartialDelete` as false
                  };
                }
              }
              return user; // Keep the rest of the users unchanged
            });
      
            localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
              Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
            setUsersMain(updatedUsers);
            setUsersMaintest(updatedUsers);
          }
        }
    
      } catch (error) {
        console.error("Error handling initial messages:", error);
      }
    }
     else if (data.type === 'message') {
   console.log("recive mesage",JSON.stringify(data,null,2))
        const { id, sender, recipient, timestamp, status, read } = data;
        let updatedReadStatus = read;
 
        // Retrieve the users in localStorage
        const userMainArray =  JSON.parse(localStorage.getItem('usersMain')) || [];
        const isSenderInUserMain = userMainArray.some(user => user.id === sender);
   

                  const privateKeyPem = localStorage.getItem('privateKey');
              const decryptedContent =  await decryptMessageHybrid(
  data.encryptedAESKey,
  data.eniv,
  data.encryptedMessage,
  privateKeyPem
);
console.log("decrypted content",decryptedContent)



        if (!isSenderInUserMain) {
          try {
            // Fetch the user details from the server
            const response = await fetch(`${host}/user/fetchuser`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Auth': localStorage.getItem('token'),
              },
              body: JSON.stringify({ userid: sender }),
            });
            const data = await response.json();
            
            if (data.success) {
              const { userResponse } = data;
    
              const newUser = {
                id: userResponse.id,
                name: userResponse.name,
                avatar: userResponse.profilePic || img,
                lastMessage: decryptedContent,
                timestamp: timestamp,
                phoneNumber: userResponse.phoneNumber,
                unreadCount: 0, // This message is unread for the new user
                lastUpdated: userResponse.lastUpdated,
                About: userResponse.About,
                updatedAt:userResponse.updatedAt,
                DOB:userResponse.DOB,
                Location:userResponse.Location,
                gender:userResponse.gender,
                publicKey:userResponse.publicKey
              };
              
              // Add the new user to the usersMain array and remove duplicates
              const updatedUsers = [...userMainArray, newUser]
                .filter((user, index, self) => index === self.findIndex((u) => u.id === user.id)); // Ensure no duplicates

              // Update localStorage and state
              localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
                Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
              setUsersMain(updatedUsers);
              setUsersMaintest(updatedUsers);
            }
          } catch (error) {
            console.error("Error in fetching new user:", error);
          }
        }
        
        // Handle read status based on whether the sender is the selected user
        if (sender === selectedUser.current &&  isAcitve.current === true) {
          console.log("lets try")
          updatedReadStatus = 1;
          
          const updatePayload = {
            type: 'update',
            updateType: 'unread',
            messageIds: [id],
            sender: sender,
            recipient: recipient,
          };

          
          
          socket.current.send(JSON.stringify({ updatePayload }));
        } else {
         if(isnotmute){

            if (sender && !mutedlist.includes(sender)) {
              //console.log("new message received",sender)
              let message 
              if(data.type === 'file'){
  message = {
                sender: sender,
                content: "new file received" + " " + data.file_type,
                timestamp: timestamp,
              }
              }else{
               message = {
                sender: sender,
                content: decryptedContent,
                timestamp: timestamp,
              }
            }
              showCustomNotification(message);
              // Shw notification
            
            }
          }
          updatedReadStatus = 0;
        }
      
        // Create the new message object
        const newMessage = {
          id,
          type: data.type || 'message',
          sender,
          recipient,
          read: updatedReadStatus,
          content: decryptedContent || null,
          timestamp: timestamp || null,
          status: status || 'pending',
          isDeleted: data.isDeleted || 0,
          isDownload: data.isDownload || 0,
          file_name: data.file_name || null,
          file_type: data.file_type || null,
          file_size: data.file_size || null,
          thumbnail: data.thumbnail || null,
          file_path: data.file_path || null,
          encryptedMessage: decryptedContent || null,
          encryptedAESKey: data.encryptedAESKey || null,
          eniv: data.eniv || null
        };

  
        const afterusermainarray = JSON.parse(localStorage.getItem('usersMain')) || [];

const updatedUsers = afterusermainarray.map(user => {
  if (user.id === sender) {
    let updatedUnreadCount = 0;

    // Only increment unread if user is NOT the currently selected one
    if (updatedReadStatus === 0 && sender !== selectedUser.current) {
      updatedUnreadCount = (user.unreadCount || 0) + 1;
    }else{
      updatedUnreadCount = 0;
    }

    return {
      ...user,
      lastMessage: decryptedContent,
      timestamp: timestamp,
      unreadCount: updatedUnreadCount,
      isPartialDelete: false,
    };
  }
  return { ...user };
});

        // Update localStorage and state with the updated user list
        // Before updating localStorage
// //console.log('Before updating localStorage:', localStorage.getItem('usersMain'));

// After updating localStorage
 localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
//console.log('After updating localStorage:', localStorage.getItem('usersMain'));


        setUsersMain(updatedUsers);
        setUsersMaintest(updatedUsers);
      
        // Update the messages in state and localStorage
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessagestest(prevMessages => [...prevMessages, newMessage]);
        messagesRef.current = [...messagesRef.current, newMessage];
        
        // Save the message to SQLite
        //console.log("new message",JSON.stringify(newMessage))
        await storeMessageInSQLite(db, newMessage);
        
        // Update the latest message timestamps
        const latestMessageTimestampMap = new Map(latestMessageTimestamps);
        latestMessageTimestampMap.set(sender, new Date(timestamp).getTime());
        latestMessageTimestampMap.set(recipient, new Date(timestamp).getTime());
        setLatestMessageTimestamps(latestMessageTimestampMap);
        
        // You can also update the unread counts here if needed
      }
      
      if(data.type ==='file'){

        const {   sender,
          recipient,
      file_type,
          id,
          status,timestamp } = data;

const userMainArray =  JSON.parse(localStorage.getItem('usersMain')) ||[];
        const isSenderInUserMain = userMainArray.some(user => user.id === sender);
      console.log("data to come",data)
        if (!isSenderInUserMain) {
          try {
            //console.log("we runnig not presnet user ")
            const response = await fetch(`${host}/user/fetchuser`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Auth': localStorage.getItem('token'),
              },
              body: JSON.stringify({ userid: sender }),
            });
            
            const data = await response.json();
            if (data.success) {
              const { userResponse } = data;
      
              const newUser = {
                id: userResponse.id,
                name: userResponse.name,
                avatar: userResponse.profilePic || img,
                lastMessage: `A new ${file_type} come`,
                timestamp: timestamp,
                phoneNumber: userResponse.phoneNumber,
                unreadCount: 1, // This message is unread for the new user
                lastUpdated: userResponse.lastUpdated,
                About:userResponse.About, 
                publicKey:userResponse.publicKey,
                gender:userResponse.gender,
                DOB:userResponse.DOB,
                Location:userResponse.Location,
                updatedAt:userResponse.updatedAt

              };
      
              //console.log("New user:", newUser);
      
              // Add new user and ensure no duplicates
              const updatedUsers = [
                ...userMainArray,
                newUser
              ].filter((user, index, self) => index === self.findIndex((u) => u.id === user.id));
      //console.log("updatedUsers",updatedUsers)
              // Update localStorage and state with updated users
              //console.log("before udpate",JSON.parse(localStorage.getItem('usersMain')))
              localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
                Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
              //console.log("after udpate",JSON.parse(localStorage.getItem('usersMain')))
              setUsersMain(updatedUsers);
              setUsersMaintest(updatedUsers);
            }

   
          } catch (error) {
            console.error("Error in fetching new user:", error);
          }
        }
           var read = null;
          if(sender === selectedUser.current){
            read = 1
            const updatePayload = {
              type: 'update',
              updateType: 'unread',
              fileType: 'file',
              messageIds:[id],
              sender: sender,
              recipient: recipient
            };

          try {
              socket.current.send(JSON.stringify({ updatePayload }));
           
            } catch (err) {
              console.error("WebSocket send failed", err);
            }
          } else {
            if (isnotmute) {
              if (sender && !mutedlist.includes(sender)) {
                //console.log("new message received", sender);
                // Show notification
                const message = {
                  sender: sender,
                  content: 'new file received' + " " + file_type,
                  timestamp: timestamp,
                }
               showCustomNotification(message);
              }
            }
            read = 0;
          }
          const newMessage = {
            id,
            type: data.type || 'file',
            sender,
            recipient,
            read,
            content: `a new ${data.file_type} just come`,
            timestamp: timestamp || null,
            status: status, // Initial status
            isDeleted: data.isDeleted || 0,
            isDownload: data.isDownload || 0, // Binary data of the file
            file_name: data.file_name || null,
            file_type: data.file_type || null,
            file_size: data.file_size || null,
            file_path: data.file_path || null,
            thumbnail: data.thumbnail || null, // Generate or add thumbnail later, if needed// Add actual path later (e.g., via WebSocket)
            encryptedMessage: data.encryptedMessage || null,
            encryptedAESKey: data.encryptedAESKey || null,
            eniv: data.eniv || null,
            isError: 0,
           
          };


      
            const afterusermainarray = JSON.parse(localStorage.getItem('usersMain')) || [];

const updatedUsers = afterusermainarray.map(user => {
  if (user.id === sender) {
    let updatedUnreadCount = 0;


    // Only increment unread if user is NOT the currently selected one
    if (read === 0 && sender !== selectedUser.current) {
      updatedUnreadCount = (user.unreadCount || 0) + 1;
    }else{
      updatedUnreadCount = 0;
    }

    return {
      ...user,
      lastMessage: `A new ${data.file_type} jist come`,
      timestamp: timestamp,
      unreadCount: updatedUnreadCount,
      isPartialDelete: false,
    };
  }
  return { ...user };
});


        // Update localStorage and state with the updated user list
        // Before updating localStorage
// //console.log('Before updating localStorage:', localStorage.getItem('usersMain'));

// After updating localStorage
 localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
 
        setUsersMain(updatedUsers);
        setUsersMaintest(updatedUsers);
 //Check if the new message already exists by ID
       
           setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessagestest(prevMessages => [...prevMessages, newMessage]);
          messagesRef.current = [...messagesRef.current, newMessage]; // Add new message if not duplicate
      
  try{

    
            await storeMessageInSQLite(db, newMessage);
  }catch(error){
    console.error("Error storing file message in SQLite:", error);
  }

      }
    } catch (error) {
      console.error('Error in SQLite message handling:', error);
    }
  };
function convertServerToAndroidMessage(serverMsg) {
  return new Promise((resolve) => {
    const message = {
      id: serverMsg.id,
      sender: serverMsg.sender,
      recipient: serverMsg.recipient,
      content: serverMsg.content || "",
    
      timestamp: serverMsg.timestamp,
      status: serverMsg.status || 'sent',
      read: serverMsg.read ? 1 : 0,
    
      isDeleted: serverMsg.isDeleted ? 1 : 0,
      isDownload: serverMsg.isDownload || 0,
    
      type: serverMsg.type || 'text',
      file_name: serverMsg.fileName || '',
      file_type: serverMsg.fileType || '',
      file_size: serverMsg.fileSize || 0,
    
      file_path: serverMsg.file_path || '',
      isSent: serverMsg.isSent ? 1 : 0,
      isError: serverMsg.isError ? 1 : 0,
      encryptedMessage: serverMsg.encryptedMessage || '',
      encryptedAESKey: serverMsg.encryptedAESKey || '',
      eniv: serverMsg.eniv || '',
      thumbnail: ''
    };

if (serverMsg.thumbnail instanceof Blob) {
  const reader = new FileReader();
  reader.onloadend = () => {
    message.thumbnail = reader.result;
    resolve(message);
  };
  reader.readAsDataURL(serverMsg.thumbnail);
} else if (
  typeof serverMsg.thumbnail === 'object' &&
  serverMsg.thumbnail?.type === 'Buffer' &&
  Array.isArray(serverMsg.thumbnail?.data)
) {
  // Correct fix: this is already a base64 data URI encoded as byte array
  const byteArray = new Uint8Array(serverMsg.thumbnail.data);
  const decodedStr = new TextDecoder().decode(byteArray);
  message.thumbnail = decodedStr;
  resolve(message);
} else {
  message.thumbnail = serverMsg.thumbnail || '';
  resolve(message);
}


  });
}

  
  // WebStorage handling
  const handleWebStorage = async (event) => {
    

    try {
    
      const data = event;
      //console.log("data from webstorage",data.type)
    

if (data.type === "update" && data.updateType === "delete") {
  const { messageIds } = data;

  //console.log("Delete update received: ", messageIds);

  // Fetch messages from localStorage
  const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");

  // Filter out the messages that need to be deleted
  const updatedMessages = storedMessages.filter((message) =>
    !messageIds.includes(message.id)
  );

  // Update messagesRef by filtering out deleted messages
  messagesRef.current = messagesRef.current.filter((msg) =>
    !messageIds.includes(msg.id)
  );

  // Save the updated messages to localStorage (without the deleted ones)
  //saveMessagesToLocalStorage(updatedMessages, "from delete update");
localStorage.setItem("messages", JSON.stringify(updatedMessages));
  // Update React states to remove the deleted messages
  setMessages((prevMessages) =>
    prevMessages.filter((msg) => !messageIds.includes(msg.id))
  );

  setMessagestest((prevMessages) =>
    prevMessages.filter((msg) => !messageIds.includes(msg.id))
  );

  //console.log("Messages deleted: ", messageIds);
}

if (data.type === "update" && data.updateType === "status") {
  const { messageIds } = data;
  const status = data.status || 'sent'; // Default to 'sent' if status is not provided  

  //console.log("Status update received: ", messageIds, "New Status:", status);

  // Fetch messages from localStorage
  const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");

  const updatedMessages = storedMessages.map((message) =>
    messageIds.includes(message.id) ? { ...message, status } : message
  );

  // Update messagesRef
  messagesRef.current = messagesRef.current.map((msg) =>
    messageIds.includes(msg.id) ? { ...msg, status } : msg
  );

  // Save to localStorage
 // saveMessagesToLocalStorage(updatedMessages, "from status update");
   localStorage.setItem("messages", JSON.stringify(updatedMessages));

  // Update React states
  setMessages((prevMessages) =>
    prevMessages.map((msg) =>
      messageIds.includes(msg.id) ? { ...msg, status } : msg
    )
  );

  setMessagestest((prevMessages) =>
    prevMessages.map((msg) =>
      messageIds.includes(msg.id) ? { ...msg, status } : msg
    )
  );



  //console.log("Messages updated with new status: ", updatedStatusMessages);
}

      if (data.type === "update" && data.updateType === "unread") {
     

        const { messageIds } = data;
        //console.log("Update message unread received: ", messageIds);
        // Fetch and update messages in localStorage
        const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
        const updatedMessages = storedMessages.map((message) =>
          messageIds.includes(message.id) ? { ...message, read: 1 } : message
        );
      
        //console.log("Messages to be updated before: ", messagesToUpdate);
        // Update localStorage and state
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
       // saveMessagesToLocalStorage(updatedMessages,"from handlewebstorage");
        
      // localStorage.setItem("messages", JSON.stringify(updatedMessages));
     
     
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, read: 1 } : msg
          )
        );
        setMessagestest((prevMessages) => 
          prevMessages.map((msg) => 
            messageIds.includes(msg.id) ? { ...msg, read: 1 } : msg
          )
        );
        messagesRef.current = messagesRef.current.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, read: 1 } : msg
        );

        //console.log("Messages to be updated after: ", updatedMessagesInRef);

  
        // Optionally update unread counts
    
      }
  

      if (data.type === 'initialMessages') {
        const { messages: initialMessages } = data;
        if(!initialMessages) return

        const androidMessages = initialMessages.map(convertServerToAndroidMessage);

        //console.log("Initial messages received: ", androidMessages);
        let savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
const privatekey = localStorage.getItem('privateKey')
        // Filter out any messages already saved to avoid duplicates
        const filteredMessages = savedMessages.filter(msg => !msg.id.startsWith('temp-'));
        const processedMessages = androidMessages.map(message => {
          const decryptedMessage =   decryptMessageHybrid(
  data.encryptedAESKey,
  data.eniv,
  data.encryptedMessage,
  privatekey
);
             
          message.encryptedMessage = decryptedMessage;
          message.content = decryptedMessage;
          if (message.sender === selectedUser.current) {
            return { ...message, read: 1 };
          } else {
            // Show notification for messages not from the selected user
           if(isnotmute){
            if (message.sender && !mutedlist.includes(message.sender)) {
              //console.log("new message received",message.sender)
              // Shw notification
            
            }
           } // You should define this function
            return { ...message, read: 0 };
          }
        });
        
        // Filter only new messages not already saved
        const newMessages = processedMessages.filter(message =>
          !filteredMessages.some(savedMsg => savedMsg.id === message.id)
        );
        
        // Append new messages to the existing saved messages
        savedMessages.push(...newMessages);
     
        
        // Append new messages to the existing saved messages
      
        
        // Save the updated messages back to localStorage
        localStorage.setItem('messages', JSON.stringify(savedMessages));
        
        // ✅ Add this console to check if the messages were saved
        //console.log(`Messages after saving (${newMessages.length} new):`, savedMessages);
        // Update local state for messages
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
        setMessagestest(prevMessages => [...prevMessages, ...newMessages]);
        messagesRef.current = [...messagesRef.current, ...newMessages];

        const unreadCountsMap = new Map();
        const userIds = new Set();
        const latestMessageTimestampsMap = new Map();
      
        // Iterate through each message in newMessages to update user data and unread count
        for (let msg of newMessages) {
          if (msg.read === 0 && msg.recipient === currentuserRef.current._id) {
            unreadCountsMap.set(msg.sender, (unreadCountsMap.get(msg.sender) || 0) + 1);
          }
          userIds.add(msg.sender);
          userIds.add(msg.recipient);
          latestMessageTimestampsMap.set(msg.sender, new Date(msg.timestamp).getTime());
          latestMessageTimestampsMap.set(msg.recipient, new Date(msg.timestamp).getTime());
        }
      
        // Set the user IDs for initial messages and the latest message timestamps
       // setInitialMessageUserIds(userIds);
        setLatestMessageTimestamps(latestMessageTimestampsMap);
      
        const unreadCounts = Object.fromEntries(unreadCountsMap);
        localStorage.setItem('unreadCounts', JSON.stringify(unreadCounts));
     
        // Now handle the addition of new users for each initial message sender if they aren't in userMain
        const userMainArray = JSON.parse(localStorage.getItem('usersMain')) || [];
        
        for (let msg of newMessages) {
          const isSenderInUserMain = userMainArray.some(user => user.id === msg.sender);
      
          if (!isSenderInUserMain) {
       
      
            try {
              const response = await fetch(`${host}/user/fetchuser`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Auth': localStorage.getItem('token'),
                },
                body: JSON.stringify({ userid: msg.sender }),
              });
      
              const data = await response.json();
      
              if (data.success) {
                const { userResponse } = data;
      
                const newUser = {
                  id: userResponse.id,
                  name: userResponse.name,
                  avatar: userResponse.profilePic || img,  // Assuming profilePic contains the image URL
                  lastMessage: msg.content,
                  timestamp: msg.timestamp,
                  phoneNumber: userResponse.phoneNumber,
                  unreadCount: 1, // This message is unread for the new user
                  About:userResponse.About,
                  publicKey:userResponse.publicKey,
                  gender:userResponse.gender,
                  DOB:userResponse.DOB,
                  Location:userResponse.Location,
                  updatedAt:userResponse.updatedAt
                };
         
      
                // Add the new user to `usersMain` and remove duplicates using `filter`
                const updatedUsers = [...userMainArray, newUser].filter((user, index, self) =>
                  index === self.findIndex((u) => u.id === user.id)
                );
            
                // Update the usersMain in localStorage and state
                localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
                  Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
                setUsersMain(updatedUsers);
                setUsersMaintest(updatedUsers);  // Assuming Zustand or another state management library
               //console.log("zustand list",usersMaintest)
              }
      
            } catch (error) {
              console.error("Error in fetching new user:", error);
            }
          } else {
            // ➤ Case: Existing user — update last message, timestamp, unread count, reset partial
            const updatedUsers = userMainArray.map(user => {
              if (user.id === msg.sender) {
                // Compare the new message's timestamp with the stored timestamp
                const existingTimestamp = new Date(user.timestamp || 0);
                const incomingTimestamp = new Date(msg.timestamp);
            
                // If the incoming message is newer, update lastMessage and timestamp
                if (incomingTimestamp > existingTimestamp) {
                  return {
                    ...user,
                    lastMessage: msg.content,
                    timestamp: msg.timestamp,
                    unreadCount: msg.read === 0 ? (user.unreadCount || 0) + 1 : 0, // Increment unread count if unread
                    isPartialDelete: false, // Keep `isPartialDelete` as false
                  };
                }
              }
              return user; // Keep the rest of the users unchanged
            });
            localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
              Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
            setUsersMain(updatedUsers);
            setUsersMaintest(updatedUsers);
          }
        }
      }
      else if (data.type === 'message') {
        const { id, content, sender, recipient, timestamp, status, read } = data;
     //   const storedUnreadCounts = JSON.parse(localStorage.getItem('unreadCounts')) || {};
        let updatedReadStatus = read;
      
        // Retrieve current userMain from localStorage
        const userMainArray = usersMain || JSON.parse(localStorage.getItem('usersMain'))|| [];
        const isSenderInUserMain = userMainArray.some(user => user.id === sender);
        const privateKey = localStorage.getItem('privateKey');
          const decryptedMessage = await decryptMessageHybrid(
  data.encryptedAESKey,
  data.eniv,
  data.encryptedMessage,
  privateKey
);
                     
        if (!isSenderInUserMain) {
          try {
            //console.log("we runnig not presnet user ")
            const response = await fetch(`${host}/user/fetchuser`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Auth': localStorage.getItem('token'),
              },
              body: JSON.stringify({ userid: sender }),
            });
            
            const data = await response.json();
            if (data.success) {
              const { userResponse } = data;
      
              const newUser = {
                id: userResponse.id,
                name: userResponse.name,
                avatar: userResponse.profilePic || img,
                lastMessage: content,
                timestamp: timestamp,
                phoneNumber: userResponse.phoneNumber,
                unreadCount: 1, // This message is unread for the new user
                lastUpdated: userResponse.lastUpdated,
                About:userResponse.About, 
                publicKey:userResponse.publicKey,
                gender:userResponse.gender,
                DOB:userResponse.DOB,
                Location:userResponse.Location,
                updatedAt:userResponse.updatedAt

              };
      
              //console.log("New user:", newUser);
      
              // Add new user and ensure no duplicates
              const updatedUsers = [
                ...userMainArray,
                newUser
              ].filter((user, index, self) => index === self.findIndex((u) => u.id === user.id));
      //console.log("updatedUsers",updatedUsers)
              // Update localStorage and state with updated users
              //console.log("before udpate",JSON.parse(localStorage.getItem('usersMain')))
              localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
                Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
              //console.log("after udpate",JSON.parse(localStorage.getItem('usersMain')))
              setUsersMain(updatedUsers);
              setUsersMaintest(updatedUsers);
            }

   
          } catch (error) {
            console.error("Error in fetching new user:", error);
          }
        }
      //console.log("selected user",selectedUser.current)
        // Handle the read status based on whether the sender is the selected user
        if (sender === selectedUser.current) {
          
          updatedReadStatus = 1;
      
          const updatePayload = {
            type: 'update',
            updateType: 'unread',
            messageIds: [id],
            sender,
            recipient
          };
          console.log("updatePayload",updatePayload)
          //console.log("socket",socket.current)
      
          socket.current.send(JSON.stringify({ updatePayload }));
        } else {
          //console.log("muted list",mutedlist)
       if(isnotmute){

            if (sender && !mutedlist.includes(sender)) {
              const message = {

                sender,
                content,
                timestamp,
              
              }

              //console.log("message",message)
              showCustomNotification(message)
              // Show notification
            }
          }
            
         
          updatedReadStatus = 0;
        }
      
        const newMessage = {
          id,
          type: data.type || 'message',
          sender,
          recipient,
          read: updatedReadStatus,
          content: decryptedMessage || null,
          timestamp: timestamp || null,
          status: status, // Initial status
          isDeleted: data.isDeleted || 0,
          isDownload: data.isDownload || 0, // Binary data of the file
          file_name: data.file_name || null,
          file_type: data.file_type || null,
          file_size: data.file_size || null,
          thumbnail: data.thumbnail || null, // Add actual path later (e.g., via WebSocket)
          encryptedMessage: decryptedMessage || null,
          encryptedAESKey: data.encryptedAESKey || null,
          eniv: data.eniv || null
        };
      
        const afterusermainarray = JSON.parse(localStorage.getItem('usersMain')) || [];
        // Update userMain with new message data
//console.log("unread",updatedReadStatus)
        const updatedUsers = afterusermainarray.map(user => {
          if (user.id === sender) {
          

    let updatedUnreadCount = user.unreadCount;

    // Only update unread count if the message is unread (status 0)
    if (updatedReadStatus === 0) {
      updatedUnreadCount += 1; // Increment unread count when unread
    } else if (updatedReadStatus === 1) {
      updatedUnreadCount = 0; // Reset unread count when read
    }

    //console.log("Updated Unread Count:", updatedUnreadCount);

            return {
              ...user,
              lastMessage: content,
              timestamp: timestamp,
              unreadCount: updatedUnreadCount,
              isPartialDelete: false,

            };
          }
          return { ...user }; // clone untouched users
        });
      
        //console.log("selected user",selectedUser.current)
      //console.log("updatedUsers",updatedUsers)
        // Update localStorage and state with the updated user list
        // Before updating localStorage

localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
//console.log('After updating localStorage:', localStorage.getItem('usersMain'));


// After updating localStorage



        setUsersMain(updatedUsers);
        setUsersMaintest(updatedUsers);
        
      
        // Update the messages array in localStorage
        const updatedMessages = [
          ...JSON.parse(localStorage.getItem('messages') || '[]'),
          newMessage
        ];
      
        // Update messages in state and localStorage
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessagestest(prevMessages => [...prevMessages, newMessage]);
        messagesRef.current = [...messagesRef.current, newMessage];
     

        localStorage.setItem('messages', JSON.stringify(updatedMessages));
      //  saveMessagesToLocalStorage(updatedMessages, "from handleWebStorage single");
      }
      

      if (data.type === 'file') {
        try {
          // Destructure data
          const { sender, recipient, id, file_name, file_type, thumbnail, status, timestamp,content } = data;
          //console.log("data", data);
           const userMainArray = usersMain || JSON.parse(localStorage.getItem('usersMain')) || [];
        const isSenderInUserMain = userMainArray.some(user => user.id === sender);
      
        if (!isSenderInUserMain) {
          try {
            //console.log("we runnig not presnet user ")
            const response = await fetch(`${host}/user/fetchuser`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Auth': localStorage.getItem('token'),
              },
              body: JSON.stringify({ userid: sender }),
            });
            
            const data = await response.json();
            if (data.success) {
              const { userResponse } = data;
      
              const newUser = {
                id: userResponse.id,
                name: userResponse.name,
                avatar: userResponse.profilePic || img,
                lastMessage: `A new ${file_type} come`,
                timestamp: timestamp,
                phoneNumber: userResponse.phoneNumber,
                unreadCount: 1, // This message is unread for the new user
                lastUpdated: userResponse.lastUpdated,
                About:userResponse.About, 
                publicKey:userResponse.publicKey,
                gender:userResponse.gender,
                DOB:userResponse.DOB,
                Location:userResponse.Location,
                updatedAt:userResponse.updatedAt

              };
      
              //console.log("New user:", newUser);
      
              // Add new user and ensure no duplicates
              const updatedUsers = [
                ...userMainArray,
                newUser
              ].filter((user, index, self) => index === self.findIndex((u) => u.id === user.id));
      //console.log("updatedUsers",updatedUsers)
              // Update localStorage and state with updated users
              //console.log("before udpate",JSON.parse(localStorage.getItem('usersMain')))
              localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
                Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
              //console.log("after udpate",JSON.parse(localStorage.getItem('usersMain')))
              setUsersMain(updatedUsers);
              setUsersMaintest(updatedUsers);
            }

   
          } catch (error) {
            console.error("Error in fetching new user:", error);
          }
        }
          var read = 0;
      
          // Check if sender is the selected user
          if (sender === selectedUser.current) {
            read = 1;
      
            // Prepare update payload
            const updatePayload = {
              type: 'update',
              updateType: 'unread',
              fileType: 'file',
              messageIds: [id],
              sender: sender,
              recipient: recipient,
            };
      
            //console.log("updatePayload for file", updatePayload);
      
            // Send update to WebSocket
            try {
              socket.current.send(JSON.stringify({ updatePayload }));
              //console.log("WebSocket send success");
            } catch (err) {
              console.error("WebSocket send failed", err);
            }
          } else {
            if (isnotmute) {
              if (sender && !mutedlist.includes(sender)) {
                //console.log("new message received", sender);
                // Show notification
                const message = {
                  sender,
                  content:'file may be',
                  timestamp
                }

                showCustomNotification(message)
                
              }
            }
            read = 0;
          }
      
          // Prepare new message object
          const newMessage = {
            id,
            type: 'file',
            sender,
            recipient,
            file_path: data.file_path || null,
            read: read,
            content: content || null,
            timestamp: timestamp || null,
            status: status || 'pending', // Default to 'pending' status if not provided
            isDeleted: data.isDeleted || 0,
            isDownload: data.isDownload || 0,
            file_name: file_name || null,
            file_type: file_type || null,
            file_size: data.file_size || null,
            thumbnail: thumbnail || null,
            encryptedMessage: data.encryptedMessage || null,
            encryptedAESKey: data.encryptedAESKey || null,
            eniv:data.eniv || null
          };
      
          // Get current messages from localStorage and update
          const updatedMessages = [
            ...JSON.parse(localStorage.getItem('messages') || '[]'),
            newMessage
          ];
      
          //console.log("newMessage to add:", newMessage);
      
          // Update messagesRef
          setMessages(prevMessages => [...prevMessages, newMessage]);
          setMessagestest(prevMessages => [...prevMessages, newMessage]);
          messagesRef.current = [...messagesRef.current, newMessage];
      
          // Save updated messages to localStorage
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
      
        } catch (error) {
          console.error("Error handling file message:", error);
        }
      }
      
    } catch (error) {
      console.error('Error in WebStorage message handling:', error);
    }
  };


  const sendMessage = (message) => {
    //console.log(socket.current)
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      try {
        socket.current.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('WebSocket is not connected');
    }
  };



  const reconnect = (url) => {
    //console.log('Attempting to reconnect...');
    setTimeout(() => {
      connect(url);
    }, 5000);
  };

const getmessages = async()=>{
  try {
const currentuserRef = JSON.parse(localStorage.getItem('currentuser'))
var db = null

    if(isPlatform('hybrid')){
   if(!dbRef.current){
    const dbName = `Conversa_chats_store.db`;
          db = window.sqlitePlugin.openDatabase({ name: dbName, location: 'default' });
   }else{
    db = dbRef.current
   }

   //console.log("db",db)

      const allmessage = await fetchAllMessages(db);
       const deadmessage= await loadMessagesFromPreferencesToSQLite(db); // Load messages from Preferences to SQLite
console.log("all message from db",allmessage)
      console.log("all message from deadmessage",deadmessage)
//console.log("current usee from ger message",currentuserRef._id)
      const initialMessages = await getMessagesFromSQLite(db, currentuserRef._id, 45);
      //console.log("initial messages from db",initialMessages)
   const combinedMessages = [
  ...initialMessages,
  ...(Array.isArray(deadmessage) ? deadmessage : [])
].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//console.log("initial messages from db",(combinedMessages))

      setMessages(combinedMessages);
      setMessagestest(combinedMessages);
      messagesRef.current = combinedMessages
    }else{
      //console.log("current usee from ger message",currentuserRef._id)
      
      const initialMessages = JSON.parse(localStorage.getItem('messages')) || [];
      setMessages(initialMessages);
      setMessagestest(initialMessages);
      messagesRef.current = initialMessages
   
    }

    
  } catch (error) {
    console.error("error in getting messagessgsgs",error)
  }
}


const saveMessage = async(message)=>{

  try {
   
    if (socket.current ) {
      if (socket.current.readyState === WebSocket.OPEN) {
        try {
          const sendMessage = { ...message };
          if(message.type === 'messages'){
                     
           sendMessage.content = "encrpted text can't be read";
          }
   console.log("message to send", JSON.stringify(sendMessage, null, 2));

      
          socket.current.send(JSON.stringify(sendMessage));

   
          message.isSent = 1
          message.isError = 0
          if (message.type === 'file') {
        
            return {
              status: socket.current.readyState === WebSocket.OPEN ? 'sent' : 'failed',
              message
            };
          }
        } catch (error) {
          console.error('Error sending message:', error);
          message.isSent = 0
          message.isError = 1
if(message.type === 'file'){
  return {
    status: socket.current.readyState === WebSocket.OPEN ? 'sent' : 'failed',
    message
  };
}
        
        }
      } else {
        message.isSent = 0
             message.isError = 0
        //console.log("WebSocket is not open yet.");
      }
     
    } else {
      const token = localStorage.getItem('token');
            const wsUrl = `wss://${Maindata.SERVER_URL}?token=${token}`;

         
          await connect(wsUrl);
       
          setLink(wsUrl);
      message.isSent = 0
      message.isError = 0
      console.error('WebSocket is not connected');
      if(message.type === 'file'){
        return {
          status: socket.current.readyState === WebSocket.OPEN ? 'sent' : 'failed',
          message
        }
      }
    }
    const exists =
    isPlatform('hybrid')
      ? messagesRef.current.some(m => m.id === message.messageId)
      : (JSON.parse(localStorage.getItem('messages')) || []).some(m => m.id === message.messageId);
  
  if (exists) {
 
    return;
  }


  

   if(message.type === 'messages'){
    //console.log("message to save",message)
   
    if(isPlatform('hybrid')){
      
      const mainMessages = {
        id: message.messageId,  // Ensure the correct field is mapped
        sender: message.sender,
        recipient: message.recipient,
        content: message.content || null, // If content is null or undefined, set it to null
        timestamp: message.timestamp,
        status: message.status,
        read: message.read,
        type: message.type,
      
        fileType: message.fileType || null, // If fileType is null or undefined, set it to null
        file_size: message.file_size || null, // If file_size is null or undefined, set it to null
        file_path: message.file_path || null, // If file_path is null or undefined, set it to null
        file_name: message.file_name || null, // If file_name is null or undefined, set it to null
        isDeleted: message.isDeleted || 0, // Default to 0 if isDeleted is null or undefined
        isDownload: message.isDownload || 1, // Default to 0 if isDownload is null or undefined
        thumbnail: message.thumbnail || null, // If thumbnail is null or undefined, set it to null
        isSent: message.isSent === undefined ? 1 : message.isSent, // Set to 1 only if isSent is undefined
        isError: message.isError === undefined ? 0 : message.isError, // Set to 0 only if isError is undefined
        encryptedMessage: message.encryptedMessage || null, // If encryptedMessage is null or undefined, set it to null
        encryptedAESKey: message.encryptedAESKey || null, // If encryptedAESKey is null or undefined, set it to null
        eniv: message.eniv || null
        
      };

      setMessages(prevMessages => [...prevMessages, mainMessages]);
      setMessagestest(prevMessages => [...prevMessages, mainMessages]);
      messagesRef.current = [...messagesRef.current, mainMessages];

    
      try {

        if (!dbRef.current || typeof dbRef.current.transaction !== 'function') {
          await initSQLiteDB();

        } 
        

         const idd = await storeMessageInSQLite(dbRef.current, mainMessages);
        console.log("Successfully stored message in SQLite",idd);
      } catch (err) {
        console.error("Failed to store message in SQLite", err);
      }
      

      //console.log("after ",messagesRef.current,mainMessages)
      try {
        // Get the main user data from localStorage
        const usermain = JSON.parse(localStorage.getItem('usermain')) || [];
      
        // Check if usermain exists, and if the recipient is valid
        if (usermain && message && message.recipient) {
          // Find the user whose ID matches the recipient
          const userIndex = usermain.findIndex(user => user.id === message.recipient);
          
          // If a user is found, update their last message with the new content and timestamp
          if (userIndex !== -1) {
            usermain[userIndex].lastMessage = {
              content: `You: ${message.content || "No content"}`, // Format the content
              timestamp: message.timestamp || new Date().toISOString() // Use current timestamp if not available
            };
      
            // Log the update for debugging
            //console.log('Updated user:', usermain[userIndex]);
      
            // Save the updated user data back to localStorage
            localStorage.setItem('usermain', JSON.stringify(usermain));
            Preferences.set({
              key: 'usermain',
              value: JSON.stringify(usermain),
            });
      
            // Optionally, you can update state or any relevant component as well
           
          }
        } else {
          console.error('User or message data is invalid');
        }
      } catch (error) {
        console.error('Error occurred while updating lastMessage:', error);
      }

      


    }else{
      //console.log("checking the message",message)
      const mainMessages = {
        id: message.messageId,  // Ensure the correct field is mapped
        sender: message.sender,
        recipient: message.recipient,
        content: message.content || null, // If content is null or undefined, set it to null
        timestamp: message.timestamp,
        status: message.status,
        read: message.read,
        type: message.type,
        fileData: message.fileData,
        fileType: message.fileType || null, // If fileType is null or undefined, set it to null
        file_size: message.file_size || null, // If file_size is null or undefined, set it to null
        file_path: message.file_path || null, // If file_path is null or undefined, set it to null
        file_name: message.file_name || null, // If file_name is null or undefined, set it to null
        isDeleted: message.isDeleted || 0, // Default to 0 if isDeleted is null or undefined
        isDownload: message.isDownload || 0, // Default to 0 if isDownload is null or undefined
        thumbnail: message.thumbnail || null, // If thumbnail is null or undefined, set it to null
        isSent: message.isSent === undefined ? 1 : message.isSent, // Set to 1 only if isSent is undefined
        isError: message.isError === undefined ? 0 : message.isError, // Set to 0 only if isError is undefined
        encryptedMessage: message.encryptedMessage || null, // If encryptedMessage is null or undefined, set it to null
        encryptedAESKey: message.encryptedAESKey || null, // If encryptedAESKey is null or undefined, set it to null
        eniv: message.eniv || null
        
      };
    
      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.push(mainMessages);

      localStorage.setItem('messages', JSON.stringify(messages));
    
      setMessages(prevMessages => [...prevMessages, mainMessages]);
      setMessagestest(prevMessages => [...prevMessages, mainMessages]);
      messagesRef.current = [...messagesRef.current, mainMessages];

    
      ///////////////////////////////////////////////
    
      try {

        // Get the main user data from localStorage
        const usermain = JSON.parse(localStorage.getItem('usermain')) || [];
      
        // Check if usermain exists, and if the recipient is valid
        if (usermain && message && message.recipient) {
          // Find the user whose ID matches the recipient
          //console.log("usermain in savemessaegs",usermain)
          const userIndex = usermain.findIndex(user => user.id === message.recipient);
          
          // If a user is found, update their last message with the new content and timestamp
          if (userIndex !== -1) {
            usermain[userIndex].lastMessage = {
              content: `You: ${message.content || "No content"}`, // Format the content
              timestamp: message.timestamp || new Date().toISOString() // Use current timestamp if not available
            };
      
            // Log the update for debugging
            //console.log('Updated user:', usermain[userIndex]);
      
            // Save the updated user data back to localStorage
            localStorage.setItem('usermain', JSON.stringify(usermain));
        Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(usermain),
                });
            // Optionally, you can update state or any relevant component as well
   
          }
        } else {
          console.error('User or message data is invalid');
        }
      } catch (error) {
        console.error('Error occurred while updating lastMessage:', error);
      }
      
      
    }
  }
    return {
      status: socket.current.readyState === WebSocket.OPEN ? 'sent' : 'failed',
      message
    };

    
  } catch (error) {
        console.error("error in saving messagessgsgs",error)
    return {
      status: 'failed',
      message: {
        ...message,
        isSent: 0,
        isError: 1
      }
    };
    

  }

}
const saveunread = async(sender)=>{

  try {
    return updateUnreadCountInSQLite(db,sender);
  } catch (error) {
    console.error("error in saving messagessgsgs",error)
  }

}

const getunread = async()=>{
  try {
    return getunreadcount(db)
  } catch (error) {
    console.error("error in getting unreadcount",error)
  }
}
const resetunread = async(sender)=>{

  try {
    return resetUnreadCountInSQLite(db,sender);
  } catch (error) {
    console.error("error in saving messagessgsgs",error)
  }

}

// const helloWorld = (word) => {
//   //console.log(word);
// }

const saveMessagesToLocalStorage = (newMessages) => {

  try {
    // Ensure newMessages is an array
    const messagesToSave = Array.isArray(newMessages) ? newMessages : [newMessages];

    // Get existing messages
    const existingMessages = JSON.parse(localStorage.getItem('messages')) || [];

    // Avoid duplicates based on message ID
    const uniqueMessages = messagesToSave.filter(newMsg =>
      !existingMessages.some(existing => existing.id === newMsg.messageId)
    );

    // Transform each new message to consistent structure
    const formattedMessages = uniqueMessages.map(message => ({
      id: message.messageId,
      sender: message.sender,
      recipient: message.recipient,
      content: message.content || null,
      timestamp: message.timestamp,
      status: message.status,
      read: message.read,
      type: message.type,
      fileData: message.fileData,
      fileType: message.fileType || null,
      file_size: message.file_size || null,
      file_path: message.file_path || null,
      file_name: message.file_name || null,
      isDeleted: message.isDeleted || 0,
      isDownload: message.isDownload || 0,
      thumbnail: message.thumbnail || null,
      isError: message.isError === undefined ? message.isError : 0, // Set to 0 only if isError is undefined
      isSent: message.isSent === undefined ? message.isSent : 1, // Set to 1 only if isSent is undefined
      encryptedMessage: message.encryptedMessage || null, // Set to null only if encryptedMessage is undefined
      encryptedAESKey: message.encryptedAESKey || null, // Set to null only if encryptedAESKey is undefined
    }));

    // Save to localStorage
    const updatedMessages = [...existingMessages, ...formattedMessages];
    
    localStorage.setItem('messages', JSON.stringify(updatedMessages));

    //console.log(`✅ Saved ${formattedMessages.length} message(s) to localStorage`);
  } catch (error) {
    console.error("❌ Error saving messages to localStorage:", error);
  }
};
const saveUsersToLocalStorage = (usersToSave) => {
  try {
    const existingUsers = JSON.parse(localStorage.getItem('usersMain')) || [];

    // Ensure usersToSave is an array
    const usersArray = Array.isArray(usersToSave) ? usersToSave : [usersToSave];

    // Remove duplicates based on user.id
    const uniqueUsers = usersArray.filter(newUser =>
      !existingUsers.some(existing => existing.id === newUser.id)
    );

    if (uniqueUsers.length > 0) {
      const updatedUsers = [...existingUsers, ...uniqueUsers];
      localStorage.setItem('usersMain', JSON.stringify(updatedUsers));
        Preferences.set({
                  key: 'usersMain',
                  value: JSON.stringify(updatedUsers),
                });
      //console.log(`✅ Saved ${uniqueUsers.length} new user(s) from [${source}]`);
    } else {
      //console.log(`ℹ️ No new users to save from [${source}]`);
    }
  } catch (error) {
    console.error('❌ Error saving users to localStorage:', error);
  }
};
const close = () => {
console.log("who the fucbk close the socket")
}

const isFloating = CallRuntime.overlayActive;
const WRAP_WIDTH  = isFloating ? 200 : "100vw";
const WRAP_HEIGHT = isFloating ? 280 : "100vh"; 


function restoreNormal() {
  if(restoringNow) return
   restoringNow = true; 
    CallRuntime.overlayActive = false;
    console.log("on return")
    window.NativeAds?.restoreFromOverlay();



    
    window.dispatchEvent(new CustomEvent("render-call-ui"));
}

if(isload){
  return(
   <div style={{ textAlign: 'center',display: 'flex', justifyContent: 'center', alignItems: 'center',position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',background: 'linear-gradient(135deg, #141E30, #243B55)',height: '100vh',width:'100%',overflowY: 'auto' }}>
      <StarLoader />
   
    </div>
  
  )
}else{

// 👇 Expose WebRTC methods globally so VideoCallScreen can trigger them
useEffect(() => {
  window.startCall = startCall;
  window.answerCall = answerCall;
  window.endCall = endCall;

}, []);

useEffect(() => {
  window.peerConnection = peerConnection;
}, [peerConnection]);

window.toggleMute = () => {
  if (window.localAudioTrack) {
    window.localAudioTrack.enabled = !window.localAudioTrack.enabled;
    console.log("Mic:", window.localAudioTrack.enabled ? "Unmuted" : "Muted");
  }
};

window.toggleCamera = () => {
  if (window.localVideoTrack) {
    window.localVideoTrack.enabled = !window.localVideoTrack.enabled;
    console.log("Camera:", window.localVideoTrack.enabled ? "On" : "Off");
  }
};
// ====== VIDEO CALL RUNTIME MOUNT (INLINE RENDERER) ======
const [callUI, setCallUI] = useState({
  visible: CallRuntime.showScreen,
  data: CallRuntime.data
});
const loadBlockedUsersFromStorage = () => {
  try {
    const raw = JSON.parse(localStorage.getItem('blockedUsers')) || [];
    setBlockedUsers(new Set(raw));
  } catch {
    setBlockedUsers(new Set());
  }
};

const persistBlockedUsers = (set) => {
  localStorage.setItem('blockedUsers', JSON.stringify([...set]));
};

const blockUser = async (targetId) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${host}/use/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Auth: token,
      },
      body: JSON.stringify({ targetUserId: targetId }),
    });

    const json = await res.json();
    if (!json.success) throw new Error('Block failed');

    setBlockedUsers(prev => {
      const next = new Set(prev);
      next.add(targetId);
      persistBlockedUsers(next);
      return next;
    });

  } catch (err) {
    console.error('Block user failed:', err);
    showToast?.('Failed to block user');
  }
};

const unblockUser = async (targetId) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${host}/use/unblock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Auth: token,
      },
      body: JSON.stringify({ targetUserId:targetId }),
    });

    const json = await res.json();
    if (!json.success) throw new Error('Unblock failed');

    setBlockedUsers(prev => {
      const next = new Set(prev);
      next.delete(targetId);
      persistBlockedUsers(next);
      return next;
    });

  } catch (err) {
    console.error('Unblock user failed:', err);
    showToast?.('Failed to unblock user');
  }
};

useEffect(() => {
  const update = () => {
    console.log("callruntime", JSON.stringify(CallRuntime))
    setCallUI({
      visible: CallRuntime.showScreen,
      data: { ...CallRuntime.data }
    });
  };

  window.addEventListener("render-call-ui", update);
  return () => window.removeEventListener("render-call-ui", update);
}, []);

const width = 240;   // same as params.width
const height = 340;  // same as params.height

let lastX = 0, lastY = 0;
let isDragging = false;

const smoothDrag = (x, y) => {
  requestAnimationFrame(() => {
    const box = window.__FLOAT_REF;
    box.style.left = x + "px";
    box.style.top = y + "px";
    box.style.right = "auto";
    box.style.bottom = "auto";
  });
};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const fetchAdminMessages = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${host}/message/messages`, {
    headers: { Auth: token }
  });

  const json = await res.json();
  return json.messages || [];
};
const sendAdminMessage = async (content) => {
  const token = localStorage.getItem("token");

  await fetch(`${host}/admin/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Auth: token,
    },
    body: JSON.stringify({ content }),
  });
};

  return (
    <LoginProvider>
      <MessageProvider>
             {showModal2 && (
              <UpdateModal
                version={serverVersion}
                url={downloadUrl}
                critical={criticalUpdate}
                onClose={() => setShowModal2(false)}
              />
            )}
      {/* 🔥 Runtime Call UI Overlay */}
{callUI.visible && (
  <div
    ref={el => (window.__FLOAT_REF = el)} // Used for drag

    style={{
      position: "fixed",
      zIndex: 9999999,

      // =============== VIEW STATE RULES ====================
         //300, 420,
      width: CallRuntime.overlayActive ? width : CallRuntime.isFloating ? "160px" : "100vw",
      height: CallRuntime.overlayActive ? height : CallRuntime.isFloating ? "240px" : "100vh",

      // fullscreen if overlay OR normal
      inset: !CallRuntime.isFloating || CallRuntime.overlayActive ? 0 : "auto",

      // popup default anchor
      right: CallRuntime.isFloating && !CallRuntime.overlayActive ? "12px" : "auto",
      bottom: CallRuntime.isFloating && !CallRuntime.overlayActive ? "12px" : "auto",

      borderRadius: CallRuntime.isFloating && !CallRuntime.overlayActive ? "16px" : "0",
      background: CallRuntime.overlayActive ? "#000" : CallRuntime.isFloating ? "black" : "transparent",

      overflow: "hidden",
      transition: "all .25s ease",
      cursor: CallRuntime.isFloating && !CallRuntime.overlayActive ? "grab" : "default"
    }}

    // ============ DRAG ONLY IF FLOATING & NOT OVERLAY ============
    onMouseDown={(e) => {
      if (!CallRuntime.isFloating || CallRuntime.overlayActive) return;

      const box = window.__FLOAT_REF;
      const rect = box.getBoundingClientRect();
      const edge = 20;
      const maxX = window.innerWidth - rect.width + edge;
      const maxY = window.innerHeight - rect.height + edge;

      let startX = e.clientX;
      let startY = e.clientY;
      let origX = rect.left;
      let origY = rect.top;

      const move = (ev) => {
        let X = origX + (ev.clientX - startX);
        let Y = origY + (ev.clientY - startY);

        X = Math.max(-edge, Math.min(maxX, X));
        Y = Math.max(-edge, Math.min(maxY, Y));

        requestAnimationFrame(() => {
          box.style.left = X + "px";
          box.style.top = Y + "px";
          box.style.right = "auto";
          box.style.bottom = "auto";
        });
      };

      const stop = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", stop);
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", stop);
    }}

    // Same logic for mobile touch drag
    onTouchStart={(e) => {
      if (!CallRuntime.isFloating || CallRuntime.overlayActive) return;

      const t = e.touches[0];
      const box = window.__FLOAT_REF;
      const rect = box.getBoundingClientRect();
      const edge = 20;
      const maxX = window.innerWidth - rect.width + edge; 
      const maxY = window.innerHeight - rect.height + edge;

      let startX = t.clientX;
      let startY = t.clientY;
      let origX = rect.left;
      let origY = rect.top;

      const move = (ev) => {
        const tt = ev.touches[0];
        let X = origX + (tt.clientX - startX);
        let Y = origY + (tt.clientY - startY);

        X = Math.max(-edge, Math.min(maxX, X));
        Y = Math.max(-edge, Math.min(maxY, Y));

        requestAnimationFrame(() => {
          box.style.left = X + "px";
          box.style.top = Y + "px";
          box.style.right = "auto";
          box.style.bottom = "auto";
        });
      };

      const stop = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", stop);
      };

      window.addEventListener("touchmove", move);
      window.addEventListener("touchend", stop);
    }}
  >
    
    {/* ================== Overlay Exit Button (Display ONLY when overlay) ================== */}
 

    <VideoCallScreen socket={socket.current} {...callUI.data} />
  </div>
)}



          <Switch>
            <Route 
              path="/home" 
              render={(props) => <HomeScreen {...props} link={link} storage={store}     messages={messages}
              setMessages={setMessages}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              usersMaintest={usersMaintest}
              setUsersMaintest={setUsersMaintest}
              setCurrenuser={setCurrenuser}
              getMessage={getmessages}
              usersMain={usersMain}
              db = {dbRef.current}
              mode={mode}
              setMode={setMode}
              setUsersMain={setUsersMain}
              socket={socket.current}
              sendMessage={sendMessage}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              close={close}
              reconnect={reconnect}
              isIntialized={isIntialized}
              setIsIntialized={setIsIntialized}
              connect={connect}
             messagesRef={messagesRef}
             
              saveMessage={saveMessage}
              getmessages={getmessages}
              saveunread={saveunread}
              getunread={getunread}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              resetunread={resetunread}
              selectedUser1={selectedUser}
              userDetails={currentUser}
              
              />} 
            />
            <Route 
              path="/login" 
              render={(props) => <LoginScreen {...props} storage={store} messages={messages}
              setMessages={setMessages}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              setCurrentUser={setCurrenuser}
              getMessage={getmessages}
              socket={socket.current}
              connect={connect} 
              sendMessage={sendMessage}
              close={close}
              reconnect={reconnect}
              sendPublicKeyToBackend={sendPublicKeyToBackend}
              saveMessage={saveMessage}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser}  />} 
            />
            <Route 
              path="/signup" 
              render={(props) => <SignupScreen {...props} storage={store} messages={messages}
              setMessages={setMessages}
            sendPublicKeyToBackend={sendPublicKeyToBackend}
              setCurrentUser={setCurrenuser}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              close={close}
              reconnect={reconnect}
   connect={connect} 
              saveMessage={saveMessage}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser} />} 
            />
            <Route 
              path="/newchat" 
              render={(props) => <NewChat {...props} storage={store} messages={messages}
              setMessages={setMessages}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              setCurrentUser={setCurrenuser}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              close={close}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              reconnect={reconnect}
             
              saveMessage={saveMessage}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser} />} 
            />
            <Route 
              path="/newchatwindow" 
              render={(props) => <NewChatWindow {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              setCurrentUser={setCurrenuser}
              getMessage={getmessages}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              socket={socket.current}
              sendMessage={sendMessage}
              usersMain={usersMain}
              setUsersMain={setUsersMain}
              close={close}
              reconnect={reconnect}
      
              messagesRef={messagesRef}
              saveMessage={saveMessage}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />
            <Route 
              path="/chatwindow" 
              render={(props) => <ChatWindow {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
                blockedUsers={blockedUsers}
              messagesRef={messagesRef}
              setCurrentUser={setCurrenuser}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              getMessage={getmessages}
              socket={socket.current}
          setBlockedUsers={setBlockedUsers}
           blockUser={blockUser}
  unblockUser={unblockUser}
              sendMessage={sendMessage}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              close={close}
              reconnect={reconnect}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              saveMessage={saveMessage}
              host={host}
              usersMain={usersMain}
              mode={mode}
              setMode={setMode}
              setUsersMain={setUsersMain}
              storeMessageInSQLite={storeMessageInSQLite}
              saveunread={saveunread}
              getunread={getunread}
              mutedlist={mutedlist}
              customSounds={customSounds}
              setCustomSounds = {setCustomSounds}
              setmutedList={setmutedList}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />
                <Route 
              path="/testchat" 
              render={(props) => <TestChatComponent {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
              messagesRef={messagesRef}
              setCurrentUser={setCurrenuser}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              close={close}
              reconnect={reconnect}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              saveMessage={saveMessage}
              usersMain={usersMain}
              setUsersMain={setUsersMain}
              saveunread={saveunread}
              getunread={getunread}
              host={host}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />
        <Route 
              path="/forwardScreen" 
              render={(props) => <ForwardScreen {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
              messagesRef={messagesRef}
              setCurrentUser={setCurrenuser}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              host={host}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              close={close}
              reconnect={reconnect}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              saveMessage={saveMessage}
              usersMain={usersMain}
              storeMessageInSQLite={storeMessageInSQLite}
              setUsersMain={setUsersMain}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />
                 <Route 
              path="/settings" 
              render={(props) => <SettingsPage {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
              messagesRef={messagesRef}
              setCurrentUser={setCurrenuser}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              mutedlist={mutedlist}
              setmutedList={setmutedList}
              host={host}
              mode={mode}
                setBlockedUsers={setBlockedUsers}
                blockedUsers={blockedUsers}
              setMode={setMode}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              close={close}
              reconnect={reconnect}
              setMessagestest={setMessagestest}
              messagestest={messagestest}
              saveMessage={saveMessage}
              setForAllSounds={setForAllSounds}
              ForAllSounfds={ForAllSounfds}
              usersMain={usersMain}
              storeMessageInSQLite={storeMessageInSQLite}
              setUsersMain={setUsersMain}
              saveunread={saveunread}
              setismute={setismute}
              isnotmute={isnotmute}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />
              <Route 
              path="/Archived" 
              render={(props) => <ArchivedChats {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
              messagesRef={messagesRef}
              setCurrentUser={setCurrenuser}
             
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              host={host}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
              
              reconnect={reconnect}
              setMessagestest={setMessagestest}
              selectedUser1={selectedUser}
              messagestest={messagestest}
              saveMessage={saveMessage}
              usersMain={usersMain}
              storeMessageInSQLite={storeMessageInSQLite}
              setUsersMain={setUsersMain}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />
            <Route 
              path="/Profile" 
              render={(props) => <ProfilePage {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
              messagesRef={messagesRef}
              setCurrentUser={setCurrenuser}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              host={host}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
          
              reconnect={reconnect}
              setMessagestest={setMessagestest}
              selectedUser1={selectedUser}
              messagestest={messagestest}
              saveMessage={saveMessage}
              usersMain={usersMain}
              storeMessageInSQLite={storeMessageInSQLite}
              setUsersMain={setUsersMain}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />

             <Route 
              path="/helpchatbox" 
              render={(props) => <HelpInfoChat {...props} storage={store}  db={dbRef.current} messages={messages}
              setMessages={setMessages}
              messagesRef={messagesRef}
              setCurrentUser={setCurrenuser}
              saveUsersToLocalStorage={saveUsersToLocalStorage}
              getMessage={getmessages}
              socket={socket.current}
              sendMessage={sendMessage}
              host={host}
              saveMessagesToLocalStorage={saveMessagesToLocalStorage}
       
              reconnect={reconnect}
              setMessagestest={setMessagestest}
              selectedUser1={selectedUser}
              messagestest={messagestest}
              saveMessage={saveMessage}
              usersMain={usersMain}
              storeMessageInSQLite={storeMessageInSQLite}
              setUsersMain={setUsersMain}
              saveunread={saveunread}
              getunread={getunread}
              resetunread={resetunread}
              selectedUser={selectedUser}/>} 
            />
            <Route
              path="/Blocklist" 
              render={(props) => <Blocklist {...props} storage={store}  
    blockedUsers={blockedUsers}
                   setBlockedUsers={setBlockedUsers}
           blockUser={blockUser}
  unblockUser={unblockUser}
              usersMain={usersMain}
              storeMessageInSQLite={storeMessageInSQLite}
           />} 
            />
              <Route
              path="/AdminChat" 
              render={(props) => <AdminChat {...props} storage={store}  
    blockedUsers={blockedUsers}
                   setBlockedUsers={setBlockedUsers}
           blockUser={blockUser}
  unblockUser={unblockUser}
              usersMain={usersMain}
              sendAdminMessage={sendAdminMessage}
              fetchAdminMessages={fetchAdminMessages}
              storeMessageInSQLite={storeMessageInSQLite}
           />} 
            />
            
          {/* <Route
  path="/videocall"
  render={(props) => (
    <VideoCallScreen
     socket={socket.current}
    />
  )}
/> */}

 

            <Redirect from="/" to={initialRoute} />
          </Switch>


      </MessageProvider>
    </LoginProvider>
  );
}
}

