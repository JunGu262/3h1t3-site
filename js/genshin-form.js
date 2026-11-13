(() => {
  const S = window.SITE, G = window.DATA_GENSHIN, $ = q => document.querySelector(q);
  const form = $('#g-request-form');
  if (!G || !form) return;
  const L = G.legal;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const open = S.genshinOrdersOpen !== false;          // owner switch in js/config.js
  const live = Boolean(S.formEndpoint);
  const status = $('#g-form-status'), result = $('#g-request-result'), text = $('#g-request-text'), actions = $('#g-request-actions'), submit = $('#g-form-submit'), closed = $('#g-closed');
  const val = n => form.elements[n].value.trim();

  // Service list: only categories with a defined scope get their own option; the rest are quote-only.
  const defined = G.cats.filter(c => c.req.length), soon = G.cats.filter(c => !c.req.length);
  $('#g-req-service').innerHTML = '<option value="">Choose a service…</option>'
    + `<optgroup label="Services with a defined scope">${defined.flatMap(c => c.req).map(n => `<option>${esc(n)}</option>`).join('')}</optgroup>`
    + `<optgroup label="Quote only">${soon.map(c => `<option>${esc(c.name)} (quote only)</option>`).join('')}<option>Custom request / quote</option></optgroup>`;
  $('#g-consent-text').textContent = L.consentText;
  $('#g-risk-summary').textContent = L.summary;

  const fillPromos = () => {
    const sel = $('#g-req-promo'), cur = sel.value, opts = window.PromoUI ? window.PromoUI.options('genshin') : [];
    sel.innerHTML = '<option value="">No promotion</option>' + opts.map(o => `<option value="${esc(o.id)}">${esc(o.label)}</option>`).join('');
    if (cur && opts.some(o => o.id === cur)) sel.value = cur;
  };
  fillPromos(); document.addEventListener('promosready', fillPromos);
  const promoName = () => { const v = $('#g-req-promo').value; return v ? ((window.PromoUI.options('genshin').find(p => p.id === v)) || {}).name || '' : ''; };

  if (!open) { closed.hidden = false; submit.disabled = true; submit.textContent = 'Requests not open yet'; }
  else submit.textContent = live ? 'Send request ♡' : 'Prepare my request ♡';
  $('#g-form-hint').textContent = !open ? '' : live
    ? "Your request is sent to me directly and I'll reply with a written quote. Never include passwords or verification codes."
    : "This form prepares a request message for you to copy and send using your selected contact method. Nothing is sent automatically. Never include passwords or verification codes.";

  // Link buttons in the catalog preselect the service without leaving the page.
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-g-service], a[data-promo][href="#g-request"]'); if (!a) return;
    const sel = $('#g-req-service');
    e.preventDefault();
    if (a.hasAttribute('data-g-service')) {
      const want = a.getAttribute('data-g-service');
      const opt = Array.from(sel.options).find(o => o.value === want) || Array.from(sel.options).find(o => o.value === 'Custom request / quote');
      if (opt) sel.value = opt.value;
    } else {
      const id = a.getAttribute('data-promo'), p = $('#g-req-promo');
      if (Array.from(p.options).some(o => o.value === id)) p.value = id;
    }
    $('#g-request').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => sel.focus({ preventScroll: true }), 350);
    try { history.replaceState(null, '', location.search + '#g-request'); } catch {}
  });

  // Contact method: X (Twitter) or Discord username (private, one-to-one communication; no server invitation).
  const contactOk = v => val('contact') === 'Discord'
    ? (/^@?[A-Za-z0-9_.]{2,32}$/.test(v) ? '' : 'Enter your Discord username (2 to 32 characters: letters, numbers, underscores and periods).')
    : (/^@?[A-Za-z0-9_]{1,15}$/.test(v) ? '' : 'Enter your X username (letters, numbers and underscores, up to 15 characters).');
  // Validation (browser side). The server side cannot be enforced with a mail-forwarding backend .
  const FIELDS = [
    ['service', v => v ? '' : 'Please choose a service.'],
    ['scope', v => v ? '' : 'Please say which scope or variant you need (for example regions, acts, level A/B or Daily/Weekly).'],
    ['uid', v => /^[0-9]{9,10}$/.test(v) ? '' : 'Enter your UID: 9 or 10 digits, numbers only.'],
    ['server', v => v ? '' : 'Please choose your server region.'],
    ['ar', v => /^[0-9]{1,2}$/.test(v) && Number(v) >= 1 && Number(v) <= 60 ? '' : 'Enter your Adventure Rank as a number (1 to 60).'],
    ['username', v => contactOk(v)]
  ];
  const syncContact = () => { const d = val('contact') === 'Discord'; $('#g-req-user-label').textContent = d ? 'Your Discord username' : 'Your X (Twitter) username'; form.elements.username.placeholder = d ? 'username' : '@username'; };
  form.elements.contact.addEventListener('change', () => { syncContact(); if (form.elements.username.getAttribute('aria-invalid') === 'true') setErr('username', contactOk(val('username'))); });
  const setErr = (name, msg) => {
    const el = form.elements[name], box = $(`#g-err-${name}`);
    box.textContent = msg; box.hidden = !msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.fld') && el.closest('.fld').classList.toggle('bad', Boolean(msg));
  };
  const validate = () => {
    let first = null;
    FIELDS.forEach(([n, f]) => { const m = f(val(n)); setErr(n, m); if (m && !first) first = form.elements[n]; });
    const ok = form.elements.consent.checked;
    const cm = $('#g-err-consent');
    cm.textContent = ok ? '' : 'Please tick the box to confirm you have read and understood the account access risks. The request cannot be sent without it.';
    cm.hidden = ok; form.elements.consent.setAttribute('aria-invalid', String(!ok));
    if (!ok && !first) first = form.elements.consent;
    return first;
  };
  FIELDS.forEach(([n]) => form.elements[n].addEventListener('input', () => { const f = FIELDS.find(x => x[0] === n); setErr(n, f[1](val(n)) && form.elements[n].getAttribute('aria-invalid') === 'true' ? f[1](val(n)) : ''); }));
  form.elements.consent.addEventListener('change', () => { $('#g-err-consent').hidden = form.elements.consent.checked; form.elements.consent.setAttribute('aria-invalid', String(!form.elements.consent.checked)); });

  const orderId = () => { const r = new Uint32Array(2); crypto.getRandomValues(r); return `GI-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(r[0].toString(36) + r[1].toString(36)).toUpperCase().slice(0, 8)}`; };
  const record = () => ({ order_id: orderId(), accepted_at_utc: new Date().toISOString(), terms_accepted: 'yes', consent_text: L.consentText, terms_version: L.termsVersion, notice_version: L.noticeVersion, division: L.division });
  const build = r => ['Hi 3h1t3! I\'d like to request a service.', '', `Game: Genshin Impact`, `Service: ${val('service')}`, `Scope / variant: ${val('scope')}`, val('details') ? `Additional information: ${val('details')}` : '', promoName() ? `Promotion: ${promoName()}` : '', `UID: ${val('uid')}`, `Server: ${val('server')}`, `Adventure Rank: ${val('ar')}`, `Contact: ${val('contact')} - ${val('username')}`, '', `Acceptance record: ${r.order_id} · ${r.accepted_at_utc} · ${r.terms_version} / ${r.notice_version} · accepted: yes`, `Checkbox text: ${r.consent_text}`, "I'm not sharing passwords, verification codes or payment details."].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
  const showResult = msg => {
    text.value = msg; result.hidden = false;
    actions.innerHTML = `<button type="button" class="btn" id="g-copy-btn">Copy message</button><a class="btn ghost" href="https://x.com/${encodeURIComponent(S.twitterHandle)}" target="_blank" rel="noopener noreferrer">Open X</a>`;
    $('#g-copy-btn').addEventListener('click', async () => { try { await navigator.clipboard.writeText(msg); status.textContent = 'Copied. Paste it in a private message using your selected contact method.'; } catch { text.select(); status.textContent = 'Could not copy automatically. Select the text and copy it.'; } });
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.elements.website.value) return;           // spam trap
    if (!open) { status.textContent = 'Genshin Impact requests are not open yet. Nothing was sent.'; return; }
    const bad = validate();
    if (bad) { status.textContent = 'Please fix the highlighted fields before sending.'; bad.focus(); return; }
    const r = record(), msg = build(r);
    if (!live) { showResult(msg); status.textContent = 'Your request is ready. Nothing has been sent yet: copy it and send it using your selected contact method.'; return; }
    submit.disabled = true; status.textContent = 'Sending…';
    try {
      const resp = await fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...(S.formAccessKey ? { access_key: S.formAccessKey } : {}), subject: `New Genshin request: ${val('service')}`, from_name: '3h1t3 Genshin request form', game: 'Genshin Impact', service: val('service'), scope: val('scope'), details: val('details'), promotion: promoName(), uid: val('uid'), server: val('server'), contact_method: val('contact'), ar: val('ar'), username: val('username'), ...r, message: msg }) });
      let data = {}; try { data = await resp.json(); } catch {}
      if (!resp.ok || !(data.success === true || data.ok === true)) throw new Error('send failed'); // success only when the service explicitly confirms it
      status.textContent = `Request sent. Your request ID is ${r.order_id}. I'll reply with a written quote.`; form.reset(); syncContact(); result.hidden = true; fillPromos();
    } catch {
      status.textContent = 'Could not send automatically. Nothing was delivered. Please copy the message below and send it using your selected contact method.'; showResult(msg);
    } finally { submit.disabled = false; }
  });
})();
