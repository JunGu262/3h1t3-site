/* 3h1t3 shared promotions engine (used by BOTH divisions, never mixes their data).
   Pure functions: no DOM access, so it runs in the browser and in Node tests (tests/run-tests.js).
   All money is computed in integer cents and rounded half-up to avoid floating-point errors.
   Dates are "YYYY-MM-DD" and are read in the shop time zone (js/promos-data.js > CONFIG.utcOffset):
   a promotion starts at 00:00:00 on its start date and ends at 23:59:59 on its end date, both inclusive. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PromoEngine = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const TYPES = ["welcome", "seasonal", "bundle", "maintenance", "loyalty"];
  const GAMES = ["zzz", "genshin"];
  const toCents = n => Math.round(Number(n) * 100);
  const percentOff = (cents, pct) => Math.floor((cents * pct + 50) / 100); // half-up, integers only
  const fmt = cents => "$" + (cents / 100).toFixed(2);

  // "2026-12-25" + offset "-06:00" -> Date. endOfDay=true gives 23:59:59.999 of that day.
  function instant(dateStr, offset, endOfDay) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || "")) return null;
    const t = endOfDay ? "T23:59:59.999" : "T00:00:00.000";
    const d = new Date(dateStr + t + offset);
    return isNaN(d.getTime()) ? null : d;
  }

  // 'upcoming' | 'active' | 'expired' | 'invalid'
  function status(promo, now, offset) {
    const a = instant(promo.start, offset, false), b = instant(promo.end, offset, true);
    if (!a || !b || b < a) return "invalid";
    const t = (now || new Date()).getTime();
    return t < a.getTime() ? "upcoming" : t > b.getTime() ? "expired" : "active";
  }

  // Whole days left including today (active promotions only), otherwise null.
  function daysLeft(promo, now, offset) {
    if (status(promo, now, offset) !== "active") return null;
    const end = instant(promo.end, offset, true);
    return Math.ceil((end.getTime() - (now || new Date()).getTime()) / 86400000);
  }

  // resolver(game, key) -> number (approved USD price) or null.  Returns a breakdown in cents.
  function compute(promo, resolver) {
    const rows = promo.items.map(it => {
      const p = resolver(promo.game, it.key);
      if (typeof p !== "number") throw new Error("Unresolved or unapproved price: " + promo.game + " / " + it.key + " (" + promo.id + ")");
      return { key: it.key, label: it.label, normal: toCents(p) };
    });
    const normalTotal = rows.reduce((s, r) => s + r.normal, 0);
    const d = promo.discount;
    if (d.type === "percent") {
      rows.forEach(r => { r.discount = percentOff(r.normal, d.value); r.final = r.normal - r.discount; });
    } else { // fixed amount off the whole set
      const total = Math.min(toCents(d.value), normalTotal);
      let left = total;
      rows.forEach((r, i) => { const share = i === rows.length - 1 ? left : Math.floor(total * r.normal / normalTotal); r.discount = share; left -= share; r.final = r.normal - share; });
    }
    const totals = { normal: normalTotal, discount: rows.reduce((s, r) => s + r.discount, 0) };
    totals.final = totals.normal - totals.discount;
    return { rows, totals, mode: promo.mode || "each" };
  }

  // Returns a list of human-readable problems (empty list = valid).
  function validate(promos, campaigns, resolver, offset) {
    const errs = [], seen = new Set(), camp = Object.fromEntries((campaigns || []).map(c => [c.id, c]));
    const need = ["id", "game", "type", "name", "description", "items", "discount", "start", "end", "eligibility", "conditions", "combinable", "limitations"];
    promos.forEach(p => {
      need.forEach(k => { if (p[k] === undefined || p[k] === null || p[k] === "") errs.push(p.id + ": missing " + k); });
      if (seen.has(p.id)) errs.push(p.id + ": duplicate id"); seen.add(p.id);
      if (!GAMES.includes(p.game)) errs.push(p.id + ": bad game"); if (!TYPES.includes(p.type)) errs.push(p.id + ": bad type");
      if (!instant(p.start, offset, false) || !instant(p.end, offset, true)) errs.push(p.id + ": bad date"); else if (instant(p.end, offset, true) < instant(p.start, offset, false)) errs.push(p.id + ": end before start");
      if (p.discount) {
        if (!["percent", "amount"].includes(p.discount.type) || !(p.discount.value > 0)) errs.push(p.id + ": bad discount");
        if (p.discount.type === "percent" && p.discount.value > 50) errs.push(p.id + ": percent above 50");
      }
      if (p.campaign) {
        const c = camp[p.campaign];
        if (!c) errs.push(p.id + ": unknown campaign"); else { if (c.game && c.game !== p.game) errs.push(p.id + ": campaign game mismatch"); if (c.start !== p.start || c.end !== p.end) errs.push(p.id + ": dates differ from campaign " + c.id); }
      }
      try { if (p.items && p.discount) compute(p, resolver); } catch (e) { errs.push(String(e.message)); }
    });
    return errs;
  }

  return { TYPES, GAMES, toCents, fmt, instant, status, daysLeft, compute, validate };
});
