import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
createRoot(document.getElementById("root")).render(<App />);
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
        console.log("ServiceWorker registration successful with scope: ", reg.scope);
    })
        .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
    });
}
