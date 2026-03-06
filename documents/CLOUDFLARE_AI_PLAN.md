# CLOUDFLARE AI INTEGRATION PLAN
## Mycelia Interactive Frontend — Marketing & Assets
### Version 1.0 | March 5, 2026
### Context: Mycelia Interactive (Frontend Repo)

---

## 1. Overview
As established in `TEAM_CONTRACT.md`, Cloudflare Workers AI is strictly cleared for use on the **frontend marketing shell and UI assets (`/ls`)**. It must NOT be used for core game agent logic (which belongs to Gemini).

This document outlines the technical plan for integrating Cloudflare Workers AI into the Next.js/Workers architecture to generate dynamic atmospheric assets for the Liminal Sin marketing page.

## 2. Target Use Cases & Models

| Asset Type | Primary Model | Purpose |
|---|---|---|
| **Ambient Voiceover** | `@cf/deepgram/aura-2-en` | Generate creepy, distant, or glitchy atmospheric dialogue clips dynamically for the landing page without needing manual voice recordings. |
| **Atmospheric Images** | `@cf/black-forest-labs/flux-1-schnell` | Generate glitchy, liminal background textures or teaser images on the fly (or cached) based on player interactions with the marketing shell. |
| **Dynamic Copy (Optional)** | `@cf/meta/llama-3-8b-instruct` | Small localized text mutations (e.g., changing the lore text subtly on reload to create an unsettling "Mandela effect" for returning visitors). |

## 3. Implementation Steps

### Phase 1: Infrastructure Binding
To use Workers AI, we must bind the AI service to our Cloudflare Worker environment.

1. **Update `wrangler.toml` or `wrangler.jsonc`**:
   ```toml
   [ai]
   binding = "AI"
   ```
2. **Update Type Definitions (`workers/globals.d.ts`)**:
   ```typescript
   export interface Env {
     // ... existing database/email bindings
     AI: any; // Cloudflare Workers AI Binding
   }
   ```

### Phase 2: Worker API Endpoints
We will create secure edge functions that interact with the AI binding so that API logic is not leaked to the browser.
1. Create a dedicated AI router or add to the existing API structure (e.g., `workers/ai-api.ts`).
2. **TTS Endpoint (`GET /api/ai/tts`)**:
   Accepts text and returns an audio stream (buffer).
3. **Image Endpoint (`GET /api/ai/image`)**:
   Accepts a visual prompt and returns a generated image buffer.

**Example Implementation Pattern (Worker):**
```typescript
app.get('/api/ai/tts', async (c) => {
  const text = c.req.query('text') || "You shouldn't be down here.";
  const response = await c.env.AI.run('@cf/deepgram/aura-2-en', {
    text: text,
    voice: "aura-asteria-en" // Check CF docs for desired creepy voice profile
  });
  
  return new Response(response, {
    headers: { 'Content-Type': 'audio/wav' }
  });
});
```

### Phase 3: Next.js Client Integration
1. **Caching Strategy**: AI generation costs compute. For the landing page, we should generate these assets on build/SSR or cache them heavily at the edge using Cloudflare Cache API, unless the feature requires real-time uniqueness.
2. **Frontend Wiring**: Next.js components call `/api/ai/...` via standard `fetch`.

## 4. Security & Compliance Checks
- **Rate Limiting**: AI endpoints must be heavily rate-limited to avoid abuse (e.g., bots generating 1,000 images and driving up our CF bill).
- **Hard Contest Boundary**: Ensure NO game agent (Jason, Audrey, Josh, Game Master) references or calls `c.env.AI`. Game agents strictly live in the `liminal-sin-gemini` repo using the Google ADK.
