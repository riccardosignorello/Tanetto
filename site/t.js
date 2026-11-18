/* Tanetto site: closes the language menu, and counts visits and Google Play clicks with GoatCounter
   (anonymous: no cookies, nothing stored on the device; only on the real site, not on copies or tests).
   Links shared from the app (?src=amico, ?src=postcard, utm_...) keep their source: the Google Play buttons pass it
   to the Play referrer and "Try it in your browser" passes it to the web app (/app/?src=...). */
(function () {
  var d = document, me = d.currentScript, page = (me && me.getAttribute("data-p")) || "site";
  var on = /^(www\.)?tanetto\.app$|(^|\.)tanettoapp\.github\.io$/.test(location.hostname);
  function count(path, ev) {
    if (!on) return;
    var u = "https://tanettoapp.goatcounter.com/count?p=" + encodeURIComponent(path) + (ev ? "&e=true" : "") +
      "&r=" + encodeURIComponent(ev ? "" : d.referrer) + "&rnd=" + Math.random().toString(36).slice(2);
    try { if (!(navigator.sendBeacon && navigator.sendBeacon(u))) new Image().src = u; } catch (e) { /* nothing */ }
  }
  var q, src = "";
  try { q = new URLSearchParams(location.search); } catch (e) { q = null; }
  function clean(v) { return String(v || "").toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, 40); }
  if (q) src = clean(q.get("src") || q.get("utm_source"));
  if (src) {
    var med = clean(q.get("utm_medium")) || "link", camp = clean(q.get("utm_campaign"));
    var as = d.querySelectorAll("a.badge"), ws = d.querySelectorAll('a[data-ev^="web-"]');
    for (var i = 0; i < as.length; i++) {
      var h = as[i].getAttribute("href"), m = /utm_campaign%3D([a-z0-9_.-]+)/i.exec(h);
      as[i].setAttribute("href", h.replace(/&referrer=.*$/, "") + "&referrer=" +
        encodeURIComponent("utm_source=" + src + "&utm_medium=" + med + "&utm_campaign=" + (camp || (m ? m[1] : "site"))));
    }
    for (var j = 0; j < ws.length; j++) ws[j].setAttribute("href", "app/?src=" + encodeURIComponent(src));
  }
  count("/site/" + page, false);
  if (src) count("site-src-" + src + "-" + page, true);
  d.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a[data-ev]");
    if (a) count("site-" + a.getAttribute("data-ev") + "-" + page, true);
    var m = d.querySelector("details.langs[open]");
    if (m && !m.contains(ev.target)) m.removeAttribute("open");
  });
  d.addEventListener("keydown", function (ev) {
    var m = d.querySelector("details.langs[open]");
    if (ev.key === "Escape" && m) { m.removeAttribute("open"); m.querySelector("summary").focus(); }
  });
})();
