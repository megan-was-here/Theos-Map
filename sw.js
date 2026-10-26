/* Theo's Sydney: background helper.
   1. Always loads the newest version of the map's own files (GitHub lets phones keep old copies for 10 minutes).
   2. Shows the "new magic" buzz that Supabase sends, and opens the map when she taps it. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

// Ask GitHub "has this changed?" every time (cheap: unchanged files come back as "not modified").
// Only the map's own files; maps, fonts and Supabase are left alone. Falls back to the normal copy if offline.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  e.respondWith(
    fetch(new Request(req.url, { cache: "no-cache", credentials: "same-origin" })).catch(() => fetch(req))
  );
});

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  const title = d.title || "New magic has appeared!";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || "The Coven has added something new to your map.",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    tag: d.tag || "theo-new-magic",
    data: { url: d.url || "./index.html" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./index.html", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(self.registration.scope)) { c.focus(); return c.navigate ? c.navigate(url) : null; } }
    return self.clients.openWindow(url);
  }));
});
