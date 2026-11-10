# 3h1t3 – Zenless Zone Zero piloting site

## Run locally
Open `index.html`, or run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Edit the site
- Services (including individual exploration areas and starting prices in USD), About me, steps, terms and FAQ: `js/data.js`
- X handle and optional Discord invite: `js/config.js`
- Colors and layout: the variables and rules at the top of `css/styles.css`
- Character artwork: `assets/img/`

## Payments
- All quotes and prices are in USD.
- The request form does not ask the customer to choose a payment method.
- Discuss payment methods privately only after the customer has reviewed and accepted the written quote.
- Default payment schedule: 30% advance to reserve the work slot and 70% after the agreed work is completed.
- The advance is part of the total price, not an additional or automatically non-refundable fee.
- Explain any transaction or currency-conversion fees before payment.
- Never request payment-account passwords, verification codes or card details.
- The website does not collect payment credentials or card details.

## Important before publishing
- Confirm the X handle in `js/config.js`.
- Add a Discord invite only if you want to publish one.
- Review every price and service scope before accepting orders.
- Review HoYoverse's current official Terms of Service. The account-access disclosure on this site does not make third-party account access permitted and cannot override the game's rules.
- The site does not collect game credentials, verification codes or payment details.

## Free static hosting
The site has no build step or database. It can be deployed as a static site through GitHub Pages, Cloudflare Pages or another static host.

## Zones & characters
- Each service category is a "zone" in `js/data.js` > `zones` (title, blurb, character image, color theme). Services join a zone through their `zone` field.
- Zone color themes live at the bottom of `css/styles.css` (`.night`, `.candy`, `.berry`, ...). To add one, create a class there and use its name as `theme`.
- `price: null` on a service shows "Custom quote" (used for Endgame Assistance).
- Exploration prices per area: `zones` > exploration > `areas`.
- Character images: `assets/img/`. How it works, About me and FAQ use their own character and theme in `index.html`.
- Stickers: each zone's `sticker` field in `js/data.js` (files `assets/img/st-*.webp`). In `index.html`, How it works, About me, Terms and FAQ have their own sticker next to the heading.
- Zone decoration: add `deco: [["✦", left%, top%, sizeRem, rotateDeg, "hl|accent|line"], ...]` to any zone in `js/data.js`. Services can show a pill with `tag`.
- Other sections (Services intro, How it works, About me, Terms, FAQ, Contact) get decoration from `decos` in `js/data.js`, keyed by section id.

## Request form (requests arrive in your spare email)
The site cannot send email by itself, and anything you write in the code is public. So the email address is NOT stored in the code: you register it in a form service, which forwards each request to you.

Option A, Web3Forms (free plan, no card):
1. On web3forms.com enter your spare email and request an access key; it arrives by email.
2. In `js/config.js` set `formEndpoint: "https://api.web3forms.com/submit"` and `formAccessKey: "<your key>"`. The key is public by design; it cannot read your inbox.
3. Redeploy and send yourself a test request.

Option B, Formspree: create a form with your spare email, then paste the form URL into `formEndpoint` and leave `formAccessKey` empty.

Check each service's current free limits and privacy terms. Do not put your personal email in `email`: it is public and shows an extra button.
Without `formEndpoint` the form only prepares a message that the visitor copies and sends you on X or Discord. It never asks for game credentials, verification codes or payment details.

## Community links
- X/Twitter: https://x.com/3h1t3
- Discord community invite: https://discord.gg/HMhTWhNFR
- Service cards use the request form and preselect the chosen service.
- Future Discord bot features (welcome messages, scheduled service showcases, promotion drafts and owner approval) are intentionally not included in this website release.
