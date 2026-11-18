/* Tanetto: the web app moved from https://tanetto.app/ to https://tanetto.app/app/ (it has its own service worker there).
   This file replaces the old service worker of the home page. When a browser that still has the old one opens the site,
   it gets this version, which:
   1) deletes the old offline copy of the app saved for "/" (only those caches: the one of /app/ is left alone);
   2) reloads the open pages, asking the server for a fresh copy (not the old one kept by the browser), so the home page
      shows the website again and nothing stays stuck on the old app;
   3) removes itself after answering the first page load. Saved progress is not touched: it lives in the site's browser storage, which /app/ reads as before. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.mode !== "navigate" || r.method !== "GET") return;
  const res = fetch(r.url, { cache: "no-cache", credentials: "same-origin", redirect: "manual" }).catch(() => fetch(r));
  e.respondWith(res);
  e.waitUntil(res.catch(() => null).then(() => self.registration.unregister()).catch(() => null));
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const home = new URL("./", self.registration.scope).href;
    try {
      for (const k of await caches.keys()) {
        const c = await caches.open(k);
        if ((await c.match(home + "index.html")) || (await c.match(home))) await caches.delete(k);
      }
    } catch (x) { /* nothing */ }
    try { await self.clients.claim(); } catch (x) { /* nothing */ }
    /* not awaited: the reload is answered by the fetch handler above (fresh copy), which then removes this worker */
    try { (await self.clients.matchAll({ type: "window" })).forEach((w) => { w.navigate(w.url).catch(() => null); }); } catch (x) { /* nothing */ }
  })());
});
