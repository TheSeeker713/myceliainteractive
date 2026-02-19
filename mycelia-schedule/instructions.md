# Mycelia Schedule

**App Name:** Mycelia Schedule  
**Live Domain:** lnc.myceliainteractive.com (PWA installable on every device)  
**GitHub Repo:** github.com/theseeker713/mycelia-schedule  
**Owner:** @theseeker713  
**Launch Target:** Live and fully functional by end of March 2026  
**Start Date for Preset Schedule:** Friday, February 20, 2026 (MST)  

## Vision & Purpose (Why This App Exists)

Mycelia Schedule is your personal ADHD war room and money-making command center. It was built specifically for Seeker (@MyceliaINT / Paradigm) to:  
- Generate income ASAP through freelance AI video work (creation, editing, ads, music videos like The S33k3r Transmission)  
- Protect daily deep work on Project LNC (point-and-click FMV immersive game — target: fully playable prototype in 6 weeks)  
- Lock in 1.5 hours of Maestro University growth every single day  
- Beat ADHD overwhelm with time-blocking + Pomodoro + intentional task-switching + rotating blocks + auditory dopamine cues  
- Feel like a glowing, minimalist Mycelia Interactive product — bright, cyber-neon, empowering, never cluttered  

Everything is mobile-first, works offline, installs as a PWA on Android, iOS, iPadOS, Windows, macOS, Linux, ChromeOS. No dark mode ever. Only the official Mycelia Interactive color scheme.

**Core Working Windows (MST, Albuquerque):**  
- Morning: 7:30 AM – 12:00 PM  
- Afternoon: 2:00 PM – 7:00 PM  
Lunch/recharge buffer 12:00–2:00 PM is sacred and free.

## Tech Stack & Cloudflare Free-Tier Power-Ups

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript  
- **Styling:** Tailwind CSS 4  
- **Hosting:** Cloudflare Pages  
- **Database:** Cloudflare D1 (SQLite) — 500 MB + 5M reads/day free  
- **Object Storage:** Cloudflare R2 — 10 GB storage + 1M Class A / 10M Class B ops/month, zero egress  
- **Real-time Sync:** RealtimeKit (Beta — currently 100% free)  
- **Persistent Timer:** Durable Objects (free tier)  
- **Background Jobs:** Queues (10k ops/day free)  
- **AI:** Workers AI (10 000 neurons/day free) — Llama 3.1-8b-instruct-fast, gpt-oss-20b, Whisper models  
- **Caching:** Workers KV (1 GB free) + Hyperdrive for D1 acceleration  
- **Images:** Cloudflare Images (5k transformations/month free)  
- **Audio Delivery:** R2 + Howler.js / native Audio API for looping MP3s  
- **PWA:** Built-in Next.js manifest + service worker (installable everywhere)  
- **Version Control:** GitHub @theseeker713  

All features below stay comfortably inside free tiers.

## UI/UX Principles (Minimalist, Mobile-First, Mycelia Aesthetic)

- **Color Palette:**  
  Primary neon cyan: #00f0ff (with glow shadow)  
  Accent magenta: #ff00aa  
  Background: soft gradient #f8f0ff → #e0d0ff (bright, vibrant, never harsh)  
  Text: deep indigo with cyan glow highlights  
  Circuit accents: subtle animated glowing lines on active elements  

- **Mobile-First Hierarchy:** Phone → Tablet/iPad → Desktop  
- **Minimalist Rule:** Only ONE main view visible at a time. Everything else hides automatically when a new panel/drawer opens.  
- **Navigation:** Bottom tab bar on phones (Schedule | Notes | AI Coach | Active Timer). Floating cyan + button for quick actions.  
- **Interactions:** Slide-up sheets, tap-to-expand, one-tap start/skip/next. Confetti + soft sound on completions.  
- **Accessibility:** Huge touch targets, high contrast, voice-over friendly.

## Calendar & Views

- **Day View (default):** Vertical timeline 7:30 AM–7 PM, color-coded blocks, live Pomodoro ring.  
- **Week View:** Horizontal scroll, shows rotating block order for the week.  
- **Month View:** Grid for Feb, March, April, May 2026 with mini heat-map of completed blocks.  
- Auto-populates recurring schedule from Feb 20 2026 onward. Drag-to-reschedule supported but discouraged (ADHD structure wins).

## Core Scheduling Engine & Full Daily Schematic

**Base Daily Structure** (repeats every day starting Friday Feb 20 2026)

**Morning (7:30 AM – 12:00 PM)**  
- 7:30 – 7:45 AM → Daily Kickoff (15 min) – voice note + AI plan suggestion  
- 7:45 – 9:00 AM → Freelance Sprint 1 (75 min = 3×25 Pomodoro)  
- 9:00 – 10:30 AM → Maestro University (90 min = 3×25 + 15 min built-in break)  
- 10:30 – 11:45 AM → LNC Deep Work 1 (75 min = 3×25)  
- 11:45 – 12:00 PM → Morning Review (15 min) – log wins  

**Afternoon (2:00 PM – 7:00 PM)**  
- 2:00 – 3:15 PM → Freelance Sprint 2 (75 min = 3×25)  
- 3:15 – 4:45 PM → LNC Deep Work 2 (90 min = 3×25 + 15 min break)  
- 4:45 – 5:00 PM → Switch Buffer (15 min) – stretch + voice-note dump  
- 5:00 – 6:15 PM → Freelance Sprint 3 (75 min = 3×25)  
- 6:15 – 7:00 PM → LNC Wrap & Wins (45 min = 1×25 + ship log)  

**Daily Totals**  
- Maestro University: exactly 1.5 h  
- Project LNC: 3.5 h (protected creative time)  
- Freelance AI Video: 3.75 h (money engine)  
- Buffers + planning: 1 h  

**Random Task Switching Per Day (ADHD Dopamine Rotation)**  
To prevent hyperfocus burnout and keep novelty high, the order of the three main roles (Freelance, Maestro, LNC) rotates randomly each day.  
- The engine uses a simple 6-pattern cycle (or Workers AI suggestion) so no two days feel the same.  
- Example patterns (auto-assigned):  
  - Day 1 (Feb 20): Freelance → Maestro → LNC  
  - Day 2: LNC → Freelance → Maestro  
  - Day 3: Maestro → LNC → Freelance  
  - Day 4: Freelance → LNC → Maestro  
  - Day 5: LNC → Maestro → Freelance  
  - Day 6: Maestro → Freelance → LNC  
- Inside each block you can still micro-switch tasks (e.g., “create video” → “edit video”) via quick-add buttons.  
- This rotation is visible in Week View and can be overridden manually.

## Active voice listening tool
user says "hey Kaia", tool listens, "stop" - alarm stops


## Pomodoro & Active Timer System

- Default: 25 min work / 5 min break (adjustable per block)  
- Longer break every 4 Pomodoros  
- Circular glowing cyan progress ring with pulse animation  
- Persistent across devices via Durable Objects + RealtimeKit  
- Auto-alerts on every start/end/switch

## Audio Alerts System (ElevenLabs MP3s)

All MP3s stored in R2 `/alerts/` folder. Short (3–8 sec), calm futuristic caring female voice, light cyber reverb. Use Howler.js for reliable looping where noted.

**Full List of Voice Prompts & Filenames:**

**Schedule & Timer Alerts**  
1. `kickoff-start.mp3` — "Good morning Seeker, new day unlocked. Let's plan and crush it."  
2. `freelance-sprint-start.mp3` — "Freelance sprint time, Seeker — create, edit, ship those AI videos and get paid."  
3. `maestro-start.mp3` — "Maestro University block starting — 90 minutes of pure growth mode."  
4. `lnc-start.mp3` — "Project LNC time — let's build that FMV prototype, one beautiful frame at a time."  
5. `pomodoro-end.mp3` — "Pomodoro complete, Seeker. Take five, you’re doing amazing." (soft loop during break)  
6. `block-complete.mp3` — "Block complete. Take a breath, stretch, and get ready for the next win."  
7. `daily-wins.mp3` — "Day wrapped, Seeker. You shipped hard today — proud of you." (plays at 7:00 PM)  
8. `switch-buffer.mp3` — "Switch time, Seeker. Move your body, hydrate, reset that beautiful mind."

**Notes Module Alerts**  
9. `notes-open.mp3` — "Notes open, Seeker — whatever’s on your mind, let it flow."  
10. `voice-transcribe-start.mp3` — "Voice capture on — talk to me, I’m listening."  
11. `voice-transcribe-end.mp3` — "Transcription complete. Everything saved and synced across all your devices."  
12. `notes-autosave.mp3` — "Note saved and synced. You’re safe, Seeker." (soft chime)  
13. `notes-ai-process.mp3` — "AI just processed your note — tasks extracted and added to tomorrow’s schedule."

## Notes Module (Full Specification)

- Full-screen editor (slides up on mobile, side panel on desktop)  
- Huge tappable textarea with cyan glowing cursor  
- Persistent mic button (bottom right) → Web Speech API (free, instant) or toggle to Whisper (41 neurons/min)  
- Auto-save every keystroke or 2-second pause → D1 + RealtimeKit + localStorage  
- One-tap export bar: .md | .txt | HTML (copy-paste ready for Google Docs)  
- AI toolbar: Summarize | Extract Tasks (auto-adds to schedule) | Turn into Freelance Ideas | Semantic Search  
- Note history list (collapsible on mobile) with date + title + tags  

## Free AI Features (Workers AI – all under 10k neurons/day)

- Daily AI Coach: “Plan my day” or “Rotate for max flow”  
- Note-to-Task extractor  
- Semantic search across all notes (Vectorize)  
- End-of-day wins recap  
- Gentle motivational nudges inside blocks  

## Data Persistence & Offline Support

- D1 for history and settings  
- R2 for audio files  
- RealtimeKit for live timer/notes sync  
- Durable Objects for persistent Pomodoro state  
- Service worker for full offline timer + notes (syncs on reconnect)  

## Folder Structure (Suggested)

```
/app
  /api          ← Workers routes for AI, audio, etc.
/components
  /ScheduleView
  /NotesEditor
  /TimerRing
  /AICoach
/data
  /daily-template.ts
  /rotation-patterns.ts
/public
  /alerts      ← fallback MP3s (synced to R2)
/lib
  /cloudflare  ← D1, R2, AI helpers
```

## Implementation Phases (1–2 person sprint)

1. Core layout + timer + audio (1 week)  
2. Schedule engine + rotation + calendar views (1 week)  
3. Notes module + mic + exports + AI (1 week)  
4. Polish, PWA, testing on all devices (1 week)  

## Getting Started (Dev)

```bash
git clone https://github.com/theseeker713/mycelia-schedule.git
cd mycelia-schedule
pnpm install
# Upload ElevenLabs MP3s to R2 bucket "alerts"
pnpm dev
```

==============================
# MYCELIA INTERACTIVE  
## THE NEXUS CHRONICLES (LNC) — Master Development Plan  
**Working Title:** THE NEXUS CHRONICLES (LNC) — First Transmission  
**Big Picture Project:** CHRONAEA (holographic full-sensory multiverse experiences)  
**Creator:** Paradigm (@MyceliaINT)  
**Date:** February 18, 2026  
**Version:** 1.0  

### 1. Vision & Scope  
The Nexus Chronicles is a live-action FMV point-and-click adventure set in the S33k3r’s alt-reality transmissions. Players control a consistent live-action protagonist (you or S33k3r-style avatar) in a seamless cinematic world — every walk, click, and branching choice feels like steering a Hollywood movie.  

**MVP Goal (4–6 weeks):** 1 episode (5–8 scenes, 15–25 clips, 2–3 endings, 4–6 branching paths). Playable in browser, free on itch.io, “pay what you want” + Patreon early-access tiers.  
**Long-term:** Episodic transmissions → full CHRONAEA holographic prototypes (Unity XR later).  

**Success Metrics:**  
- 500+ playtesters in first month  
- $500–$2,000 freelance + itch/Patreon revenue  
- One-page funding deck ready for backers  

### 2. Tools & Pipeline (Zero Extra Cost)  
| Phase              | Primary Tool                  | Support Tools                  | Output                          |
|--------------------|-------------------------------|--------------------------------|---------------------------------|
| Character/Scene    | Morphic Studio + Imagine      | SuperGrok/Gemini prompts       | Consistent live-action clips    |
| Audio              | ElevenLabs + Suno Pro         | DaVinci Resolve layering       | Dialogue, music, SFX            |
| Editing & Looping  | DaVinci Resolve (free)        | —                              | Seamless loops + matched cuts   |
| Story Mapping      | Arcweave + Obsidian           | CHRONAEA-Canon vault           | Visual branches & bible         |
| Game Assembly      | VSCode + GitHub Copilot       | Google AI Studio (Gemini)      | HTML5 seamless web player       |
| Polish & Export    | DaVinci Resolve               | Browser testing                | itch.io HTML5 build             |

**FMV Sprite Pipeline (Looping Playable Character)**  
1. Morphic Studio → Train Character Model (5–25 reference images) → Generate 3–10s idle/walk/interact clips with identical lighting/style.  
2. DaVinci Resolve → Duplicate clip → overlap 0.5–1s → cross-dissolve or reverse second half → export WebM with alpha (transparent).  
3. VSCode → Copilot prompt: “HTML5 full-screen player with background video + transparent looping sprite video overlay + dynamic JSON hotspots.”  

**Seamless Experience Rule**  
Every clip ends on a frame that exactly matches the next clip’s start frame. Preload all <video> elements. JavaScript swaps instantly → player never sees a break. Result: one continuous live-action film you control.

### 3. Story & Worldbuilding System (No Hallucinations)  
- **Obsidian Vault:** “CHRONAEA-Canon”  
  - Folders: Characters, Locations, Timelines, Multiverse Rules, Episodes  
  - Master Canon note + Canvas for visual multiverse graph  
- **Arcweave:** One project per episode → Boards = scenes → Connections = choices → Variables = inventory/reality state  
- **Canon Helper Rule:** Every AI prompt starts with “Using ONLY this canon excerpt: [paste 1–2 pages]…”  

**MVP Narrative Scope**  
- 5–8 scenes (30–90s each)  
- 2–3 choices per scene  
- 4–6 total paths  
- 3 endings (good shift / bad shift / cliffhanger teaser)  

### 4. ADHD-Optimized Daily Schedule (9.5-hour windows)  
**Fixed:** 7:30–9:00am — Maestro University (1.5 hrs non-negotiable)  

**Morning Block (9:05–11:55am)** — 4 × 25/5 Pomodoro (one focused task)  
**Afternoon Block (2:00–6:40pm)** — 5 × 25/5 or 50/10 Pomodoro (task-switch every 2 blocks)  
**Daily Close (6:45–7:00pm)** — 15-min review: “What shipped? 3 priorities for tomorrow.” + Suno victory track  

**Weekly Theme (repeat until MVP)**  
- Mon/Wed/Fri: Story & Mapping (Arcweave + Obsidian)  
- Tue/Thu: Video Generation (Morphic + ElevenLabs)  
- Sat: Editing & Code (DaVinci + VSCode)  
- Sun: Freelance + Playtest + Review  

**Freelance Block (daily 2 Pomodoros in afternoon):** Post/reply to 1–2 gigs using HydroElite template → $50–$200 quick wins.

### 5. 4-Week MVP Roadmap  
**Week 1: Foundation**  
- Canon Bible + Arcweave full episode map  
- Train protagonist model + 20 test clips  
- Launch Fiverr/X freelance profile (aim $300–$800)  

**Week 2: Core Clips & Sprite**  
- Generate all scene + sprite clips  
- DaVinci: all matched cuts + transparent loops  
- VSCode: first HTML5 player with sprite overlay  

**Week 3: Branching & Inventory**  
- Implement JSON hotspots + state tracking  
- Add inventory (clickable video thumbnails)  
- Test seamless transitions  

**Week 4: Polish, Launch & Funding**  
- Final color/grading pass  
- itch.io page + embed  
- X playtest thread + Google Form feedback  
- Gemini-generated one-page funding deck  

### 6. Monetization Plan  
- **Immediate (Week 1):** AI video ads/services on X/Fiverr ($300–$800/month)  
- **Week 3+:** itch.io “name your price” + Patreon $5 early-transmission tier  
- **Post-MVP:** Episode subscriptions, Discord community passes, XR demo grants  

**Market Evidence:** FMV narrative games reached 1,000+ reviews ($150k+) on Steam in 2025; itch.io HTML5 FMV titles already exist and play instantly.

### 7. Funding & Documentation Package  
Use Gemini + your Canon Bible to generate:  
1. One-page executive summary  
2. MVP tech spec + screenshots  
3. 3-year roadmap (web → holographic)  
4. Financial model (freelance bridge + subs)  
Host on free Carrd or itch devlog.

### 8. Immediate Next Steps (Today)  
1. Create Obsidian vault + first Canon note  
2. Morphic: train protagonist model + export first 10s idle loop  
3. DaVinci: make it seamless + transparent  
4. VSCode: new folder “LNC-MVP” → Copilot prompt for HTML5 player  
5. Post one freelance offer on X  
6. Set phone timer for first 25-min Pomodoro  

**Daily Mantra:** “One transmission per day. The multiverse is built one seamless clip at a time.”

---

**Appendix: Copilot Prompts Library**  
(Full list of ready-to-paste prompts for sprite, player, hotspots, etc.)

**Tracking Sheet:**  
- [ ] Episode map complete  
- [ ] 25 clips generated  
- [ ] First playtest link live  