/* EDIT HERE: promotions and holiday campaigns for BOTH divisions.
   - Each promotion belongs to ONE game ("zzz" or "genshin"). Prices are never typed here: every item points at a catalog price
     (see "key" below), so normal price, discount and final price are always computed from the real catalog by js/promo-engine.js.
   - Item keys. ZZZ: the exact service name in js/data.js. Genshin: "maintenance:Monthly", "exploration:Natlan:without",
     "exploration:Natlan:with", "oculus:Geoculus", "offer:<category id>:<offer name>" (for example "offer:building:Level 90").
   - Dates are "YYYY-MM-DD" in the shop time zone below. Start 00:00:00 and end 23:59:59 are both inclusive.
   - To retire a promotion: delete it or let its end date pass (expired promotions are never shown as active). */
(() => {
  const CONFIG = { utcOffset: "-06:00", timezoneLabel: "UTC−06:00" }; // shop time zone; change if needed

  const CAMPAIGNS = [
    { id: "christmas-2026", name: "Christmas 2026", start: "2026-12-18", end: "2026-12-26" },
    { id: "end-of-year-2026", name: "End of Year 2026", start: "2026-12-27", end: "2026-12-31" },
    { id: "new-year-2027", name: "New Year 2027", start: "2027-01-01", end: "2027-01-10" }
  ].flatMap(c => ["zzz", "genshin"].map(g => Object.assign({}, c, { id: g + "-" + c.id, game: g, key: c.id })));

  const camp = (g, k) => CAMPAIGNS.find(c => c.game === g && c.key === k);
  const BASE = { start: "2026-11-13", end: "2027-01-31", combinable: false };
  const NOCOMBO = "Cannot be combined with other promotions. One promotion per request.";
  const common = {
    welcome: { eligibility: "Customers placing their first request with 3h1t3 in this division. 3h1t3 confirms this when preparing your written quote.", limitations: ["One welcome discount per customer in this division.", "Applies only to the services listed here."] },
    loyalty: { eligibility: "Customers who have completed a previous request with 3h1t3 in this division. 3h1t3 confirms this manually when preparing your written quote.", limitations: ["Applies only to the services listed here."] },
    seasonal: { eligibility: "Any customer in this division.", limitations: ["The request must be submitted within the promotion dates.", "Applies only to the services listed here."] }
  };
  const P = (o) => Object.assign({ status: "approved", mode: "each", combinable: false }, o);
  const cond = (...extra) => ["The discount is shown in your written quote.", "Scope, exclusions and results follow the normal service description.", ...extra, NOCOMBO];

  const zzz = [
    P({ id: "zzz-welcome", game: "zzz", type: "welcome", name: "Welcome — First Order", description: "10% off your first Zenless Zone Zero request for these services.", ...BASE, ...common.welcome,
      items: [{ key: "Character Building (no disc farming)", label: "Character Building (no disc farming)" }, { key: "Character Building (with farming)", label: "Character Building (with farming)" }, { key: "Main Event Assistance", label: "Main Event Assistance" }],
      discount: { type: "percent", value: 10 }, conditions: cond() }),
    P({ id: "zzz-maintenance", game: "zzz", type: "maintenance", name: "Maintenance Boost", description: "10% off short maintenance plans.", ...BASE, ...common.seasonal,
      items: [{ key: "1-Week Maintenance", label: "1-Week Maintenance" }, { key: "15-Day Maintenance", label: "15-Day Maintenance" }],
      discount: { type: "percent", value: 10 }, conditions: cond() }),
    P({ id: "zzz-bundle", game: "zzz", type: "bundle", name: "Multi-Service Duo: Endgame + Maintenance", description: "10% off when you request both services together in one request.", ...BASE, ...common.seasonal, mode: "set",
      items: [{ key: "Endgame — Whole Patch", label: "Endgame — Whole Patch" }, { key: "1-Month Maintenance", label: "1-Month Maintenance" }],
      discount: { type: "percent", value: 10 }, conditions: cond("Both services must be requested together in the same request.") }),
    P({ id: "zzz-loyalty", game: "zzz", type: "loyalty", name: "Returning Customer", description: "5% off for returning customers.", ...BASE, ...common.loyalty,
      items: [{ key: "1-Month Maintenance", label: "1-Month Maintenance" }, { key: "Character Building (no disc farming)", label: "Character Building (no disc farming)" }],
      discount: { type: "percent", value: 5 }, conditions: cond() }),
    P({ id: "zzz-christmas-2026", game: "zzz", type: "seasonal", campaign: "zzz-christmas-2026", name: "Christmas 2026 — Cozy Maintenance", description: "10% off long maintenance plans for the holidays.", start: camp("zzz", "christmas-2026").start, end: camp("zzz", "christmas-2026").end, ...common.seasonal,
      items: [{ key: "1-Month Maintenance", label: "1-Month Maintenance" }, { key: "42-Day Maintenance", label: "42-Day Maintenance" }], discount: { type: "percent", value: 10 }, conditions: cond() }),
    P({ id: "zzz-end-of-year-2026", game: "zzz", type: "seasonal", campaign: "zzz-end-of-year-2026", name: "End of Year 2026 — Endgame Wrap-Up", description: "10% off endgame help to close the year.", start: camp("zzz", "end-of-year-2026").start, end: camp("zzz", "end-of-year-2026").end, ...common.seasonal,
      items: [{ key: "Endgame — Whole Patch", label: "Endgame — Whole Patch" }, { key: "Shiyu Defense", label: "Shiyu Defense (per reset)" }], discount: { type: "percent", value: 10 }, conditions: cond("Endgame results always depend on the account; nothing is guaranteed.") }),
    P({ id: "zzz-new-year-2027", game: "zzz", type: "seasonal", campaign: "zzz-new-year-2027", name: "New Year 2027 — Fresh Start", description: "10% off character progress and patch packages to start the year.", start: camp("zzz", "new-year-2027").start, end: camp("zzz", "new-year-2027").end, ...common.seasonal,
      items: [{ key: "Character Building (with farming)", label: "Character Building (with farming)" }, { key: "Full Patch Bundle", label: "Full Patch Bundle" }], discount: { type: "percent", value: 10 }, conditions: cond() })
  ];

  const genshin = [
    P({ id: "gi-welcome", game: "genshin", type: "welcome", name: "Welcome — First Order", description: "10% off your first Genshin Impact request for these services.", ...BASE, ...common.welcome,
      items: [{ key: "exploration:Mondstadt:without", label: "Exploration without quests — Mondstadt" }, { key: "exploration:Liyue:without", label: "Exploration without quests — Liyue" }, { key: "offer:building:Level 90", label: "Character level 90 (per character)" }],
      discount: { type: "percent", value: 10 }, conditions: cond() }),
    P({ id: "gi-maintenance", game: "genshin", type: "maintenance", name: "Maintenance Boost", description: "10% off Weekly and Monthly maintenance.", ...BASE, ...common.seasonal,
      items: [{ key: "maintenance:Weekly", label: "Weekly maintenance (7 days)" }, { key: "maintenance:Monthly", label: "Monthly maintenance (28 days)" }],
      discount: { type: "percent", value: 10 }, conditions: cond() }),
    P({ id: "gi-bundle", game: "genshin", type: "bundle", name: "Multi-Service Duo: Liyue + Geoculus", description: "10% off when you request Liyue exploration (without quests) and the Geoculus collection together.", ...BASE, ...common.seasonal, mode: "set",
      items: [{ key: "exploration:Liyue:without", label: "Exploration without quests — Liyue" }, { key: "oculus:Geoculus", label: "Geoculus collection" }],
      discount: { type: "percent", value: 10 }, conditions: cond("Both services must be requested together in the same request.") }),
    P({ id: "gi-loyalty", game: "genshin", type: "loyalty", name: "Returning Customer", description: "5% off for returning customers.", ...BASE, ...common.loyalty,
      items: [{ key: "maintenance:Monthly", label: "Monthly maintenance (28 days)" }, { key: "offer:building:Level 90", label: "Character level 90 (per character)" }],
      discount: { type: "percent", value: 5 }, conditions: cond() }),
    P({ id: "gi-christmas-2026", game: "genshin", type: "seasonal", campaign: "genshin-christmas-2026", name: "Christmas 2026 — Patch Care", description: "10% off Patch maintenance and the Pyroculus collection for the holidays.", start: camp("genshin", "christmas-2026").start, end: camp("genshin", "christmas-2026").end, ...common.seasonal,
      items: [{ key: "maintenance:Patch", label: "Patch maintenance (up to 42 days)" }, { key: "oculus:Pyroculus", label: "Pyroculus collection" }], discount: { type: "percent", value: 10 }, conditions: cond() }),
    P({ id: "gi-end-of-year-2026", game: "genshin", type: "seasonal", campaign: "genshin-end-of-year-2026", name: "End of Year 2026 — Endgame Wrap-Up", description: "10% off Level B endgame services to close the year.", start: camp("genshin", "end-of-year-2026").start, end: camp("genshin", "end-of-year-2026").end, ...common.seasonal,
      items: [{ key: "offer:spiral:B — Maximum stars", label: "Spiral Abyss B — Maximum stars" }, { key: "offer:theatre:B — Maximum stars or achievements", label: "Imaginarium Theatre B — Maximum stars or achievements" }], discount: { type: "percent", value: 10 }, conditions: cond("Endgame results always depend on the account; nothing is guaranteed.") }),
    P({ id: "gi-new-year-2027", game: "genshin", type: "seasonal", campaign: "genshin-new-year-2027", name: "New Year 2027 — Fresh Start", description: "10% off exploration with quests for Fontaine and Natlan.", start: camp("genshin", "new-year-2027").start, end: camp("genshin", "new-year-2027").end, ...common.seasonal,
      items: [{ key: "exploration:Fontaine:with", label: "Exploration with quests — Fontaine" }, { key: "exploration:Natlan:with", label: "Exploration with quests — Natlan" }], discount: { type: "percent", value: 10 }, conditions: cond() })
  ];

  // Price resolver: reads ONLY approved public prices from each division's own catalog.
  function resolver(game, key) {
    if (game === "zzz") { const s = ((window.DATA || {}).services || []).find(x => x.name === key); return s && typeof s.price === "number" ? s.price : null; }
    const G = window.DATA_GENSHIN; if (!G) return null;
    const cat = id => G.cats.find(c => c.id === id), parts = key.split(":");
    const ok = p => p && p.status === "approved" && typeof p.amount === "number" ? p.amount : null;
    if (parts[0] === "maintenance") { const f = cat("maintenance").offers.find(o => o.name === parts[1]); return f ? ok(f.price) : null; }
    if (parts[0] === "exploration") { const c = cat("exploration"), v = c.prices[parts[1] === "Sumeru" ? "Sumeru — Forest" : parts[1]]; return v && typeof v[parts[2] === "with" ? 1 : 0] === "number" ? v[parts[2] === "with" ? 1 : 0] : null; }
    if (parts[0] === "oculus") { const v = cat("oculus").prices[parts[1]]; return typeof v === "number" ? v : null; }
    if (parts[0] === "offer") { const f = (cat(parts[1]).offers || []).find(o => o.name === parts.slice(2).join(":")); return f ? ok(f.price) : null; }
    return null;
  }

  window.PROMOS = { config: CONFIG, campaigns: CAMPAIGNS, promos: [...zzz, ...genshin], resolver };
})();
