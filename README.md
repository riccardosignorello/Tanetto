# Tanetto

Site served by GitHub Pages at https://tanetto.app (CNAME).

- `/` home page (English, sends visitors to their language with `site/lang.js`), `/it`, `/de`, ... language pages,
  `press-kit`, `sitemap.xml`, `robots.txt`: built by `python3 _site_src/build.py`.
- `/app/` the web app: built in the app repository with `python3 tools/build.py --out <dir>` and copied here
  (without privacy.html, elimina-account.html, licenses.html, which stay at the root). Never edit `app/index.html`
  by hand: its inline script has a CSP hash.
- `privacy.html`, `elimina-account.html`, `licenses.html`, `fb.js`: from the same app build, at the root.
- `sw.js` at the root only removes the old service worker of the app that used to live at `/`.
- `get/` sends Android to Google Play (utm/src passed to the referrer) and iPhone to `/app/`; `play/*`, `m/` short links.
- `app-ads.txt` must stay at the root, unchanged.
