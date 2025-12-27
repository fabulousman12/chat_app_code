import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WebSocketProvider } from "./services/websokcetmain";
import {MessageProvider} from "./Contexts/MessagesContext";
import './tailwind.css' // Import your Tailwind CSS file
import { BrowserRouter as Router, Route, Switch, Redirect,useLocation  } from 'react-router-dom';
import './services/notificationBootstrap';
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const container = document.getElementById("root");
    const root = createRoot(container);

    root.render(
      <React.StrictMode>
         <Router> 
        <MessageProvider> {/* Wrap the App with the MessageProvider */}
        <WebSocketProvider> {/* Wrap the App with the WebSocketProvider */}
          <App />
        </WebSocketProvider>
        </MessageProvider>
         </Router> 
      </React.StrictMode>
    );
  } catch (e) {
    console.error("Error during initialization:", e);
  }
});
