/* Renders the promotions sections of BOTH divisions from js/promos-data.js using js/promo-engine.js.
   Every price on screen is computed from the real catalog (never typed here). Expired promotions are not shown. */
(() => {
  const E = window.PromoEngine, P = window.PROMOS, U = window.UI;
  if (!E || !P || !U) return;
  const { esc, list } = U;
  const off = P.config.utcOffset;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = s => { const [y, m, d] = s.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
  const fmtShort = s => { const [, m, d] = s.split('-').map(Number); return `${MONTHS[m - 1]} ${d}`; };
  const range = p => `${fmtDate(p.start)} – ${fmtDate(p.end)}`;
  const TYPE_LABEL = { welcome: 'Welcome / First Order', seasonal: 'Seasonal', bundle: 'Bundle / Multi-Service', maintenance: 'Maintenance', loyalty: 'Returning Customer' };
  const CAMP_GLYPH = { 'christmas-2026': '❄', 'end-of-year-2026': '✦', 'new-year-2027': '✧' };
  const REQUEST_HREF = { zzz: '#request', genshin: '#g-request' };
  const now = () => new Date();

  const statusChip = p => {
    const st = E.status(p, now(), off);
    if (st === 'active') return `<span class="chip status active">Active now · ends ${esc(fmtShort(p.end))}</span>`;
    if (st === 'upcoming') return `<span class="chip status upcoming">Starts ${esc(fmtShort(p.start))}</span>`;
    return '';
  };

  const priceTable = (p, r) => {
    const pct = p.discount.type === 'percent' ? `${p.discount.value}% off` : `${E.fmt(E.toCents(p.discount.value))} off`;
    if (r.mode === 'set') {
      return `<table class="promo-table" aria-label="Prices for ${esc(p.name)}"><thead><tr><th scope="col">Service</th><th scope="col">Regular price</th></tr></thead><tbody>
        ${r.rows.map(x => `<tr><th scope="row">${esc(x.label)}</th><td>${E.fmt(x.normal)}</td></tr>`).join('')}
        <tr class="sum"><th scope="row">Regular total</th><td>${E.fmt(r.totals.normal)}</td></tr>
        <tr class="final"><th scope="row">Together with promotion (${esc(pct)} the set)</th><td><strong>${E.fmt(r.totals.final)}</strong></td></tr></tbody></table>
        <p class="promo-save">You save ${E.fmt(r.totals.discount)} when both are requested together.</p>`;
    }
    return `<table class="promo-table" aria-label="Prices for ${esc(p.name)}"><thead><tr><th scope="col">Service</th><th scope="col">Regular</th><th scope="col">With promotion (${esc(pct)})</th></tr></thead><tbody>
      ${r.rows.map(x => `<tr><th scope="row">${esc(x.label)}</th><td><s>${E.fmt(x.normal)}</s></td><td><strong>${E.fmt(x.final)}</strong></td></tr>`).join('')}</tbody></table>`;
  };

  const card = p => {
    const r = E.compute(p, P.resolver);
    const key = p.campaign ? p.campaign.replace(/^(zzz|genshin)-/, '') : '';
    const glyph = key ? `<span class="promo-glyph" aria-hidden="true">${CAMP_GLYPH[key] || ''}</span>` : '';
    return `<article class="card promo promo-${esc(p.type)}${key ? ' camp camp-' + esc(key) : ''}" id="promo-${esc(p.id)}">
      ${glyph}<div class="promo-top"><span class="chip">${esc(TYPE_LABEL[p.type])}</span>${statusChip(p)}</div>
      <h3>${esc(p.name)}</h3><p>${esc(p.description)}</p>
      <p class="promo-dates"><strong>Valid:</strong> ${esc(range(p))} <small>(${esc(P.config.timezoneLabel)})</small></p>
      ${priceTable(p, r)}
      <p class="mini">Who can use it</p><p>${esc(p.eligibility)}</p>
      <p class="mini">Conditions</p>${list(p.conditions)}
      <p class="mini">Limitations</p>${list(p.limitations)}
      <a class="btn" href="${REQUEST_HREF[p.game]}" data-promo="${esc(p.id)}" aria-label="Request with promotion: ${esc(p.name)}">Request with this promotion</a>
    </article>`;
  };

  const visible = game => P.promos.filter(p => p.game === game && p.status === 'approved' && ['active', 'upcoming'].includes(E.status(p, now(), off)));

  const render = (game, el) => {
    if (!el) return;
    const all = visible(game);
    const camps = all.filter(p => p.campaign), ongoing = all.filter(p => !p.campaign);
    if (!all.length) { el.innerHTML = '<p class="note">There are no active promotions right now. Any future promotion will be listed here with its dates and conditions.</p>'; return; }
    el.innerHTML = (camps.length ? `<h3 class="promo-h">Holiday campaigns</h3><p class="note">Limited to the dates shown on each card. Each holiday campaign is its own promotion.</p><div class="grid promo-grid">${camps.map(card).join('')}</div>` : '')
      + (ongoing.length ? `<h3 class="promo-h">Ongoing promotions</h3><p class="note">Available for the dates shown. Only one promotion applies per request.</p><div class="grid promo-grid">${ongoing.map(card).join('')}</div>` : '');
  };

  render('zzz', document.querySelector('#z-promos'));
  render('genshin', document.querySelector('#g-promos'));

  // Shared helper for the request forms: promotions that can still be selected, in the form's own game.
  window.PromoUI = {
    options: game => visible(game).map(p => ({ id: p.id, name: p.name, label: `${p.name} (${fmtShort(p.start)} – ${fmtShort(p.end)})` }))
  };
  document.dispatchEvent(new CustomEvent('promosready'));
})();
