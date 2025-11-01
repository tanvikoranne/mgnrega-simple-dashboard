import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.update();
  }).catch((error) => {
    console.log('Service Worker registration failed:', error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
