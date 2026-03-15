import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liminal Sin Runtime Status Report",
};

export default function LSRPage() {
  return (
    <>
      <style>{`
        .lsr-wrap {
          --bg-0: #05070d;
          --bg-1: #0b1220;
          --panel: #111a2b;
          --panel-2: #18253d;
          --line: #2a3b5e;
          --text: #e6edf8;
          --muted: #a8b6cf;
          --ok: #22c55e;
          --warn: #f59e0b;
          --accent: #38bdf8;
          --accent-2: #f97316;
          color: var(--text);
          line-height: 1.55;
          background:
            radial-gradient(1200px 500px at 80% -20%, #1f2f56 0%, transparent 60%),
            radial-gradient(900px 400px at -10% 10%, #2a1f52 0%, transparent 55%),
            linear-gradient(180deg, var(--bg-0), var(--bg-1));
          min-height: 100vh;
        }
        .lsr-wrap * { box-sizing: border-box; }
        .lsr-inner { max-width: 1080px; margin: 0 auto; padding: 24px 18px 72px; }
        .lsr-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
        .lsr-brand { font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
        .lsr-link-row a { color: var(--accent); text-decoration: none; font-weight: 600; }
        .lsr-hero { background: linear-gradient(160deg, #0c172c, #12182a 50%, #20162d); border: 1px solid var(--line); border-radius: 14px; padding: 20px; box-shadow: 0 20px 45px rgba(0,0,0,0.35); margin-bottom: 18px; }
        .lsr-hero h1 { margin: 0 0 6px; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; letter-spacing: 0.01em; }
        .lsr-hero .sub { margin: 0; color: var(--muted); }
        .lsr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 18px; }
        .lsr-card { background: linear-gradient(180deg, var(--panel), var(--panel-2)); border: 1px solid var(--line); border-radius: 12px; padding: 14px; }
        .lsr-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 6px; }
        .lsr-value { font-size: 1rem; font-weight: 700; color: var(--text); word-break: break-word; }
        .lsr-ok { color: var(--ok); }
        .lsr-warn { color: var(--warn); }
        .lsr-panel { background: rgba(17,26,43,0.88); border: 1px solid var(--line); border-radius: 12px; padding: 16px; margin-bottom: 14px; }
        .lsr-panel h2 { margin: 0 0 10px; font-size: 1.15rem; color: #dbeafe; }
        .lsr-panel ul { margin: 0; padding-left: 18px; }
        .lsr-panel li { margin: 6px 0; }
        .lsr-panel table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.95rem; }
        .lsr-panel th, .lsr-panel td { text-align: left; padding: 9px 8px; border-bottom: 1px solid #243453; vertical-align: top; }
        .lsr-panel th { color: #bfdbfe; font-weight: 700; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; }
        .lsr-panel a { color: var(--accent); text-decoration: none; }
        .lsr-panel a:hover { text-decoration: underline; }
        .lsr-foot { margin-top: 24px; color: var(--muted); font-size: 0.88rem; border-top: 1px solid #243453; padding-top: 14px; }
        @media (max-width: 640px) {
          .lsr-inner { padding: 18px 12px 56px; }
          .lsr-hero { padding: 16px; }
          .lsr-panel th, .lsr-panel td { padding: 8px 6px; font-size: 0.9rem; }
        }
      `}</style>
      <div className="lsr-wrap">
        <div className="lsr-inner">
          <div className="lsr-top">
            <div className="lsr-brand">Liminal Sin Runtime Report</div>
            <div className="lsr-link-row">
              <Link href="/">Home</Link> |{" "}
              <Link href="/ls">Play</Link> |{" "}
              <Link href="/ls/judges/game">Judges Build</Link>
            </div>
          </div>

          <section className="lsr-hero">
            <h1>Current Project State (Real-Time)</h1>
            <p className="sub">
              Last updated: March 15, 2026. This page tracks the live, contest-ready state of the project.
            </p>
          </section>

          <section className="lsr-grid">
            <article className="lsr-card">
              <div className="lsr-label">Frontend Deploy</div>
              <div className="lsr-value lsr-ok">Live</div>
              <div className="lsr-value">Version ID: 214edaaf-63cb-4ac2-ad72-e09a601a2956</div>
              <div><a href="https://myceliainteractive.digitalartifact11.workers.dev" target="_blank" rel="noopener noreferrer">Workers URL</a></div>
            </article>
            <article className="lsr-card">
              <div className="lsr-label">Backend Deploy</div>
              <div className="lsr-value lsr-ok">Live</div>
              <div className="lsr-value">Cloud Run Revision: liminal-sin-server-00076-njc</div>
              <div><a href="https://liminal-sin-server-1071754889104.us-west1.run.app" target="_blank" rel="noopener noreferrer">Cloud Run URL</a></div>
            </article>
            <article className="lsr-card">
              <div className="lsr-label">Deadline</div>
              <div className="lsr-value lsr-warn">March 16, 2026 at 5:00 PM PDT</div>
              <div>Gemini Live Agent Challenge submission cutoff.</div>
            </article>
          </section>

          <section className="lsr-panel">
            <h2>Most Recent Fixes</h2>
            <ul>
              <li><strong>Bug 4 (Joker card timing):</strong> Fixed. Card overlays now emit with a 3-second delay after scene changes so visuals and narration are synchronized.</li>
              <li><strong>Bug 1 (Jason ignores player speech):</strong> Fixed. Chained auto steps no longer flood Jason with forced text turns.</li>
              <li><strong>Bug 2 (glitch persistence):</strong> Fixed in frontend effect lifecycle.</li>
              <li><strong>Bug 3 (slow motion video):</strong> Fixed with defensive playbackRate and re-encoded clip pipeline.</li>
            </ul>
          </section>

          <section className="lsr-panel">
            <h2>Live Multi-Agent Runtime</h2>
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Model</th>
                  <th>Role</th>
                  <th>Code Reference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Game Master (silent)</td>
                  <td>gemini-live-2.5-flash-native-audio (text modality behavior)</td>
                  <td>Function-call orchestrator: trust/fear/glitch/scene/card events</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/gemini.ts" target="_blank" rel="noopener noreferrer">gemini.ts</a></td>
                </tr>
                <tr>
                  <td>Jason NPC</td>
                  <td>gemini-live-2.5-flash-native-audio</td>
                  <td>Primary speaking NPC with trust and scene-aware responses</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/npc/jason.ts" target="_blank" rel="noopener noreferrer">jason.ts</a></td>
                </tr>
                <tr>
                  <td>Audrey NPC</td>
                  <td>gemini-live-2.5-flash-native-audio</td>
                  <td>Trust-gated secondary NPC (silence below trust threshold)</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/npc/audrey.ts" target="_blank" rel="noopener noreferrer">audrey.ts</a></td>
                </tr>
                <tr>
                  <td>Keyword Listener</td>
                  <td>gemini-live-2.5-flash</td>
                  <td>Step-aware keyword trigger detection for fast progression</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/keywordListener.ts" target="_blank" rel="noopener noreferrer">keywordListener.ts</a></td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="lsr-panel">
            <h2>Google Cloud Proof Points</h2>
            <table>
              <thead>
                <tr>
                  <th>System</th>
                  <th>Status</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cloud Run websocket backend</td>
                  <td className="lsr-ok">Live</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/package.json" target="_blank" rel="noopener noreferrer">deploy scripts in package.json</a></td>
                </tr>
                <tr>
                  <td>Firestore session state</td>
                  <td className="lsr-ok">Live</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/db.ts" target="_blank" rel="noopener noreferrer">db.ts</a></td>
                </tr>
                <tr>
                  <td>GCS still and clip delivery</td>
                  <td className="lsr-ok">Live</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/gameMaster.ts" target="_blank" rel="noopener noreferrer">gameMaster.ts</a></td>
                </tr>
                <tr>
                  <td>Imagen 4 + Veo 3.1 wildcard generation</td>
                  <td className="lsr-ok">Live</td>
                  <td><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/imagen.ts" target="_blank" rel="noopener noreferrer">imagen.ts</a> / <a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/server/services/veo.ts" target="_blank" rel="noopener noreferrer">veo.ts</a></td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="lsr-panel">
            <h2>Canonical Project Docs</h2>
            <ul>
              <li><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/CURRENT_STATE.md" target="_blank" rel="noopener noreferrer">Backend CURRENT_STATE.md</a></li>
              <li><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/docs/SHOT_SCRIPT.md" target="_blank" rel="noopener noreferrer">SHOT_SCRIPT.md (authoritative flow)</a></li>
              <li><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/docs/SHOT_STEPS.md" target="_blank" rel="noopener noreferrer">SHOT_STEPS.md (scene and step registry)</a></li>
              <li><a href="https://github.com/TheSeeker713/liminal-sin-gemini/blob/main/README.md" target="_blank" rel="noopener noreferrer">Backend README.md</a></li>
            </ul>
          </section>

          <div className="lsr-foot">
            This report reflects the current production status as of March 15, 2026 and is updated to match the live backend/frontend deployments.
          </div>
        </div>
      </div>
    </>
  );
}
