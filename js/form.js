/* Zenless Zone Zero request form (independent from the Genshin form in js/genshin-form.js). */
(() => {
  const S = window.SITE, D = window.DATA, $ = q => document.querySelector(q);
  const form = $('#request-form');
  if (!form) return;
  const L = D.legal;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const x = `https://x.com/${encodeURIComponent(S.twitterHandle)}`;
  const open = S.zzzOrdersOpen !== false;            // owner switch in js/config.js
  const live = Boolean(S.formEndpoint);
  const status = $('#form-status'), result = $('#request-result'), text = $('#request-text'), actions = $('#request-actions'), submit = $('#form-submit'), closed = $('#z-closed');
  const val = name => form.elements[name].value.trim();

  const names = z => { const n = D.services.filter(s => s.zone === z.id).map(s => s.name); if (z.areas) n.unshift('Exploration (list the areas in your goal)'); return n; };
  $('#req-service').innerHTML = '<option value="">Choose a service…</option>' + D.zones.map(z => `<optgroup label="${esc(z.title)}">${names(z).map(n => `<option>${esc(n)}</option>`).join('')}</optgroup>`).join('') + '<optgroup label="Other"><option>Custom request</option></optgroup>';
  $('#z-consent-text').textContent = L.consentText;
  $('#z-risk-summary').textContent = L.summary;

  const fillPromos = () => {
    const sel = $('#req-promo'), cur = sel.value;
    const opts = window.PromoUI ? window.PromoUI.options('zzz') : [];
    sel.innerHTML = '<option value="">No promotion</option>' + opts.map(o => `<option value="${esc(o.id)}">${esc(o.label)}</option>`).join('');
    if (cur && opts.some(o => o.id === cur)) sel.value = cur;
  };
  fillPromos();
  document.addEventListener('promosready', fillPromos);
  const promoName = () => { const o = $('#req-promo').selectedOptions[0]; return o && o.value ? (window.PromoUI.options('zzz').find(p => p.id === o.value) || {}).name || '' : ''; };

  if (!open) { closed.hidden = false; submit.disabled = true; submit.textContent = 'Requests not open yet'; }
  else submit.textContent = live ? 'Send request ♡' : 'Prepare my request ♡';
  $('#form-hint').textContent = !open ? '' : live
    ? "Your request is sent to me directly and I'll reply with a written quote."
    : "This form prepares a request message for you to copy and send using your selected contact method. Nothing is sent automatically.";

  // Service-card and promotion buttons preselect the form and guide the visitor to it.
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-service], a[data-promo][href="#request"]');
    if (!link) return;
    const sel = $('#req-service');
    if (link.hasAttribute('data-service')) {
      const opt = Array.from(sel.options).find(o => o.value === link.getAttribute('data-service'));
      if (!opt) return;
      sel.value = opt.value;
    } else {
      const id = link.getAttribute('data-promo'), p = $('#req-promo');
      if (Array.from(p.options).some(o => o.value === id)) p.value = id;
    }
    e.preventDefault();
    $('#request').scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => (link.hasAttribute('data-service') ? sel : $('#req-promo')).focus({ preventScroll: true }), 350);
    try { history.replaceState(null, '', location.search + '#request'); } catch {}
  });

  // Contact method: X (Twitter) or Discord username (private, one-to-one communication; no server invitation).
  const contactOk = v => val('contact') === 'Discord'
    ? (/^@?[A-Za-z0-9_.]{2,32}$/.test(v) ? '' : 'Enter your Discord username (2 to 32 characters: letters, numbers, underscores and periods).')
    : (/^@?[A-Za-z0-9_]{1,15}$/.test(v) ? '' : 'Enter your X username (letters, numbers and underscores, up to 15 characters).');
  // Validation (browser side; a mail-forwarding backend cannot enforce these rules server-side).
  const FIELDS = [
    ['service', v => v ? '' : 'Please choose a service.'],
    ['details', v => v ? '' : 'Please describe your goal so I can prepare an accurate quote.'],
    ['uid', v => /^[0-9]{8,10}$/.test(v) ? '' : 'Enter your UID: 8 to 10 digits, numbers only.'],
    ['server', v => v ? '' : 'Please choose your server region.'],
    ['level', v => /^[0-9]{1,2}$/.test(v) && Number(v) >= 1 ? '' : 'Enter your Inter-Knot level as a number (1 to 99).'],
    ['username', v => contactOk(v)]
  ];
  const syncContact = () => { const d = val('contact') === 'Discord'; $('#req-user-label').textContent = d ? 'Your Discord username' : 'Your X (Twitter) username'; form.elements.username.placeholder = d ? 'username' : '@username'; };
  form.elements.contact.addEventListener('change', () => { syncContact(); if (form.elements.username.getAttribute('aria-invalid') === 'true') setErr('username', contactOk(val('username'))); });
  const setErr = (name, msg) => {
    const el = form.elements[name], box = $(`#err-${name}`);
    box.textContent = msg; box.hidden = !msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.fld') && el.closest('.fld').classList.toggle('bad', Boolean(msg));
  };
  const validate = () => {
    let first = null;
    FIELDS.forEach(([n, f]) => { const m = f(val(n)); setErr(n, m); if (m && !first) first = form.elements[n]; });
    const ok = form.elements.consent.checked, cm = $('#err-consent');
    cm.textContent = ok ? '' : 'Please tick the box to confirm you have read and understood the account access risks. The request cannot be sent without it.';
    cm.hidden = ok; form.elements.consent.setAttribute('aria-invalid', String(!ok));
    if (!ok && !first) first = form.elements.consent;
    return first;
  };
  FIELDS.forEach(([n, f]) => form.elements[n].addEventListener('input', () => { if (form.elements[n].getAttribute('aria-invalid') === 'true') setErr(n, f(val(n))); }));
  form.elements.consent.addEventListener('change', () => { $('#err-consent').hidden = form.elements.consent.checked; form.elements.consent.setAttribute('aria-invalid', String(!form.elements.consent.checked)); });

  const orderId = () => { const r = new Uint32Array(2); crypto.getRandomValues(r); return `ZZZ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${(r[0].toString(36) + r[1].toString(36)).toUpperCase().slice(0, 8)}`; };
  const record = () => ({ order_id: orderId(), accepted_at_utc: new Date().toISOString(), terms_accepted: 'yes', consent_text: L.consentText, terms_version: L.termsVersion, notice_version: L.noticeVersion, division: L.division });
  const build = r => {
    const lines = [`Hi ${S.brand}! I'd like to request a service.`, '', 'Game: Zenless Zone Zero', `Service: ${val('service')}`, `Goal: ${val('details')}`];
    if (val('characters')) lines.push(`Characters / progress: ${val('characters')}`);
    if (val('timeframe')) lines.push(`Deadline / timeframe: ${val('timeframe')}`);
    if (promoName()) lines.push(`Promotion: ${promoName()}`);
    lines.push(`UID: ${val('uid')}`, `Account level: ${val('level')}`, `Server: ${val('server')}`, `Contact: ${val('contact')} - ${val('username')}`);
    if (val('nickname')) lines.push(`Nickname: ${val('nickname')}`);
    lines.push('', `Acceptance record: ${r.order_id} · ${r.accepted_at_utc} · ${r.terms_version} / ${r.notice_version} · accepted: yes`, `Checkbox text: ${r.consent_text}`, "I'm not sharing passwords, verification codes or payment details.");
    return lines.join('\n');
  };
  const showResult = msg => {
    text.value = msg; result.hidden = false;
    const mail = S.email ? `<a class="btn ghost" href="mailto:${esc(S.email)}?subject=${encodeURIComponent('Service request')}&body=${encodeURIComponent(msg)}">Send by email</a>` : '';
    actions.innerHTML = `<button type="button" class="btn" id="copy-btn">Copy message</button><a class="btn ghost" href="${x}" target="_blank" rel="noopener noreferrer">Open X</a>${mail}`;
    $('#copy-btn').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(msg); status.textContent = 'Copied. Paste it in a private message using your selected contact method.'; }
      catch { text.select(); status.textContent = 'Could not copy automatically. Select the text and copy it.'; }
    });
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.elements.website.value) return;           // spam trap
    if (!open) { status.textContent = 'Zenless Zone Zero requests are not open right now. Nothing was sent.'; return; }
    const bad = validate();
    if (bad) { status.textContent = 'Please fix the highlighted fields before sending.'; bad.focus(); return; }
    const r = record(), msg = build(r);
    if (!live) { showResult(msg); status.textContent = 'Your request is ready. Nothing has been sent yet: copy it and send it using your selected contact method.'; return; }
    submit.disabled = true; status.textContent = 'Sending…';
    try {
      const resp = await fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...(S.formAccessKey ? { access_key: S.formAccessKey } : {}), subject: `New ZZZ request: ${val('service')}`, from_name: `${S.brand} ZZZ request form`, game: 'Zenless Zone Zero', service: val('service'), details: val('details'), characters: val('characters'), timeframe: val('timeframe'), promotion: promoName(), uid: val('uid'), level: val('level'), server: val('server'), contact_method: val('contact'), username: val('username'), nickname: val('nickname'), ...r, message: msg }) });
      let data = {}; try { data = await resp.json(); } catch {}
      if (!resp.ok || !(data.success === true || data.ok === true)) throw new Error('send failed'); // success only when the service explicitly confirms it
      status.textContent = `Request sent. Your request ID is ${r.order_id}. I'll reply with a written quote.`; form.reset(); syncContact(); result.hidden = true; fillPromos();
    } catch {
      status.textContent = 'Could not send automatically. Nothing was delivered. Please copy the message below and send it using your selected contact method.'; showResult(msg);
    } finally { submit.disabled = false; }
  });
})();
