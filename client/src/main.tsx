import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function setupAnalytics() {
  const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
  const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();

  if (!analyticsEndpoint || !analyticsWebsiteId) {
    return;
  }

  const scriptId = "umami-analytics-script";
  if (document.getElementById(scriptId)) {
    return;
  }

  const script = document.createElement("script");
  script.id = scriptId;
  script.defer = true;
  script.src = `${analyticsEndpoint.replace(/\/$/, "")}/umami`;
  script.setAttribute("data-website-id", analyticsWebsiteId);
  document.body.appendChild(script);
}

setupAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
