/* Tanetto 404: /it/ (with the slash) and the old /<language>.html go to the language page; /app goes to /app/. */
(function () {
  var p = location.pathname.toLowerCase(), tail = location.search + location.hash;
  var m = /^\/(en|it|de|es|fr|pt|ja|ko|zh-hans|zh-hant|ru|pl|nl|tr)(\/|\/index\.html)$/.exec(p);
  if (m) { location.replace("/" + m[1] + tail); return; }
  if (/^\/(app|tanetto)(\/.*)?$/.test(p) && !/^\/app\//.test(p)) location.replace("/app/" + tail);
})();
