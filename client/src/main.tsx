import { ClerkProvider } from "@clerk/clerk-react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppSessionProvider } from "./contexts/AppSessionContext";
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

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is required");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={publishableKey}>
    <AppSessionProvider>
      <App />
    </AppSessionProvider>
  </ClerkProvider>,
);
