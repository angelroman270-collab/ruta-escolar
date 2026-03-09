/* ═══════════════════════════════════════════════════
   RutaEscolar Service Worker v3
   Soporta:
   - Notificaciones nativas (Notification API)
   - Mensajes desde la app (postMessage)
   - Click en notificación → abrir/enfocar app
   ═══════════════════════════════════════════════════ */

var CACHE_NAME = "ruta-v3";

self.addEventListener("install", function(e) {
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(clients.claim());
});

/* ── Recibir mensajes desde la app principal ── */
self.addEventListener("message", function(e) {
  if (!e.data) return;

  /* La app le pide al SW que muestre una notificación
     Esto funciona incluso cuando la app está en segundo plano */
  if (e.data.type === "SHOW_NOTIF") {
    var opts = {
      body: e.data.body || "Nuevo aviso",
      icon: "/icon-192.jpg",
      badge: "/icon-192.jpg",
      tag: "ruta-" + Date.now(),
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 500],
      data: { url: e.data.url || "/" }
    };
    self.registration.showNotification(
      e.data.title || "RutaEscolar",
      opts
    );
  }
});

/* ── Push desde servidor (para futuro uso con VAPID) ── */
self.addEventListener("push", function(e) {
  var data = { title: "RutaEscolar", body: "Nuevo aviso", url: "/" };
  try { if (e.data) data = e.data.json(); } catch(err) {}

  e.waitUntil(
    self.registration.showNotification(data.title || "RutaEscolar", {
      body: data.body || "Tienes un aviso",
      icon: "/icon-192.jpg",
      badge: "/icon-192.jpg",
      tag: "ruta-push-" + Date.now(),
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 500],
      data: { url: data.url || "/" }
    })
  );
});

/* ── Click en notificación → abrir/enfocar app ── */
self.addEventListener("notificationclick", function(e) {
  e.notification.close();
  var target = (e.notification.data && e.notification.data.url)
    ? e.notification.data.url
    : "/";

  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(cl) {
      /* Buscar una pestaña ya abierta con la URL correcta */
      for (var i = 0; i < cl.length; i++) {
        var c = cl[i];
        if (c.url.indexOf(target.split("?")[0]) >= 0 && "focus" in c) {
          return c.focus();
        }
      }
      /* Si no hay pestaña abierta, abrir nueva */
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
