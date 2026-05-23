"use client";

import { useState } from "react";

interface CommunityIdea {
  id: number;
  title: string;
  description: string;
}

export default function FeedbackForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [communityIdeas, setCommunityIdeas] = useState<CommunityIdea[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "idea",
    title: "",
    details: "",
  });

  function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.details) return;
    setCommunityIdeas((prev) => [
      ...prev,
      { id: Date.now(), title: form.title, description: form.details },
    ]);
    setFormSubmitted(true);
  }

  return (
    <>
      <style>{`
        .fb-form-wrap {
          max-width: 42rem;
          margin: 0 auto;
          border-radius: 1rem;
          border: 1px solid var(--rm-border);
          background: var(--rm-bg-card);
          padding: 2rem 2rem;
          box-shadow: var(--rm-shadow);
        }
        .fb-label {
          display: block;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--rm-text-muted);
          font-family: 'Orbitron', sans-serif;
          margin-bottom: 0.5rem;
        }
        .fb-input {
          width: 100%;
          background: var(--rm-bg);
          border: 1px solid var(--rm-border);
          color: var(--rm-text);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .fb-input:focus {
          border-color: #7e22ce;
          box-shadow: 0 0 0 3px rgba(126,34,206,0.15);
        }
        .fb-input::placeholder { color: var(--rm-text-sub); }
        .fb-idea-card {
          border-radius: 0.75rem;
          border: 1px solid var(--rm-border);
          background: var(--rm-bg-card2);
          padding: 1rem 1.25rem;
        }
        .fb-idea-card h4 {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--rm-text);
          margin-bottom: 0.25rem;
        }
        .fb-idea-card p {
          font-size: 0.875rem;
          color: var(--rm-text-muted);
          line-height: 1.6;
        }
        .fb-submit-btn {
          width: 100%;
          padding: 0.875rem 1.5rem;
          border-radius: 0.625rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          background: linear-gradient(135deg, #7e22ce, #06b6d4);
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.2s;
        }
        .fb-submit-btn:hover {
          opacity: 0.9;
          box-shadow: 0 0 24px rgba(126,34,206,0.35);
        }
        .fb-success {
          border-radius: 0.75rem;
          border: 1px solid #86efac;
          background: #dcfce750;
          padding: 1rem 1.25rem;
          color: #15803d;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1.25rem;
        }
        [data-theme="dark"] .fb-success {
          background: #14532d30;
          color: #86efac;
          border-color: #16a34a50;
        }
      `}</style>

      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <div className="rm-section-header" style={{ marginTop: "3rem" }}>
          <span className="rm-section-title" style={{ color: "#7e22ce" }}>Submit Your Feedback</span>
          <div className="rm-section-line" style={{ background: "#7e22ce40" }} />
        </div>

        <div className="fb-form-wrap">
          <p style={{ fontSize: "0.9375rem", color: "var(--rm-text-muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Found a bug? Have an idea? Want to see something on this roadmap? Submit it here. All ideas are
            automatically placed into <strong style={{ color: "var(--rm-text)" }}>Not Confirmed</strong> and
            reviewed by the team. You&apos;re welcome to use a fake name or screen name.
          </p>

          {formSubmitted && (
            <div className="fb-success">
              ✅ Received. Your idea has been placed in <strong>Not Confirmed</strong>. Thank you.
            </div>
          )}

          {communityIdeas.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {communityIdeas.map((idea) => (
                <div key={idea.id} className="fb-idea-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.125rem" }}>💡</span>
                    <span style={{ fontSize: "0.625rem", background: "var(--rm-bg-card2)", color: "var(--rm-text-muted)", padding: "0.125rem 0.5rem", borderRadius: "9999px", fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Community Idea
                    </span>
                  </div>
                  <h4>{idea.title}</h4>
                  <p>{idea.description}</p>
                </div>
              ))}
            </div>
          )}

          {!formSubmitted && (
            <form onSubmit={submitFeedback} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label className="fb-label">
                  Name / Screen Name <span style={{ color: "var(--rm-text-sub)", fontWeight: 400 }}>(fake names welcome)</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Anonymous, DarkHorse99, etc."
                  className="fb-input"
                />
              </div>
              <div>
                <label className="fb-label">
                  Email <span style={{ color: "var(--rm-text-sub)", fontWeight: 400 }}>(optional — only if you want a reply)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="fb-input"
                />
              </div>
              <div>
                <label className="fb-label">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="fb-input"
                >
                  <option value="idea">💡 Idea / Feature Request</option>
                  <option value="bug">🐛 Bug Report</option>
                  <option value="issue">⚠️ Issue / Problem</option>
                  <option value="complaint">📣 Complaint</option>
                </select>
              </div>
              <div>
                <label className="fb-label">
                  Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Short title for your submission"
                  className="fb-input"
                  required
                />
              </div>
              <div>
                <label className="fb-label">
                  Details <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  rows={4}
                  placeholder="Describe your idea, bug, or issue in detail..."
                  className="fb-input"
                  style={{ resize: "none" }}
                  required
                />
              </div>

              <p style={{ fontSize: "0.8125rem", color: "var(--rm-text-sub)", lineHeight: 1.65 }}>
                By submitting you agree that your idea may be incorporated into the product roadmap under the{" "}
                <em>Not Confirmed</em> stage. No personally identifiable information is required. This endpoint
                is a placeholder — backend integration is{" "}
                <strong style={{ color: "#d97706" }}>Planned</strong>.
              </p>

              <button type="submit" className="fb-submit-btn">
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
