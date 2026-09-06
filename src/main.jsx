import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
createRoot(document.getElementById("root")).render(<App />);
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  const isDevHost = /^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(window.location.hostname);
  if (isDevHost) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
  } else {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("ServiceWorker registration successful with scope: ", reg.scope);
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  }
}
