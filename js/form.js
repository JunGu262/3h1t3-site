(()=>{
  const S = window.SITE, D = window.DATA, $ = q => document.querySelector(q);
  const form = $('#request-form');
  if (!form) return;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const x = `https://x.com/${encodeURIComponent(S.twitterHandle)}`;
  const live = Boolean(S.formEndpoint);
  const status = $('#form-status'), result = $('#request-result'), text = $('#request-text'), actions = $('#request-actions'), submit = $('#form-submit');

  const groups = D.zones.map(z => {
    const names = D.services.filter(s => s.zone === z.id).map(s => s.name);
    if (z.areas) names.unshift('Exploration (list the areas in your goal)');
    return `<optgroup label="${esc(z.title)}">${names.map(n => `<option>${esc(n)}</option>`).join('')}</optgroup>`;
  }).join('');
  $('#req-service').innerHTML = '<option value="">Choose a service…</option>' + groups + '<optgroup label="Other"><option>Custom request</option></optgroup>';

  // Service-card buttons preselect the matching form option and guide the visitor to the form.
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-service]');
    if (!link) return;
    const requestedService = link.getAttribute('data-service');
    const serviceSelect = $('#req-service');
    const matchingOption = Array.from(serviceSelect.options).find(option => option.value === requestedService);
    if (!matchingOption) return;
    e.preventDefault();
    serviceSelect.value = matchingOption.value;
    const requestSection = $('#request');
    if (requestSection) requestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => serviceSelect.focus({ preventScroll: true }), 350);
    if (window.location.hash !== '#request') history.replaceState(null, '', '#request');
  });
  submit.textContent = live ? 'Send request ♡' : 'Prepare my request ♡';
  $('#form-hint').textContent = live
    ? "Your request is sent to me directly and I'll reply with a written quote. Never include passwords or verification codes."
    : "This form prepares a message for you to copy and send me on X, Discord or email. Nothing is sent automatically. Never include passwords or verification codes.";

  const val = name => form.elements[name].value.trim();
  const build = () => {
    const lines = [`Hi ${S.brand}! I'd like to request a service.`, '', `Service: ${val('service')}`, `Goal: ${val('details')}`];
    if (val('characters')) lines.push(`Characters / progress: ${val('characters')}`);
    if (val('timeframe')) lines.push(`Deadline / timeframe: ${val('timeframe')}`);
    lines.push(`Account level: ${val('level')}`, `Server: ${val('server')}`, `Contact: ${val('contact_method')} - ${val('username')}`);
    if (val('nickname')) lines.push(`Nickname: ${val('nickname')}`);
    lines.push('', "I've read the terms and checked the game's current rules. I'm not sharing passwords, verification codes or payment details.");
    return lines.join('\n');
  };
  const copy = async t => {
    try { await navigator.clipboard.writeText(t); return true; }
    catch { text.select(); try { return document.execCommand('copy'); } catch { return false; } }
  };
  const showResult = msg => {
    text.value = msg; result.hidden = false;
    const mail = S.email ? `<a class="btn ghost" href="mailto:${esc(S.email)}?subject=${encodeURIComponent('Service request')}&body=${encodeURIComponent(msg)}">Send by email</a>` : '';
    const discord = S.discord ? `<a class="btn ghost" href="${esc(S.discord)}" target="_blank" rel="noopener noreferrer">Open Discord</a>` : '';
    actions.innerHTML = `<button type="button" class="btn" id="copy-btn">Copy message</button><a class="btn ghost" href="${x}" target="_blank" rel="noopener noreferrer">Open X</a>${discord}${mail}`;
    $('#copy-btn').addEventListener('click', async () => {
      status.textContent = (await copy(msg)) ? 'Copied! Paste it in a message to me ♡' : 'Could not copy automatically. Select the text and copy it.';
    });
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.elements.website.value) return; // spam trap
    const msg = build();
    if (!live) { showResult(msg); status.textContent = 'Your request is ready. Copy it and send it to me ♡'; return; }
    submit.disabled = true; status.textContent = 'Sending…';
    try {
      const r = await fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...(S.formAccessKey ? { access_key: S.formAccessKey } : {}), subject: `New request: ${val('service')}`, from_name: `${S.brand} request form`, service: val('service'), details: val('details'), characters: val('characters'), timeframe: val('timeframe'), level: val('level'), server: val('server'), contact_method: val('contact_method'), username: val('username'), nickname: val('nickname'), message: msg }) });
      let data = {}; try { data = await r.json(); } catch {}
      if (!r.ok || data.success === false || data.ok === false) throw new Error('send failed');
      status.textContent = "Request sent! I'll reply with a written quote ♡"; form.reset(); result.hidden = true;
    } catch {
      status.textContent = 'Could not send automatically. Please copy the message below and send it on X, Discord or email.'; showResult(msg);
    } finally { submit.disabled = false; }
  });
})();
