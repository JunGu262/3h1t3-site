/* EDIT HERE: Genshin Impact division (fully independent from js/data.js).
   PRICES: every price is an object { amount, status }. A dollar amount is shown ONLY when status is "approved" AND amount is a number.
   Use A(n) for an approved price. All prices listed in the approved tariff are approved; P() / Q() remain only as a safety net.
   Region and Oculus prices live in the `prices` maps of those two categories (same rule: only numbers listed there are public).
   Bundles live in the "bundles" category: each lists its components (same keys as promos-data.js) and the page computes the separate price from the catalog. */
(() => {
  const deco = (a, b, c) => [[a,3,5,1.7,-10,"hl"],[b,48,3,1.3,12,"accent"],[c,93,7,2,0,"hl"],[a,96,45,1.3,15,"line"],[b,4,52,1.4,-8,"accent"],[c,91,90,1.6,-12,"accent"],[a,50,95,1.4,8,"hl"],[b,20,92,1.8,0,"line"],[c,72,4,1.1,0,"line"]];
  const A = n => ({ amount: n, status: "approved" });             // approved price (USD)
  const P = () => ({ amount: null, status: "pending" });      // price not approved
  const Q = () => ({ amount: null, status: "pending", display: "custom" }); // quote only
  const o = (name, extra = {}) => Object.assign({ name, price: P() }, extra);

  const LEGAL = {
    division: "Genshin Impact",
    termsVersion: "GI-TERMS-2026-11-12",
    noticeVersion: "GI-RISK-2026-11-12",
    consentText: "By submitting this request, I confirm that I have read and understood the account access risks and voluntarily accept them.",
    summary: "Letting another person play on your account may breach the game publisher’s terms and can lead to restrictions, suspension or permanent closure of your account. 3h1t3 is not affiliated with or endorsed by HoYoverse and cannot guarantee your account will not be penalized.",
    disclaimerTitle: "Account Access & Risk Disclaimer",
    disclaimer: [
      "3h1t3 Pilots offers third-party piloting services for Genshin Impact. By requesting a piloting service, you acknowledge that allowing another person to access or operate your account involves risks. The game publisher’s Terms of Service may restrict sharing account access with third parties, and the publisher may impose penalties at its discretion, which can include account restrictions, suspension, or permanent closure of the account and loss of its content, without refund.",
      "3h1t3 Pilots is not affiliated with, authorized by, or endorsed by HoYoverse, and does not claim that the publisher permits, endorses, or supports piloting services. 3h1t3 cannot guarantee that your account will not be subject to restrictions, penalties, or security measures. This website does not request passwords or verification codes.",
      "You decide freely whether to request this service. By proceeding with an order, you confirm that you have read and understood this warning, that you are the owner of the account, and that you voluntarily accept these risks."
    ]
  };

  const E = { // shared exclusions
    maint: ["Primogems", "Paid or condensed resin", "Wishes / pulls and purchases", "Equipment changes", "Endgame, events, exploration or reputation"]
  };

  const cats = [
    { id: "exploration", name: "Exploration", state: "defined",
      desc: "Two modalities, priced per region. No absolute exploration percentage is promised: you receive a report of anything blocked by quests, character, level or account conditions.",
      kind: "exploration",
      modes: [
        { name: "Exploration — Without Quests", inc: ["Accessible content completed within the agreed scope", "Blocked-content report"], exc: ["Quests", "Oculus", "Archon Quests", "Stories", "Events", "Bosses", "Achievements"] },
        { name: "Exploration — With Quests", inc: ["Everything in “Without Quests”", "World quests and short quests needed to unlock content"], exc: ["Archon Quests", "Character Story Quests", "Aranara", "Oculus", "Events"] }
      ],
      regions: ["Mondstadt", "Dragonspine", "Liyue", "The Chasm", "Inazuma", "Enkanomiya", "Sumeru — Forest", "Sumeru — Desert", "Fontaine", "Chenyu Vale", "Natlan", "Nod-Krai", "Snezhnaya"],
      prices: { // [Without Quests, With Quests] in USD, per region
        "Mondstadt": [12, 18], "Dragonspine": [10, 14], "Liyue": [20, 30], "The Chasm": [18, 26], "Inazuma": [26, 40], "Enkanomiya": [20, 28],
        "Sumeru — Forest": [30, 48], "Sumeru — Desert": [30, 48], "Fontaine": [40, 55], "Chenyu Vale": [20, 28],
        "Natlan": [45, 62], "Nod-Krai": [40, 58], "Snezhnaya": [42, 60]
      },
      pendingRegions: [],
      req: ["Exploration — Without Quests", "Exploration — With Quests"] },
    { id: "oculus", name: "Oculus", state: "defined",
      desc: "Full collection of one Oculus or regional collectible type, sold separately from Exploration. Totals are confirmed in the game before work starts.",
      kind: "oculus",
      types: ["Anemoculus", "Geoculus", "Electroculus", "Dendroculus", "Hydroculus", "Pyroculus", "Lunoculus", "Cryoculus", "Crimson Agate", "Lumenspar", "Lumisphere", "Spirit Carp"],
      prices: { "Anemoculus": 5, "Geoculus": 9, "Electroculus": 12, "Dendroculus": 17, "Hydroculus": 15, "Pyroculus": 15, "Lunoculus": 15, "Cryoculus": 5, "Crimson Agate": 6, "Lumenspar": 6, "Lumisphere": 10, "Spirit Carp": 6 }, // USD per complete collection
      inc: ["Every item of the type that is accessible on your account", "Report of anything missing"],
      exc: ["Items tied to pending quests", "Limited-time versions", "Items that need resonance stones you don’t have"],
      req: ["Oculus (list the types in the scope field)"] },

    { id: "archon", name: "Archon Quests", state: "defined", unit: "per act",
      desc: "Completing the acts you choose. Interludes and preludes are priced separately from main acts.",
      exc: ["Prerequisite quests you haven’t done", "Exploration", "Oculus"],
      note: "The number of acts in each nation is confirmed in-game before your quote.",
      offers: [
        o("Archon Quest act", { unit: "per act", price: A(5), inc: ["One main act completed, cutscenes included", "Required fights and puzzles of that act"] }),
        o("Archon Quest — 3-act set", { unit: "per set", price: A(13), inc: ["Three consecutive main acts of your choice", "Saves $2 compared with three single acts"] }),
        o("Interlude or prelude", { unit: "per quest", price: A(3), inc: ["One interlude or prelude quest completed"] })
      ], req: ["Archon Quests"] },
    { id: "story", name: "Character Story Quests", state: "defined", desc: "Completing the character story quest you choose.",
      exc: ["Extra achievements"], offers: [o("Character Story Quest", { unit: "per quest", price: A(4), inc: ["One character’s story quest completed, all chapters available on your account"] })], req: ["Character Story Quests"] },
    { id: "hangout", name: "Hangout Events", state: "defined", desc: "Completing the hangout quest you choose, covering all endings.",
      offers: [o("Hangout (all endings)", { unit: "per quest", price: A(3), inc: ["One hangout quest with every ending completed"] })], req: ["Hangout Events"] },
    { id: "tribal", name: "Tribal Chronicles", state: "defined", desc: "The complete series, with all of its parts.",
      offers: [o("Tribal Chronicles series", { unit: "per series", price: A(10), inc: ["Every part of the series that is available on your account", "Required fights and puzzles"] })], req: ["Tribal Chronicles"] },
    { id: "worldq", name: "World Quests", state: "defined", desc: "Priced by quest size. The size of each quest is confirmed in your written quote.",
      exc: ["Archon Quests", "Character Story Quests", "Limited-time events"],
      offers: [
        o("Short world quest", { unit: "per quest", price: A(2), inc: ["A quest of a few steps"] }),
        o("Long world quest", { unit: "per quest", price: A(5), inc: ["A multi-stage quest with fights or puzzles"] }),
        o("World quest chain", { unit: "per chain", price: A(10), inc: ["A full chain of linked quests"] })
      ], req: ["World Quests"] },
    { id: "aranara", name: "Aranara", state: "defined", desc: "The Aranara questline in Sumeru.",
      exc: ["Exploration", "Oculus"],
      offers: [o("Aranara questline", { unit: "per questline", price: A(10), inc: ["All Aranara quests available on your account", "Required fights and puzzles"] })], req: ["Aranara"] },

    { id: "maintenance", name: "Maintenance", state: "defined", kind: "maintenance",
      desc: "Routine upkeep with a fixed structure. Extra requests are quoted separately.",
      exc: E.maint,
      offers: [
        o("Daily", { tag: "1 day", price: A(1), inc: ["Commissions", "Katheryne daily bonus", "Expeditions", "Collecting the Serenitea Pot", "Natural resin toward an objective agreed in writing"] }),
        o("Weekly", { tag: "7 days", price: A(5), inc: ["Up to 7 Daily sessions", "Up to 3 weekly bosses (available and unlocked)"] }),
        o("Monthly", { tag: "28 days", price: A(15), inc: ["28 Daily sessions", "Four weekly cycles"] }),
        o("Patch", { tag: "Up to 42 days", price: A(20), inc: ["Daily sessions", "Weekly cycles"], note: "Official patch dates must be confirmed; an extra week is quoted separately." })
      ],
      req: ["Maintenance — Daily", "Maintenance — Weekly", "Maintenance — Monthly (28 days)", "Maintenance — Patch (up to 42 days)"] },

    { id: "spiral", name: "Spiral Abyss", state: "defined", kind: "endgame",
      desc: "Choose a level. B already includes everything in A and the cycle rewards. Exact figures are verified in-game, and the result depends on your account: we tell you what is realistic before starting.",
      offers: [
        o("A — Completion", { price: A(6), inc: ["Each agreed floor marked as cleared"] }),
        o("B — Maximum stars", { price: A(12), inc: ["Maximum stars on the agreed floors", "All rewards of the cycle claimed"], note: "Cycle rewards vary by version." })
      ], req: ["Spiral Abyss"] },
    { id: "theatre", name: "Imaginarium Theatre", state: "defined", kind: "endgame",
      desc: "Choose a level. B already includes everything in A and the cycle rewards. The mode’s own record is the evidence of what was achieved.",
      offers: [
        o("A — Completion", { price: A(5), inc: ["Acts completed up to the agreed act"] }),
        o("B — Maximum stars or achievements", { price: A(10), inc: ["Maximum stars or achievements the mode shows, up to the agreed act", "Cycle rewards claimed"] })
      ], req: ["Imaginarium Theatre"] },
    { id: "stygian", name: "Stygian Onslaught", state: "defined", kind: "endgame",
      desc: "Choose a level. B already includes everything in A and the cycle rewards. The results screen is the evidence.",
      offers: [
        o("A — Completion", { price: A(5), inc: ["Agreed difficulty (Hard, Menacing or Fearless) cleared"], exc: ["Dire"] }),
        o("B — Maximum objectives", { price: A(10), inc: ["All objectives shown for the agreed difficulty", "Cycle rewards claimed", "Dire difficulty when your account can realistically attempt it (confirmed in your quote)"] })
      ], req: ["Stygian Onslaught"] },
    { id: "edge", name: "Edge of Survival", state: "defined", kind: "endgame",
      desc: "The Snezhnaya shooting-range challenge. Rewards are one-time and based on Challenge Score; results depend on your account and the tiers shown in-game.",
      exc: ["Unlocking the mode (Archon Quest and quest prerequisites) — priced separately as Archon Quest acts or World Quests"],
      offers: [
        o("A — Primogem tiers", { unit: "per account", price: A(6), inc: ["Challenge Score toward the first reward tiers, including the Primogem rewards", "Mode must already be unlocked on your account"] }),
        o("B — Maximum score tiers", { unit: "per account", price: A(12), inc: ["Everything in A", "Highest reward tiers the mode shows for your account", "Difficulty Clauses used when realistic for your account"] })
      ], note: "Reward tiers and point thresholds may change with the game version; they are confirmed in-game before your quote.", req: ["Edge of Survival"] },

    { id: "building", name: "Character Building", state: "defined", kind: "list",
      desc: "Each service is separate: nothing is combined without a clear list of what it includes. Missing materials are flagged and quoted separately.",
      exc: ["Guaranteed artifact substats or random results"],
      offers: [
        o("Level 80", { unit: "per character", price: A(4), inc: ["Level-up only"], exc: ["Talents, gear, missing materials"] }),
        o("Level 90", { unit: "per character", price: A(5), inc: ["Level-up only"], exc: ["Talents, gear, missing materials"] }),
        o("Talents 8/8", { unit: "per character", price: A(5), inc: ["The talents explicitly listed in your quote"] }),
        o("Talents 10/10", { unit: "per character", price: A(10), inc: ["The talents explicitly listed in your quote"], exc: ["Missing limited-time items"] }),
        o("Level 90 + Talents 8/8", { unit: "per character", price: A(9), inc: ["Level 90", "Talents 8/8 as listed in your quote"], exc: ["Gear, missing materials"] }),
        o("Full character (Level 90 + Talents 10/10)", { unit: "per character", price: A(14), inc: ["Level 90", "Talents 10/10 as listed in your quote"], exc: ["Gear, missing limited-time items"] })
      ],
      req: ["Character Building — Level 80", "Character Building — Level 90", "Character Building — Talents 8/8", "Character Building — Talents 10/10", "Character Building — Level 90 + Talents 8/8", "Character Building — Full character"] },
    { id: "weapon", name: "Weapon Leveling", state: "defined", kind: "list", desc: "Leveling one weapon at a time.",
      offers: [
        o("Weapon level 80", { unit: "per weapon", price: A(3), inc: ["Level-up only"], exc: ["Refinements"] }),
        o("Weapon level 90", { unit: "per weapon", price: A(4), inc: ["Level-up only"], exc: ["Refinements"] })
      ], req: ["Weapon Leveling — Level 80", "Weapon Leveling — Level 90"] },
    { id: "artifact", name: "Artifact Farming", state: "defined", kind: "list",
      desc: "Dedicated artifact-domain runs with your natural resin for the period you choose. Artifact results are random: substats can never be guaranteed.",
      exc: ["Guaranteed artifact substats or sets", "Paid or condensed resin unless agreed in writing", "Artifact leveling or enhancement"],
      offers: [
        o("1 week", { tag: "7 days", price: A(6), inc: ["Natural resin spent on the artifact domain you choose", "Report of runs completed"] }),
        o("2 weeks", { tag: "14 days", price: A(11), inc: ["Everything in 1 week, for 14 days"] }),
        o("28 days", { tag: "28 days", price: A(20), inc: ["Everything in 1 week, for 28 days"] })
      ], req: ["Artifact Farming — 1 week", "Artifact Farming — 2 weeks", "Artifact Farming — 28 days"] },
    { id: "materials", name: "Materials Farming", state: "defined", kind: "list",
      desc: "Collecting the materials you need. Drops from enemies and bosses can never be guaranteed; any shortfall is reported.",
      exc: ["Guaranteed drop rates", "Items that must be bought or crafted with paid currency"],
      offers: [
        o("Common materials pack", { unit: "per pack", price: A(3), inc: ["Wood, ores, plants or common enemy drops in the quantity listed in your quote"] }),
        o("Character materials set", { unit: "per character", price: A(8), inc: ["Ascension and talent materials for one character, within the scope listed in your quote"], exc: ["Weekly boss drops unless listed"] })
      ], req: ["Materials Farming — Common pack", "Materials Farming — Character set"] },

    { id: "specialties", name: "Local Specialties", state: "defined", kind: "list", desc: "Collecting a pack of local specialties from one region.",
      offers: [o("Specialties pack", { unit: "per pack", price: A(3), inc: ["100 specialties from one region of your choice, split as agreed in your quote"] })], req: ["Local Specialties"] },
    { id: "fishing", name: "Fishing", state: "defined", kind: "list", desc: "Fishing-related items, each sold separately.",
      offers: [
        o("Fishing weapon (R1)", { unit: "per weapon", price: A(5), inc: ["One fishing weapon obtained at refinement 1"], exc: ["Bait recipe"] }),
        o("Refinement", { unit: "per refinement", price: A(2), inc: ["One additional refinement level of a fishing weapon"] }),
        o("Fishing rod", { unit: "per item", price: A(4), inc: ["One fishing rod obtained"] }),
        o("Bait recipe", { unit: "per recipe", price: A(1), inc: ["One bait recipe obtained"] })
      ],
      req: ["Fishing — Weapon (R1)", "Fishing — Refinement", "Fishing — Rod", "Fishing — Bait recipe"] },
    { id: "events", name: "Events", state: "defined", kind: "list", desc: "The size of an event is confirmed before you accept the quote. Spending paid resources is not included.",
      offers: [
        o("Minor event", { unit: "per event", price: A(3), inc: ["A few tasks"] }),
        o("Major event", { unit: "per event", price: A(6), inc: ["Several stages"] }),
        o("Exploration or special event", { unit: "per event", price: A(8), inc: ["Events based on an area or a special format, such as map exploration or multi-day challenges"] })
      ],
      req: ["Events"] },

    { id: "weeklyboss", name: "Weekly Bosses", state: "defined", kind: "list", desc: "Weekly bosses on their own, without the rest of Weekly maintenance.",
      exc: ["Guaranteed drops", "Bosses that are locked on your account"],
      offers: [
        o("Weekly bosses — 1 week", { tag: "up to 3 bosses", price: A(3), inc: ["Up to 3 weekly bosses, available and unlocked", "Resin spent as agreed"] }),
        o("Weekly bosses — 4 weeks", { tag: "up to 12 bosses", price: A(10), inc: ["Up to 3 weekly bosses per week, for 4 weeks"] })
      ], note: "Already included in Weekly, Monthly and Patch maintenance.", req: ["Weekly Bosses — 1 week", "Weekly Bosses — 4 weeks"] },
    { id: "bossfarm", name: "Boss Farming", state: "defined", kind: "list", desc: "Repeated runs of one normal boss for its drops. Drops can never be guaranteed.",
      exc: ["Guaranteed drops"],
      offers: [o("Normal boss — 10 runs", { unit: "per boss", price: A(4), inc: ["Up to 10 runs of one normal boss of your choice", "Drops delivered to your account"] })], req: ["Boss Farming"] },
    { id: "domains", name: "Domains", state: "defined", kind: "list", desc: "Talent, weapon or artifact domain runs with your natural resin.",
      exc: ["Guaranteed drops", "Paid or condensed resin unless agreed in writing"],
      offers: [
        o("Domain runs", { unit: "per domain", price: A(3), inc: ["Up to 8 runs of one talent or weapon domain of your choice"] }),
        o("Domain pack (3 domains)", { unit: "per pack", price: A(8), inc: ["Up to 8 runs in each of 3 domains of your choice"] })
      ], req: ["Domains — one domain", "Domains — pack of 3"] },

    { id: "achievements", name: "Achievements", state: "defined", kind: "list",
      desc: "Achievements that can be completed with the content already available on your account. We confirm which ones are feasible before your quote.",
      exc: ["Achievements that need purchases or content you don’t have", "Time-limited achievements that have ended"],
      offers: [
        o("Simple achievement", { unit: "per achievement", price: A(1), inc: ["One achievement that needs a quick action"] }),
        o("Achievement pack (10 simple)", { unit: "per pack", price: A(8), inc: ["Ten simple achievements chosen with you"] }),
        o("Complex or hidden achievement", { unit: "per achievement", price: A(3), inc: ["One achievement that needs a long task, a puzzle or a hidden condition"] })
      ], req: ["Achievements"] },
    { id: "progression", name: "Account Progression", state: "defined", kind: "list",
      desc: "Raising your Adventure Rank through commissions, exploration, quests and other content that fits your account.",
      exc: ["Paid or condensed resin", "Wishes / pulls and purchases"],
      offers: [
        o("Adventure Rank +5", { unit: "per 5 ranks", price: A(4), inc: ["Five Adventure Ranks gained", "Ascension quests needed along the way"] }),
        o("Adventure Rank +10", { unit: "per 10 ranks", price: A(7), inc: ["Ten Adventure Ranks gained", "Ascension quests needed along the way"] })
      ], req: ["Account Progression"] },
    { id: "reputation", name: "City Reputation", state: "defined", kind: "list",
      desc: "Raising the reputation level of one city through bounties, requests, chests and quests that fit your account.",
      exc: ["Reputation tied to quests you haven’t unlocked"],
      offers: [
        o("Mondstadt or Liyue", { unit: "per city", price: A(4), inc: ["City reputation raised to the maximum level available"] }),
        o("Inazuma, Sumeru or Fontaine", { unit: "per city", price: A(6), inc: ["City reputation raised to the maximum level available"] }),
        o("Weekly reputation requests", { unit: "per week", price: A(2), inc: ["Bounties and requests of one city for one week"] })
      ], req: ["City Reputation"] },
    { id: "teleport", name: "Teleport Unlock", state: "defined", kind: "list",
      desc: "Unlocking teleport waypoints, statues and domains of one region so you can travel freely.",
      exc: ["Quest-locked waypoints you haven’t reached", "Exploration percentage"],
      offers: [
        o("Mondstadt or Liyue", { unit: "per region", price: A(4), inc: ["All reachable waypoints, statues and domains of the region"] }),
        o("Other region", { unit: "per region", price: A(8), inc: ["All reachable waypoints, statues and domains of Inazuma, Sumeru, Fontaine, Natlan or Nod-Krai"] })
      ], req: ["Teleport Unlock"] },

    { id: "bundles", name: "Bundles", state: "defined", kind: "bundles",
      desc: "Packages built only from the individual services above, at a lower price than buying them one by one. Scope and exclusions are the same as each individual service.",
      note: "Bundles cannot be combined with promotions. One promotion per request; a bundle already includes its own saving.",
      offers: [
        o("Explorer Bundle", { price: A(55), tag: "Mondstadt + Liyue",
          comps: [["exploration:Mondstadt:with", 1, "Exploration with quests — Mondstadt"], ["exploration:Liyue:with", 1, "Exploration with quests — Liyue"], ["oculus:Anemoculus", 1, "Anemoculus collection"], ["oculus:Geoculus", 1, "Geoculus collection"]] }),
        o("Team Build Bundle", { price: A(34), tag: "2 characters",
          comps: [["offer:building:Full character (Level 90 + Talents 10/10)", 2, "Full character (Level 90 + Talents 10/10) × 2"], ["offer:weapon:Weapon level 90", 2, "Weapon level 90 × 2"]] }),
        o("Patch + Endgame Bundle", { price: A(46), tag: "Patch maintenance + Level B",
          comps: [["maintenance:Patch", 1, "Patch maintenance (up to 42 days)"], ["offer:spiral:B — Maximum stars", 1, "Spiral Abyss B"], ["offer:theatre:B — Maximum stars or achievements", 1, "Imaginarium Theatre B"], ["offer:stygian:B — Maximum objectives", 1, "Stygian Onslaught B"]] }),
        o("Full Patch Bundle", { price: A(69), tag: "Maintenance + endgame + events + 1 character",
          comps: [["maintenance:Patch", 1, "Patch maintenance (up to 42 days)"], ["offer:spiral:B — Maximum stars", 1, "Spiral Abyss B"], ["offer:theatre:B — Maximum stars or achievements", 1, "Imaginarium Theatre B"], ["offer:stygian:B — Maximum objectives", 1, "Stygian Onslaught B"], ["offer:events:Major event", 1, "Major event × 1"], ["offer:events:Minor event", 2, "Minor event × 2"], ["offer:building:Full character (Level 90 + Talents 10/10)", 1, "Full character (Level 90 + Talents 10/10)"]] })
      ],
      req: ["Bundle — Explorer", "Bundle — Team Build", "Bundle — Patch + Endgame", "Bundle — Full Patch"] }
  ];

  const group = (id, theme, img, title, blurb, sticker, ids, d) => ({ id, theme, img, title, blurb, sticker, ids, deco: deco(...d) });
  const zones = [
    group("explore", "cryo", "gi-char-3.webp", "Exploration & Oculus", "Explore regions or collect Oculus types, each as a separate service.", "gi-st-shock.webp", ["exploration", "oculus"], ["❖", "✦", "◇"]),
    group("story", "anemo", "gi-char-4.webp", "Story & Quests", "Archon Quests, character stories and other quest lines.", "gi-st-point.webp", ["archon", "story", "hangout", "tribal", "worldq", "aranara"], ["✧", "❖", "☁"]),
    group("maintenance", "hydro", "gi-char-2.webp", "Maintenance", "Daily, Weekly, Monthly and Patch routines with a clear scope.", "gi-st-peace.webp", ["maintenance"], ["❖", "✧", "☾"]),
    group("endgame", "electro", "gi-char-5.webp", "Endgame", "Two levels: A Completion and B Maximum stars or objectives, which already includes the cycle rewards.", "gi-st-chest.webp", ["spiral", "theatre", "stygian", "edge"], ["✦", "❖", "☆"]),
    group("gear", "pyro", "gi-char-1.webp", "Characters & Gear", "Levels, talents, weapons, artifact and materials farming.", "gi-st-muscle.webp", ["building", "weapon", "artifact", "materials"], ["✦", "♡", "◈"]),
    group("extras", "anemo", "gi-char-2.webp", "Specialties, Fishing & Events", "Collecting, fishing items and event help.", "gi-st-peace.webp", ["specialties", "fishing", "events"], ["✧", "❖", "☁"]),
    group("bosses", "electro", "gi-char-1.webp", "Bosses & Domains", "Weekly bosses, boss farming and domains.", "gi-st-muscle.webp", ["weeklyboss", "bossfarm", "domains"], ["✦", "❖", "☆"]),
    group("account", "cryo", "gi-char-4.webp", "Account Services", "Achievements, progression, reputation and teleports.", "gi-st-point.webp", ["achievements", "progression", "reputation", "teleport"], ["❖", "✦", "◇"]),
    group("bundles", "pyro", "gi-char-5.webp", "Bundles", "Packages built from individual services, priced below buying them separately.", "gi-st-chest.webp", ["bundles"], ["✦", "♡", "◈"])
  ];

  const terms = [
    ["Independent service & affiliation", "3h1t3 Pilots is an independent fan-made service. It is not affiliated with, authorized by, endorsed by or sponsored by HoYoverse or Genshin Impact. Game names, trademarks and character artwork belong to their respective owners."],
    ["Scope & written quote", "Each service is described by its scope, what it includes and what it does not. Nothing starts until you confirm a written quote that states the exact scope. Requests outside that scope are quoted separately."],
    ["No guaranteed results", "We do not promise an absolute exploration percentage, maximum endgame results, drops, artifact substats or any other random outcome. When content is blocked by quests, character, level or account conditions, you receive a report of what could not be completed."],
    ["Prices & promotions", "Prices listed on this page are starting prices in USD for the scope described. Anything outside the listed services is quoted individually. The written quote is the only price that applies to your order, and it states the exact scope and exclusions. Promotions apply only as described in their conditions."],
    ["Payment", "All prices and written quotes are in US dollars (USD). The payment method is not selected in the request form; it is discussed privately after you have reviewed and accepted the written quote. Unless the quote states otherwise, a 30% advance payment is required to reserve the work slot and the remaining 70% is paid after the agreed work is completed. The 30% advance is part of the total price, not an additional fee. Work begins only after both parties have confirmed the written terms and the agreed advance has been received. The quote confirms the total, payment method, schedule and any transaction or currency-conversion fees before payment. We never ask for payment-account passwords, verification codes or card details through this website."],
    ["Refunds & cancellations", "If you cancel before work begins, the 30% advance is refunded in full. If you cancel after work has started, only the value of the work actually completed under the agreed scope may be retained and any prepaid amount above that is refunded. If 3h1t3 does not complete what was agreed, you will receive a refund proportional to the part not completed. The 30% advance is not a non-refundable fee. The exact refund arrangement is stated in your written quote. Nothing on this page removes any rights you may have under applicable law."],
    ["Timeframes & urgent requests", "Estimated timeframes are agreed in the written quote. Rush options are not available at this time."],
    ["Privacy", "The request form collects only your UID, server region, Adventure Rank, the service details you write, your X or Discord username (whichever contact method you choose) and a record of your acceptance of these terms. Your request is delivered to 3h1t3 only and is used only to prepare your quote and manage your order. We never ask for passwords or verification codes, and no payment details are collected by this website."],
    ["Account ownership", "You confirm that you are the owner of the account you request a service for, or that the owner has clearly authorized you to do so."],
    ["Promotions", "Promotions apply only to the Genshin Impact services and dates listed in each promotion. Each promotion shows its eligibility, conditions and limitations. Promotions cannot be combined with each other, and one promotion applies per request. The discount is shown in your written quote. A promotion that has ended cannot be applied to a new request."],
    ["Contact", "Contact is available through the request form, where you can choose X (Twitter) or Discord and provide the matching username for private, one-to-one communication. No Discord server or invitation link is provided. You can also message X (@3h1t3)."]
  ];

  const faq = [
    ["Do you ask for my password or verification codes?", "No. This website and its form never ask for passwords or verification codes, and you should never send them."],
    ["Is it risky to let someone play on my account?", "Yes. Allowing another person to operate your account may breach the game publisher’s terms and can lead to restrictions, suspension or permanent closure. 3h1t3 cannot guarantee your account will not be penalized. Please read Account Access & Risks before requesting a service."],
    ["Are the prices final?", "Listed prices are starting prices in USD for the scope described on each card. Your written quote states the exact scope, any exclusions and the price that applies to your order. Anything outside the listed services is quoted individually."],
    ["What is the difference between Exploration with and without quests?", "“Without Quests” covers accessible content within the agreed scope. “With Quests” adds world quests and short quests needed to unlock content. Neither includes Archon Quests, Character Story Quests, Aranara, Oculus or events, and neither promises an absolute percentage."],
    ["What do Daily, Weekly, Monthly and Patch include?", "Daily is one day of routine tasks; Weekly is 7 days; Monthly is 28 days; Patch is up to 42 days. They do not include Primogems, paid or condensed resin, pulls, purchases, endgame, events, exploration or reputation."],
    ["What are endgame levels A and B?", "A is completion. B is maximum stars or objectives and already includes the cycle rewards. Results depend on your account, and we tell you what is realistic before starting."],
    ["Are Oculus included in Exploration?", "No. Oculus are sold separately, by type."],
    ["How do promotions work?", "Each promotion lists the services it covers, the normal price, the discount, the final price, its dates and who can use it. Choose a promotion in the request form and it will be applied in your written quote if you are eligible. One promotion per request; promotions cannot be combined."],
    ["Do you run holiday offers?", "Yes. Christmas 2026 runs from December 18 to December 26, End of Year 2026 from December 27 to December 31, and New Year 2027 from January 1 to January 10 (UTC−06:00). They are listed under Promotions."],
    ["How does payment work?", "Unless your written quote states otherwise, 30% of the agreed total is paid in advance to reserve the work slot, and the remaining 70% is paid after the agreed work is completed. The advance is part of the total price, not an extra fee, and nothing is charged before you accept the written quote. Payment methods are discussed privately afterwards. We never ask for payment-account passwords, verification codes or card details through this website."],
    ["What if something cannot be completed?", "Some content can be blocked by quests, character level or account conditions. You receive a report of what could not be completed, and if 3h1t3 does not complete what was agreed, you receive a refund proportional to the part not completed."],
    ["How do I contact you?", "Through the request form. Choose X (Twitter) or Discord and provide the matching username. Communication is private and one-to-one; there is no public Discord server or invitation link."]
  ];

  const steps = [
    "Browse the catalog and pick the service you’re interested in.",
    "Read Account Access & Risks, then send the request form with your UID, server region and what you need.",
    "Receive a written quote that states the exact scope, any limits and the price.",
    "Nothing starts until you confirm the quote. We never ask for passwords or verification codes."
  ];

  const about = {
    intro: "I run 3h1t3 on my own. Every Genshin Impact request is handled personally, so you always talk to the same person about your account and your goals.",
    cards: [
      ["My experience", "I have played Genshin Impact for more than two years. That time has taught me how its routines, quests, exploration and endgame fit together, and what is realistic for different accounts."],
      ["How I work", "I value careful work, transparency and clear communication. You get a written quote with the exact scope and exclusions before anything starts, and I tell you early if something changes."],
      ["What I want for you", "I want you to feel comfortable asking questions, whether it is about a service, a limit or a risk. I would rather you ask now than be surprised later."],
      ["My reputation", "I am building my reputation through honest service and authentic feedback, one request at a time."]
    ],
    facts: ["2+ years playing Genshin Impact", "Independent, run by one person", "Every request handled personally", "Written quote before any work", "Questions always welcome", "Honest, transparent service"]
  };

  window.DATA_GENSHIN = { cats, zones, terms, faq, steps, legal: LEGAL, about };
})();
