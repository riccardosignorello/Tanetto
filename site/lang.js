/* Tanetto home page (https://tanetto.app/): it is the English page. Visitors whose browser prefers one of the other 13
   languages go to their page (/it, /de, ...), keeping ?src= and the other parameters. English stays here (and so do
   search engines). The old web app installed on the home screen (start_url "/") now opens the app in /app/. */
(function () {
  try {
    var tail = location.search + location.hash;
    if ((window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true) { location.replace("app/" + tail); return; }
    var have = { en: 1, it: 1, de: 1, es: 1, fr: 1, pt: 1, ja: 1, ko: 1, ru: 1, pl: 1, nl: 1, tr: 1 };
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i] || "").toLowerCase(), b = l.split("-")[0], slug = "";
      if (b === "zh") slug = /hant|-tw|-hk|-mo/.test(l) ? "zh-hant" : "zh-hans";
      else if (have[b]) slug = b;
      if (!slug) continue;
      if (slug !== "en") location.replace(slug + tail);
      return;
    }
  } catch (e) { /* stay on the English page */ }
})();
