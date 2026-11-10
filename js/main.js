(()=>{
  const S = window.SITE, D = window.DATA;
  const $ = selector => document.querySelector(selector);
  const x = `https://x.com/${encodeURIComponent(S.twitterHandle)}`;
  const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n));
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = items => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const btn = (label, aria) => `<a class="btn" href="${x}" target="_blank" rel="noopener noreferrer" aria-label="${esc(aria)}">${esc(label)}</a>`;

  const decoHTML = arr => arr && arr.length ? `<div class="deco" aria-hidden="true">${arr.map(d => `<span style="left:${d[1]}%;top:${d[2]}%;font-size:${d[3]}rem;--r:${d[4]}deg;color:var(--${d[5] || 'hl'})">${esc(d[0])}</span>`).join('')}</div>` : '';
  const card = s => {
    const quote = s.price == null;
    return `<article class="card">${s.tag ? `<span class="dur">${esc(s.tag)}</span>` : ''}<h3>${esc(s.name)}</h3>${quote ? '<p class="price quote">Custom quote</p>' : `<p class="price"><small>from</small> ${money(s.price)}${s.unit ? `<small>${esc(s.unit)}</small>` : ''}</p>`}<p>${esc(s.desc)}</p>${list(s.inc)}${s.note ? `<p class="card-note">${esc(s.note)}</p>` : ''}${btn(quote ? 'Ask for a quote' : 'Request this service', `${quote ? 'Ask for a quote' : 'Request'}: ${s.name}`)}</article>`;
  };
  const areasCard = z => `<article class="card wide"><h3>Exploration by area</h3><p>${esc(z.desc)}</p><table class="areas"><caption class="sr">Exploration starting prices by area</caption><tbody>${z.areas.map(a => `<tr><th scope="row">${esc(a[0])}</th><td>from ${money(a[1])}</td></tr>`).join('')}</tbody></table>${list(z.inc)}<p class="card-note">${esc(z.note)}</p>${btn('Request exploration', 'Request exploration')}</article>`;

  $('#zone-chips').innerHTML = D.zones.map(z => `<a href="#z-${esc(z.id)}">${esc(z.title)}</a>`).join('');
  $('#zones').innerHTML = D.zones.map((z, i) => `<section id="z-${esc(z.id)}" class="sec zone split ${esc(z.theme)}${i % 2 ? ' rev' : ''}">${decoHTML(z.deco)}<figure class="side"><img src="assets/img/${esc(z.img)}" alt="" loading="lazy" decoding="async"></figure><div><div class="zone-head"><h2>${esc(z.title)}</h2>${z.sticker ? `<img class="sticker${i % 2 ? ' l' : ''}" src="assets/img/${esc(z.sticker)}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : ''}</div><p class="note">${esc(z.blurb)}</p><div class="grid">${z.areas ? areasCard(z) : ''}${D.services.filter(s => s.zone === z.id).map(card).join('')}</div>${z.footnote ? `<p class="card-note zone-note">${esc(z.footnote)}</p>` : ''}<p class="zone-cta">Not sure what fits? <a href="#request">Send me your goal ♡</a></p></div></section>`).join('');

  Object.entries(D.decos || {}).forEach(([id, arr]) => { const el = $('#' + id); if (el) el.insertAdjacentHTML('afterbegin', decoHTML(arr)); });
  $('#about-intro').textContent = D.about.intro;
  $('#about-cards').innerHTML = D.about.cards.map(c => `<article class="card"><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></article>`).join('');
  $('#about-facts').innerHTML = D.about.facts.map(f => `<li>${esc(f)}</li>`).join('');
  $('#steps').innerHTML = D.steps.map(s => `<li>${esc(s)}</li>`).join('');
  $('#terms-grid').innerHTML = D.terms.map(t => `<article class="card"><h3>${esc(t[0])}</h3><p>${esc(t[1])}</p></article>`).join('');
  $('#faq-list').innerHTML = D.faq.map(f => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('');
  $('#contact-links').innerHTML = `<a class="btn" href="${x}" target="_blank" rel="noopener noreferrer">X / @${esc(S.twitterHandle)}</a>` + (S.discord ? `<a class="btn ghost" href="${esc(S.discord)}" target="_blank" rel="noopener noreferrer">Discord</a>` : '');
  $('#year').textContent = new Date().getFullYear();

  const menuButton = $('#menu-btn'), nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => menuButton.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();
