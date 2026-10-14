import "./fonts";
import "./index.css";
import { startTransition } from "react";
import ReactDOM from "react-dom/client";
import { dehydrate, hydrate, type DehydratedState } from "@tanstack/react-query";
import { App } from "./App";
import { startHydration } from "./utils/hydration";
import { readLocalePref, switchLocaleUrl, urlLocale } from "./utils/localeRoute";
import { queryClient } from "./utils/queryClient";

declare global {
  interface Window {
    /** Query cache captured with a prerendered page (scripts/prerender.mjs). */
    __CAREFLOW_RQ__?: DehydratedState;
    /** Used by the prerenderer to capture the cache it rendered with. */
    __careflowDehydrate?: () => DehydratedState;
    /** Used by the prerenderer: true when no query is loading. */
    __careflowIdle?: () => boolean;
  }
}

window.__careflowDehydrate = () => dehydrate(queryClient);
window.__careflowIdle = () => queryClient.isFetching() === 0;

// A visitor who chose Arabic before is sent to the Arabic URL of the same page (crawlers have no preference).
const pref = readLocalePref();
if (pref && pref !== urlLocale(window.location.pathname)) {
  window.location.replace(switchLocaleUrl(pref));
} else {
  const rootEl = document.getElementById("root");
  if (rootEl?.dataset.prerendered === "1") {
    // The HTML already shows this page: reuse it instead of re-rendering from scratch (no flash, faster LCP).
    if (window.__CAREFLOW_RQ__) hydrate(queryClient, window.__CAREFLOW_RQ__);
    startHydration();
    // Let the browser paint the prerendered HTML first, then hydrate as a transition: React works in small slices and
    // yields to the browser in between, instead of one long task that blocks the first paint and input.
    requestAnimationFrame(() =>
      setTimeout(() => startTransition(() => void ReactDOM.hydrateRoot(rootEl, <App />)), 0)
    );
  } else if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<App />);
  }
}
