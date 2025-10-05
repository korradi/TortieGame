# Tortie: Heart of Ember — Complete Game Design Document
**Version:** 1.0 • **Date:** 2025-10-05 • **Target:** Web (Desktop + Mobile) • **Model:** Free-to-play (cozy sim)  
**Elevator pitch:** A cozy, fantasy‑cute virtual‑pet sim where you nurture a lava turtle (Tortie). Your care builds **Resonance** that gently hums open **portals** connected to a wider mythos. Deep systems (stats, moods, rituals), meta progression (levels, evolutions, achievements), light narrative (dream logs, seasonal events), and optional social features.

---

## 0) Context & Inspirations
- **Virtual pet sims:** Tamagotchi, Neko Atsume (care/collect), My Talking Tom (rituals/loop).
- **Blob/Slime vibes:** Friendly squishiness and forgiving UX.  
- **Argo / Bâtisseurs lore:** Tortie is a living **Fire Node** tied to 22 cosmic keys. Caring = stabilizing a fragment of the Machine.

### Blobzone research summary (public sources)
We searched the public web for “Blobzone” to understand tone and mechanics from that era of Flash games. Findings indicate:
- **Blobzone appears primarily as a developer/author identity** with many Flash titles archived on FlashMuseum/Newgrounds (e.g., *Idle Slayer, Stick Run, Civilizator,* etc.). Specific “Blobzone” game rulesets are not centrally documented. [FlashMuseum; Newgrounds]
- There is a **Reddit community r/blobzone** referencing a Prizee‑era “Blobzone online flash game” that closed around 2009 and efforts to restore it; direct gameplay docs are scarce and some links are rate‑limited. [r/blobzone]
- Context on **Prizee** (the French Flash portal) provides background on the F2P meta and reward mechanics of the era (Bubz/Zeep currencies, prize loops). Useful for economy inspiration. [Prizee background]

> **Inference:** Publicly accessible details about a singular “Blobzone” gameplay loop are limited; however, the era’s **arcadey, sticky loops** and **lightweight F2P structures** are well documented and inform Tortie’s design (short sessions, progression taps every 30–120s, cosmetic collection, gentle compulsion loops).

---

## 1) High‑Level Vision
- **Player fantasy:** You are caretaker and attuner of a molten turtle whose heart is a nascent portal core. Your rituals—feeding, vent tuning, songs—shape Tortie’s mood and the world’s resonance.
- **Core promise:** Low‑friction cozy play you can dip into for 2–5 minutes, with meaningful long‑term progression (evolutions, decor, lore). No punishing failure; gentle recovery.
- **Pillars:**
  1. **Caring is play.** Rituals feel tactile, charming, and reactive.
  2. **Progress begets wonder.** Resonance reveals dream logs, ambient portal VFX, and new habitats.
  3. **Frictionless generosity.** Smart timers, offline progress pings, daily seeds—not grind walls.

---

## 2) Core Loop (30–120s)
1. **Check stats** (Heat, Mood, Flux, Shell, Resonance, XP).  
2. **Perform 1–3 rituals:** Vent/Heat balance, petting, feed item, polish shell, sing incantation.  
3. **Claim pips:** XP, objective progress, small drops (resources, decor shards).  
4. **Spend/Plan:** Craft an item, slot a booster, target an objective milestone.  
5. **(Sometimes) Lore beat:** portal hum, dream fragment, milestone vignette.

**Session cadence:** 1–3 loops per micro‑session, 3–6 sessions/day. Offline time yields tiny Flux drift and “ember dust” for small catch‑ups.

---

## 3) Systems Overview
### 3.1 Stats (0–100)
- **Heat** (target window 50–66): ambient lava +0.35/s, vent reduces up to −0.9/s.  
- **Mood:** + via petting/feeding/success; − small passive decay.  
- **Flux:** internal energy; slow drain, boosted by basalt/sulfur, spells.  
- **Shell:** structural integrity; decays faster when heat too low/high; repaired with polish/oil.

**Resonance (derived):** blends (Mood, Flux, Shell) + penalty for Heat deviation; >100% clamps. High resonance unlocks portal hums and meta rewards.

### 3.2 Actions
- **Vent slider** (cooling), **Stoke** (heat up, flux cost), **Polish** (repair, mood +), **Pet‑hold** (mood ++), **Feed** (Nettle/Sulfur/Basalt/Oil), **Incantations** (CALDO PACIS, VENA STABILIS, COCHLEA LUX, PORTA SUSURRUS).  
- **Crafting:** Combine **Basalt + Sulfur ⇒ Thermal Core** (resonance burst). Tier 2 recipes unlock later (e.g., Core + Oil ⇒ Tempered Core).

### 3.3 Progression
- **XP & Levels:** per‑action XP; per‑level cap = 50 + 40·(L−1). Level‑up grants small auto‑repairs and unlocks content.  
- **Evolutions:** 4 stages (Hatchling → Emberling → Magmawalker → Gatekeeper) gated by Level and Resonance thresholds. Evolutions visually upgrade Tortie and add a passive perk (e.g., +1% resonance smoothing per stage).  
- **Objectives (repeatable & weekly):** e.g., “Keep Heat in sweet spot for 120s,” “Sing 12 incantations,” “Craft 2 cores.” Rewards: XP, items, decor shards.  
- **Achievements (one‑off):** First Pet, Shiny Friend (20 polishes), Heat Whisperer (95% resonance), Portal Whisper (first portal hum), etc.

### 3.4 Meta Economy
- **Soft currencies:** Ember Dust (daily/idle), Crystal Shards (objective/seasonal), Craft Mats (Basalt/Sulfur/Oil).  
- **Hard currency (optional):** Moonstones for cosmetics/skip (PCG‑friendly; can be disabled).  
- **Sinks:** decor crafting, skin recolors, habitat upgrades, portal themes, QoL boosters.

### 3.5 Habitats & Decor (cosmetic)
- **Biomes:** Ember Nook (start), Crystal Cavity, Fumerole Garden, Obsidian Lake, Star‑Lava Balcony.  
- **Decor slots:** foreground toys (interactives), background statues, particle motifs, music boxes.  
- **Set bonuses:** equip 3 “Crystal” items ⇒ +2 mood cap; mix‑and‑match without stat traps.

### 3.6 Narrative & Lore
- **Dream Logs:** milestone popups (e.g., resonance ≥80, level thresholds).  
- **22 Keys meta:** Tortie is Fire Node; lore seeds foreshadow other elemental nodes (Ice, Root, Wind). Future live updates unlock cross‑node rituals.

---

## 4) Detailed Numbers (baseline; tuned in telemetry)
- **Tick:** 1s. Ambient heat +0.35; vent cooling up to −0.9 (vent=100).  
- **Mood drift:** −0.06/s; petting +0.6/s.  
- **Flux drift:** −0.16/s; stoke −1; sulfur +2; basalt +6; spell +10.  
- **Shell decay:** −0.06/s normal; −0.24/s if Heat<38; −0.40/s if Heat>78. Polish +7; Oil +12.  
- **Resonance:** weighted mix with quadratic heat penalty; mood & shell > thresholds grant tiny bonus.  
- **Portal hum:** at 100% resonance, gentle reward drip: +1 XP/s while maintained (capped).

---

## 5) Content Plan (Season 0 → Season 2)
### Season 0 (Launch)
- 4 evolutions, 5 habitats, 60 objectives, 40 achievements, 25 decor items, 12 music loops, 4 incantations, 6 crafting recipes.
### Season 1 (Elemental Echoes)
- New Node teases; 2 more incantations; 2 habitats; social postcards; “Festival of Keys” time‑limited decor.
### Season 2 (Harmonic Weave)
- Dream log chapter; duet rituals (NPC guest creatures); seasonal meta with cooperative portal tuning.

---

## 6) UX & Accessibility
- **Mobile‑first inputs:** big targets; haptics on petting; disable rapid tap spam.  
- **Color‑safe palettes**; captions for audio ritual; toggle motion.  
- **Offline tolerance:** stat drift clamps; daily gifts cached.  
- **No fail walls:** shell cracks are cosmetic; recovery always available.

---

## 7) Tech & Architecture (Web App)
- **Frontend:** React/Next.js + TypeScript; Canvas or WebGL for scene VFX; AudioContext for soft ambience.  
- **State:** Zustand/Redux; deterministic tick; time‑delta catch‑up on resume.  
- **Assets:** procedural placeholders upgradeable to hand‑drawn art; sprite sheets for Tortie stages; Lottie or shaders for portal VFX.  
- **Persistence:** localStorage + cloud sync (optional) via user login.  
- **Telemetry:** lightweight events (session length, action counts, resonance duration).

### Performance targets
- 60 FPS on mid phones, <2s FCP; lazy‑load art; requestIdleCallback for non‑critical updates.  
- Visuals: offload glow/pulse to shaders or CSS compositing; clamp filters on low‑end.

---

## 8) Systems Specs (Implementable)
### 8.1 Data model (simplified)
```ts
type SaveV1 = {
  stats: { heat:number; mood:number; flux:number; shell:number; };
  resonance:number; xp:number; level:number; evo:number;
  inv: Record<string, number>;
  progress: Record<string, number>;
  ach: Record<string, boolean>;
  decor: string[]; habitat: string;
  lastTickISO: string;
}
```
### 8.2 Tuning interfaces
- JSON tables for objectives/achievements/recipes.  
- LiveOps config: daily seed (gifts, store, rotating objectives).

### 8.3 Deterministic tick
- `applyAmbient()` → `applyActions()` → `computeResonance()` → `applyRewards()` → `logEvents()`

---

## 9) Economy & LiveOps
- **Daily path (5–7 min):** 3 short objectives, a craft, a dream log chance.  
- **Weekly:** set collections, portal streak bonuses.  
- **Events:** 10‑day festivals with themed decor & song.  
- **Store (optional):** cosmetics only; no energy paywalls.

---

## 10) Content Tables (starter)
### 10.1 Objectives
| ID | Title | Need | Reward |
|---|---|---:|---|
| keepHeat120 | Keep Heat in sweet spot for 120s | 120 | 40 XP + 1 Nettle |
| sing12 | Sing 12 incantations | 12 | 35 XP + 1 Basalt |
| craft2core | Craft 2 Thermal Cores | 2 | 60 XP + 1 Oil |
| portal1m | Keep portal humming for 60s | 60 | 60 XP + 1 DecorShard |
| polish15 | Polish shell 15 times | 15 | 45 XP + 1 Sulfur |

### 10.2 Achievements
| ID | Title | Condition |
|---|---|---|
| firstPet | First Pet | Pet once |
| shinyFriend | Shiny Friend | 20 polishes |
| heatWhisperer | Heat Whisperer | Reach 95% resonance |
| portalWhisper | Portal Whisper | First portal hum |
| emberChef | Ember Chef | Craft 10 cores |

### 10.3 Recipes
| Recipe | Inputs | Output |
|---|---|---|
| Thermal Core | 1 Basalt + 1 Sulfur | 1 Core |
| Tempered Core | 1 Core + 1 Oil | 1 Tempered Core (+resonance duration) |
| Crystal Charm | 3 Shards | 1 Charm (+mood cap) |

---

## 11) Art Direction (fantasy‑cute)
- **Tortie:** round, plush, soft speculars; emissive crack lines; stage silhouettes distinct.  
- **World:** cozy crystals, warm halation, gentle parallax; portal glyphs minimal.  
- **UI:** pills, rounded bars, diegetic labels; subtle particles; calm gradients.

---

## 12) Audio Direction
- **Ambient layers:** low lava rumble, gentle chimes at resonance thresholds.  
- **Petting SFX:** soft, rubbery twinkle; polish shimmer; spell whispers.  
- **Music:** lo‑fi fantasy cues, modulated by day/night.

---

## 13) QA & Telemetry
- Determinism tests for tick math.  
- Stress: long idle resume; battery; perf budgets.  
- KPIs: D1/D7 retention, sessions/day, objective completion rate, time at resonance, craft frequency.

---

## 14) Roadmap
- **Alpha (4 weeks):** core loop, stats, 2 evolutions, 20 objectives, basic art.  
- **Beta (6 weeks):** full evolutions, 40 objectives, decor, audio pass, telemetry.  
- **Launch (4 weeks):** polish, accessibility, event scaffolding, marketing.

---

## 15) Reference Links
- FlashMuseum — Blobzone developer page (archived titles).  
- Newgrounds — Blobzone profile and game list.  
- Reddit — r/blobzone restoration community.  
- Prizee background (French Flash portal, economy & era).

(Direct URLs and citations are provided in the delivery message.)

---

## 16) Appendix: Exact Implementables
- JSON stubs for **Objectives**, **Achievements**, **Recipes** (ready to import).  
- Tuning constants block for stat drifts and thresholds.  
- Save schema and migration notes.  
- Pseudocode for deterministic tick and reward claim pipeline.
