# CURRENT_STATE.md — myceliainteractive (Frontend)

> Setup-phase working memory for frontend execution.
> Last updated: March 11, 2026.

---

## Scope

- This document contains frontend TODO checklist items and execution instructions only.
- Do not place backend implementation steps here.
- Setup phase only: planning and checklist alignment, no coding in this step.

---

## Deadlines

- Soft deadline: Friday, March 13, 2026 at 7:13 PM.
- Hard deadline: March 16, 2026 at 5:00 PM PDT.

---

## Line-Length Policy

- Global no-god-code policy remains active.
- Standard source-file caps remain 300/400-line policy per module category.
- Exception files allowed up to 800 lines:
	- CURRENT_STATE.md
	- README.md
	- AGENTS.md
	- docs/SHOT_SCRIPT.md

---

## Phase B Plan — Split Execution Workflow

- [ ] Run two VS Code windows in parallel for delivery.
- [ ] Frontend window: myceliainteractive handles frontend checklist items only.
- [ ] Backend window: liminal-sin-gemini handles backend checklist items only.
- [ ] Keep ownership strict: no cross-window implementation edits.
- [ ] Sync only through documented WS contract and CURRENT_STATE status deltas.

### Frontend Window Instructions (This Repo)

- This window executes frontend-only tasks from this document.
- Prioritize Trust Meter, Hint UX, and End States in defined order.
- Keep gameplay presentation aligned with SHOT_SCRIPT pacing and tone.
- Report progress by checking boxes in this frontend file only.

---

## Frontend TODO Checklist (SHOT_SCRIPT-Aligned)

### Phase 1-3 Flow and Prompting

- [ ] Implement permission gate flow before intro cinematic starts.
- [ ] Ensure player_speak_prompt is the activation trigger for first speak hint.
- [ ] Keep onboarding and intro sequence behavior aligned with SHOT_SCRIPT timing.

### Trust Meter (Permanent UI)

- [ ] Add permanent lower-right Trust Meter widget.
- [ ] Render TRUST and FEAR bars from trust_update values (0.0-1.0).
- [ ] Add slow pulse animation independent of fill updates.
- [ ] Keep meter hidden before player_speak_prompt; activate at prompt event.

### Hint and Notification UX

- [ ] Convert hint behavior to event-driven display (player_speak_prompt).
- [ ] Use fade-in/hold/fade-out animation for hint lifecycle.
- [ ] Ensure camera status notices auto-dismiss and do not persist as sticky HUD items.

### Audio and Intro Polish

- [ ] Add intro wind key usage for cinematic open.
- [ ] Add timed descent sting near intro transition end.
- [ ] Keep scene transition SFX convention consistent (glitch_low behavior).

### Card Mechanic and Dread Flow

- [ ] Support card_discovered visual reveal flow for card1 and card2.
- [ ] Support card_collected messaging path from frontend to backend.
- [ ] Add dread timer presentation and escalating tension behavior.

### End States

- [ ] Implement GAME OVER visual/audio flow for timer expiry outcome.
- [ ] Implement GOOD ENDING visual/audio flow for successful outcome.
- [ ] Add post-ending media stop control path.

---

## Frontend Execution Instructions

- Execute checklist in small, isolated increments.
- Keep lore and tone aligned with SHOT_SCRIPT and AGENTS requirements.
- Do not merge backend logic into frontend files.
- When splitting files for line-cap compliance, preserve behavior exactly.
- Update this document using concise status deltas only.

---
