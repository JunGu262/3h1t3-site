(() => {
  const G = window.DATA_GENSHIN, U = window.UI, S = window.SITE, $ = q => document.querySelector(q);
  if (!G || !U) return;
  const { money, esc, list, decoHTML } = U;
  const L = G.legal;
  const byId = Object.fromEntries(G.cats.map(c => [c.id, c]));

  // A dollar amount is shown ONLY for approved prices; everything else is neutral.
  const priceLabel = (p, unit) => {
    if (p && p.status === 'approved' && typeof p.amount === 'number') return `${money(p.amount)}${unit ? ' ' + esc(unit) : ''}`;
    return p && p.display === 'custom' ? 'Custom quote' : 'Coming soon';
  };
  const usd = n => (typeof n === 'number' ? money(n) : null);
  const hasPrice = c => (c.prices ? Object.values(c.prices).flat().some(v => typeof v === 'number') : (c.offers || []).some(f => f.price && f.price.status === 'approved' && typeof f.price.amount === 'number'));
  const gbtn = (label, service, aria) => `<a class="btn" href="#g-request" data-g-service="${esc(service)}" aria-label="${esc(aria || label)}">${esc(label)}</a>`;
  const badge = c => c.state === 'soon' ? '<span class="chip soon">Coming soon</span>' : (hasPrice(c) ? '' : '<span class="chip">Price coming soon</span>');
  const excl = a => a && a.length ? `<p class="mini">Not included</p>${list(a)}` : '';
  const incl = a => a && a.length ? `<p class="mini">Includes</p>${list(a)}` : '';
  const note = n => n ? `<p class="card-note">${esc(n)}</p>` : '';
  const quoteBtn = c => gbtn(c.req.length ? 'Ask about this' : 'Ask for a quote', c.req[0] || 'Custom request / quote', `${c.req.length ? 'Ask about' : 'Ask for a quote'}: ${c.name}`);

  const offerRows = c => `<table class="areas offers"><caption class="sr">${esc(c.name)} options</caption><tbody>${c.offers.map(f => `<tr><th scope="row">${esc(f.name)}${f.tag ? ` <small>· ${esc(f.tag)}</small>` : ''}</th><td>${priceLabel(f.price, f.unit)}</td></tr>`).join('')}</tbody></table>`;
  const offerDetails = c => c.offers.some(f => f.inc || f.exc || f.note) ? `<div class="offer-det">${c.offers.filter(f => f.inc || f.exc || f.note).map(f => `<details><summary>${esc(f.name)}: details</summary>${incl(f.inc)}${excl(f.exc)}${note(f.note)}</details>`).join('')}</div>` : '';

  const exploration = c => `<article class="card wide cat" id="gc-${c.id}"><div class="cat-head"><h3>${esc(c.name)}</h3>${badge(c)}</div><p>${esc(c.desc)}</p>
    <div class="modes">${c.modes.map(m => `<div class="mode"><h4>${esc(m.name)}</h4>${incl(m.inc)}${excl(m.exc)}</div>`).join('')}</div>
    <table class="areas regions"><caption class="sr">Exploration regions</caption><thead><tr><th scope="col">Region</th><th scope="col">Without Quests</th><th scope="col">With Quests</th></tr></thead><tbody>
    ${c.regions.map(r => { const p = c.prices[r] || []; return `<tr><th scope="row">${esc(r)}</th><td>${usd(p[0]) || 'Coming soon'}</td><td>${usd(p[1]) || 'Coming soon'}</td></tr>`; }).join('')}
    ${c.pendingRegions.map(r => `<tr><th scope="row">${esc(r)}</th><td colspan="2">Custom quote</td></tr>`).join('')}</tbody></table>
    <p class="card-note">Prices are per region, in USD. Oculus are sold separately. Your written quote confirms the exact scope.</p>${gbtn('Ask about exploration', c.req[0], 'Ask about exploration')}</article>`;

  const oculus = c => `<article class="card wide cat" id="gc-${c.id}"><div class="cat-head"><h3>${esc(c.name)}</h3>${badge(c)}</div><p>${esc(c.desc)}</p>
    <table class="areas"><caption class="sr">Oculus types</caption><tbody>${c.types.map(t => `<tr><th scope="row">${esc(t)}</th><td>${usd(c.prices[t]) || 'Coming soon'}</td></tr>`).join('')}</tbody></table>
    ${incl(c.inc)}${excl(c.exc)}${note(c.note)}${gbtn('Ask about Oculus', c.req[0], 'Ask about Oculus')}</article>`;

  const maintenance = c => `<article class="card wide cat" id="gc-${c.id}"><div class="cat-head"><h3>${esc(c.name)}</h3>${badge(c)}</div><p>${esc(c.desc)}</p>
    <div class="modes four">${c.offers.map(f => `<div class="mode"><h4>${esc(f.name)}</h4><span class="dur">${esc(f.tag)}</span><p class="price quote">${priceLabel(f.price)}</p>${list(f.inc)}${note(f.note)}</div>`).join('')}</div>
    ${excl(c.exc)}${gbtn('Ask about maintenance', c.req[0], 'Ask about maintenance')}</article>`;

  const generic = c => `<article class="card cat${c.state === 'soon' ? ' compact' : ''}" id="gc-${c.id}"><div class="cat-head"><h3>${esc(c.name)}</h3>${badge(c)}</div><p>${esc(c.desc)}</p>
    ${c.offers ? offerRows(c) + offerDetails(c) : ''}${excl(c.exc)}${note(c.note)}${quoteBtn(c)}</article>`;

  // Bundles: the "separate" price is always computed from the catalog (same keys as promotions), never typed.
  const separate = f => { const R = window.PROMOS && window.PROMOS.resolver; if (!R) return null; let t = 0; for (const [k, q] of f.comps) { const v = R('genshin', k); if (typeof v !== 'number') return null; t += v * q; } return t; };
  const bundles = c => `<article class="card wide cat" id="gc-${c.id}"><div class="cat-head"><h3>${esc(c.name)}</h3>${badge(c)}</div><p>${esc(c.desc)}</p>
    <div class="modes">${c.offers.map((f, i) => { const w = separate(f), amt = f.price.amount, save = w !== null && w > amt ? w - amt : 0; return `<div class="mode"><h4>${esc(f.name)}</h4><span class="dur">${esc(f.tag)}</span><p class="price quote">${priceLabel(f.price)}</p>${save ? `<p class="mini">Separately ${money(w)} · you save ${money(save)}</p>` : ''}<p class="mini">Includes</p>${list(f.comps.map(x => x[2]))}${gbtn('Ask about this bundle', c.req[i], 'Ask about: ' + f.name)}</div>`; }).join('')}</div>${note(c.note)}</article>`;

  const cardFor = c => c.kind === 'exploration' ? exploration(c) : c.kind === 'oculus' ? oculus(c) : c.kind === 'maintenance' ? maintenance(c) : c.kind === 'bundles' ? bundles(c) : generic(c);

  $('#g-zone-chips').innerHTML = G.zones.map(z => `<a href="#gz-${esc(z.id)}">${esc(z.title)}</a>`).join('');
  $('#g-zones').innerHTML = G.zones.map((z, i) => `<section id="gz-${esc(z.id)}" class="sec zone split ${esc(z.theme)}${i % 2 ? ' rev' : ''}">${decoHTML(z.deco)}<figure class="side"><img src="assets/img/${esc(z.img)}" alt="" loading="lazy" decoding="async"></figure><div><div class="zone-head"><h2>${esc(z.title)}</h2><img class="sticker${i % 2 ? ' l' : ''}" src="assets/img/${esc(z.sticker)}" alt="" aria-hidden="true" loading="lazy" decoding="async"></div><p class="note">${esc(z.blurb)}</p><div class="grid">${z.ids.map(id => cardFor(byId[id])).join('')}</div><p class="zone-cta">Not sure what fits? <a href="#g-request">Send me your goal ♡</a></p></div></section>`).join('');

  // About me (Genshin division, own content)
  $('#g-about-intro').textContent = G.about.intro;
  $('#g-about-cards').innerHTML = G.about.cards.map(c => `<article class="card"><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></article>`).join('');
  $('#g-about-facts').innerHTML = G.about.facts.map(f => `<li>${esc(f)}</li>`).join('');

  // Promotions are rendered by js/promos.js (shared engine).

  // Legal blocks
  $('#g-risk').innerHTML = `<h3>Account Access &amp; Risks</h3>${L.disclaimer.map(p => `<p>${esc(p)}</p>`).join('')}<p class="card-note">Terms version ${esc(L.termsVersion)} · Notice version ${esc(L.noticeVersion)}</p>`;
  $('#g-notice-text').textContent = L.summary;
  $('#g-terms-grid').innerHTML = G.terms.map(t => `<article class="card"><h3>${esc(t[0])}</h3><p>${esc(t[1])}</p></article>`).join('');
  $('#g-faq-list').innerHTML = G.faq.map(f => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('');
  $('#g-steps').innerHTML = G.steps.map(s => `<li>${esc(s)}</li>`).join('');
  $('#g-contact-links').innerHTML = `<a class="btn" href="https://x.com/${encodeURIComponent(S.twitterHandle)}" target="_blank" rel="noopener noreferrer" aria-label="Visit 3h1t3 on X">X / @${esc(S.twitterHandle)}</a>`;
  $('#year-g').textContent = new Date().getFullYear();
  const D = window.DATA;
  [['g-services', 'services'], ['gpromos', 'services'], ['g-about', 'about'], ['g-how', 'how'], ['g-terms', 'terms'], ['g-faq', 'faq']].forEach(([id, key]) => { const el = $('#' + id); if (el && D.decos && D.decos[key]) el.insertAdjacentHTML('afterbegin', decoHTML(D.decos[key])); });

  // Game switcher
  const TITLES = { zzz: '3h1t3 Pilots · Zenless Zone Zero piloting service & prices', genshin: '3h1t3 Pilots · Genshin Impact piloting service' };
  const header = $('header.top'), logo = $('.logo'), fab = $('.fab');
  const GAMES = window.GAMES = { current: 'zzz', set: g => apply(g, true) };
  const setHdr = () => document.documentElement.style.setProperty('--hdr', header.offsetHeight + 'px');
  function apply(g, user) {
    if (g !== 'zzz' && g !== 'genshin') g = 'zzz';
    GAMES.current = g;
    document.body.dataset.game = g;
    document.querySelectorAll('.gamebar button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.game === g)));
    document.title = TITLES[g];
    logo.setAttribute('href', g === 'genshin' ? '#g-home' : '#home');
    fab.setAttribute('href', g === 'genshin' ? '#g-request' : '#request');
    try { history.replaceState(null, '', (g === 'genshin' ? '?game=genshin' : location.pathname) + location.hash); } catch {}
    document.dispatchEvent(new CustomEvent('gamechange', { detail: { game: g } }));
    if (user) { try { history.replaceState(null, '', (g === 'genshin' ? '?game=genshin' : location.pathname)); } catch {} window.scrollTo({ top: 0, behavior: 'smooth' }); }
    setHdr();
  }
  document.querySelector('.gamebar').addEventListener('click', e => { const b = e.target.closest('button[data-game]'); if (b && b.dataset.game !== GAMES.current) apply(b.dataset.game, true); });
  window.addEventListener('resize', setHdr);
  apply(new URLSearchParams(location.search).get('game') === 'genshin' ? 'genshin' : 'zzz', false);
  // Deep links such as ?game=genshin#g-account-risks: jump (no smooth animation) after render, and again once images have loaded and layout settled.
  if (location.hash.length > 1) {
    const jump = () => { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) { const root = document.documentElement, prev = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; t.scrollIntoView(); root.style.scrollBehavior = prev; } };
    requestAnimationFrame(jump);
    window.addEventListener('load', () => setTimeout(jump, 50), { once: true });
  }
})();
