/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "precache-manifest.0e09cd05f16d0487e9e7f376f38b85a4.js"
);

workbox.core.setCacheNameDetails({prefix: "less"});

workbox.core.skipWaiting();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/^(https:\/\/cors-anywhere\.herokuapp\.com\/)?https:\/\/kobo\.humanitarianresponse\.info/, new workbox.strategies.NetworkFirst({ "cacheName":"api-cache","networkTimeoutSeconds":20, plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/https:\/\/api\.mapbox\.com/, new workbox.strategies.CacheFirst({ "cacheName":"mapbox-cache", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxEntries: 120, purgeOnQuotaError: false })] }), 'GET');
