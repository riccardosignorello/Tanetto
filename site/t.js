/* Tanetto site: closes the language menu, and counts visits and Google Play clicks with GoatCounter
   (anonymous: no cookies, nothing stored on the device; only on the real site, not on copies or tests). */
(function () {
  var d = document, me = d.currentScript, page = (me && me.getAttribute("data-p")) || "site";
  var on = /(^|\.)tanettoapp\.github\.io$/.test(location.hostname);
  function count(path, ev) {
    if (!on) return;
    var u = "https://tanettoapp.goatcounter.com/count?p=" + encodeURIComponent(path) + (ev ? "&e=true" : "") +
      "&r=" + encodeURIComponent(ev ? "" : d.referrer) + "&rnd=" + Math.random().toString(36).slice(2);
    try { if (!(navigator.sendBeacon && navigator.sendBeacon(u))) new Image().src = u; } catch (e) { /* nothing */ }
  }
  count("/site/" + page, false);
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
