/* ═══════════════════════════════════════════════════
   RutaEscolar Service Worker v4
   ✅ Android: notificaciones nativas completas
   ✅ iOS 16.4+ PWA instalada: Web Push funciona
   ✅ postMessage desde app → showNotification
   ✅ Click en notificación → abre la URL correcta
   ✅ portal.html y index.html comparten este SW
   ═══════════════════════════════════════════════════ */

var CACHE = "ruta-sw-v4";

self.addEventListener("install", function(e) {
  /* Activar inmediatamente sin esperar reload */
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function(e) {
  /* Tomar control de todas las pestañas abiertas */
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return clients.claim(); })
  );
});

/* ════════════════════════════════════════════════
   📲 MENSAJE DESDE LA APP → mostrar notificación
   Funciona cuando la app está en segundo plano
   ════════════════════════════════════════════════ */
self.addEventListener("message", function(e) {
  if (!e.data) return;

  if (e.data.type === "SHOW_NOTIF") {
    var url = e.data.url || "/";
    var opts = {
      body:    e.data.body || "Nuevo aviso",
      icon:    "/icon-192.jpg",
      badge:   "/icon-192.jpg",
      tag:     "ruta-" + Date.now(),
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 500],
      data:    { url: url }
    };
    e.waitUntil(
      self.registration.showNotification(
        e.data.title || "RutaEscolar", opts
      )
    );
  }

  /* PING: confirmar que SW está activo */
  if (e.data.type === "PING" && e.source) {
    e.source.postMessage({ type: "PONG" });
  }
});

/* ════════════════════════════════════════════════
   🌐 PUSH desde servidor (VAPID — futuro)
   ════════════════════════════════════════════════ */
self.addEventListener("push", function(e) {
  var data = { title: "RutaEscolar", body: "Tienes un aviso", url: "/" };
  try { if (e.data) data = Object.assign(data, e.data.json()); } catch(err) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    "/icon-192.jpg",
      badge:   "/icon-192.jpg",
      tag:     "ruta-push-" + Date.now(),
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 500],
      data:    { url: data.url }
    })
  );
});

/* ════════════════════════════════════════════════
   👆 CLICK EN NOTIFICACIÓN → abrir/enfocar app
   ════════════════════════════════════════════════ */
self.addEventListener("notificationclick", function(e) {
  e.notification.close();
  var target = (e.notification.data && e.notification.data.url)
    ? e.notification.data.url
    : "/";

  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(function(allClients) {
        /* Buscar pestaña ya abierta */
        for (var i = 0; i < allClients.length; i++) {
          var c = allClients[i];
          if ("focus" in c) {
            /* Navegar a la URL correcta si es distinta */
            if ("navigate" in c) c.navigate(target);
            return c.focus();
          }
        }
        /* Abrir nueva ventana si no hay ninguna abierta */
        if (clients.openWindow) return clients.openWindow(target);
      })
  );
});
