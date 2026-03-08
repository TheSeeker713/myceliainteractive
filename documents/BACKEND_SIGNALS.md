# BACKEND_SIGNALS.md � Frontend WebSocket Responsibilities
### Core Sync Reference for the myceliainteractive Frontend
### Version 1.0 | March 7, 2026

## Overview
This document serves as the guide for how the frontend must communicate with the Node.js/Cloud Run backend (liminal-sin-gemini) to support the bimodal Game Master and native voice barge-in capabilities via Gemini Live API.

## 1. Barge-in & Conversational Interruption (VAD)
The backend expects the frontend to manage **Voice Activity Detection (VAD)** locally to reduce server load and latency.
- The frontend must constantly listen via the user's microphone.
- **When the user speaks:** The frontend must immediately dispatch the player_speech event containing the audio buffer. 
- *Crucially*, the arrival of this player_speech buffer is what tells the backend to trigger the **barge-in** interruption if an AI character is currently talking.
- The frontend must be ready to receive the `agent_interrupt` WebSocket event in return and immediately halt playing any queued TTS audio chunks.

## 2. Bimodal Game Master "Vision"
The backend relies on the frontend to provide the "eyes" of the Game Master.
- The frontend must capture a frame from the user's active webcam exactly **once per second (1 FPS)**.
- Convert this frame to a Base64 JPEG.
- Emit the player_frame WebSocket event with this payload.
- Do **not** send frames faster than 1 FPS, as this will quickly burn through the Google Cloud Token Budget.

## 3. Handling State Changes
The backend routes changes asynchronously based on Gemini function calls. The frontend should passively listen for:
- `trust_update`: To visually update the HUD trust indicator.
  <!-- DEFERRED: glasses overlay — smart glasses system deferred to roadmap (March 7, 2026) -->
- `hud_glitch`: To trigger CSS/canvas glitch effects over the user's screen.
<!-- DEPRECATED (March 7, 2026): mv_trigger (also mismatched as fmv_trigger in TEAM_CONTRACT.md) — FMV pipeline replaced by Imagen 3 live generation. -->
<!-- - mv_trigger: To change the background video loop. -->
- `scene_change`: To render an Imagen 3 generated static scene background. ← **PENDING FORMAL DEFINITION** in TEAM_CONTRACT.md

*Remember: The frontend is a dumb terminal. Do not run any game logic or trust calculations locally.*
