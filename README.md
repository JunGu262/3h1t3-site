# 3h1t3 Pilots — Final English-Only Website

Independent piloting service website for **Zenless Zone Zero** and **Genshin Impact** (two separate service divisions). English is the only language of the site.

## Project layout
- `3h1t3-site/` — the complete static website (the only folder to publish).
- `tests/` — automated tests (internal, do not publish).
- `docs/` — deployment and operations notes (internal, do not publish).

## Install and run
The site is plain static HTML/CSS/JavaScript. There is nothing to install or build and there are no runtime dependencies.

```bash
cd 3h1t3-site
python3 -m http.server 8080      # or any static file server
# open http://localhost:8080/            (Zenless Zone Zero)
# open http://localhost:8080/?game=genshin   (Genshin Impact)
```

## Configuration
Public settings live in `3h1t3-site/js/config.js` (X handle, form endpoint, Web3Forms access key, per-division order switches `zzzOrdersOpen` / `genshinOrdersOpen`). The e-mail address that receives requests is set in the Web3Forms dashboard, not in the code.

## Tests
```bash
node tests/run-tests.js          # Node.js 18+, no network, no browser needed
python3 tests/smoke_browser.py   # optional: needs Python Playwright + Chromium
python3 tests/browser_part2.py   # optional: same requirements; form API is mocked
```
The browser tests never contact Web3Forms, so they do **not** prove real e-mail delivery.

## Deployment
Publish only the contents of `3h1t3-site/` to a static host. Follow `docs/DEPLOY-GUIDE.md` and complete `docs/WEB3FORMS-CHECKLIST.md` before opening orders.

## Documentation
- `docs/INTERNAL-DOCUMENTATION.md`
- `docs/DEPLOY-GUIDE.md`
- `docs/WEB3FORMS-CHECKLIST.md`
- `3h1t3-FINAL-AUDIT.md` (project root of the delivery)

## Dark theme
All backgrounds are dark. The dark palette is the block at the END of `3h1t3-site/css/styles.css` (comment "DARK MODE"): section colors are the generated `--bg/--ink/--accent/--soft/--line/--hl` variables per theme; card, form and button overrides follow. Original light values are kept earlier in the file.
