"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface Comment {
  id: number;
  text: string;
  created_at: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch("/api/comments");
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as { comments: Comment[] };
      setComments(data.comments);
    } catch {
      setError("Could not load transmissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > 2000 || submitting) return;
      setSubmitting(true);
      setError(null);
      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Submit failed");
        }
        setText("");
        await fetchComments();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Submit failed");
      } finally {
        setSubmitting(false);
      }
    },
    [text, submitting, fetchComments],
  );

  const formatDate = (iso: string) =>
    new Date(iso + "Z").toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="min-h-screen bg-[#08041a] text-white"
      style={{
        fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
      }}
    >
      {/* ── Header ── */}
      <nav className="fixed top-0 z-50 w-full flex items-center justify-between px-6 py-3 bg-black/70 backdrop-blur-md border-b border-purple-900/50">
        <Link
          href="/ls"
          className="text-sm tracking-[0.2em] uppercase text-purple-300/70 hover:text-purple-200 transition-colors"
        >
          &larr; Back to Liminal Sin
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16 space-y-10">
        <header className="text-center space-y-3">
          <p className="text-xs tracking-[0.35em] uppercase text-purple-400/60">
            Anonymous Transmissions
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-white"
            style={{ textShadow: "0 0 20px rgba(255,0,50,0.3)" }}
          >
            Comments
          </h1>
          <p className="text-sm text-gray-400/70 max-w-md mx-auto leading-relaxed">
            Leave a message in the underground. No login required. All visitors
            see the same feed.
          </p>
        </header>

        {/* ── Comment form ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="What did you experience?"
            className="w-full rounded-lg bg-black/60 border border-purple-900/40 text-white placeholder-purple-300/30 px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-400/40">
              {text.length}/2000
            </span>
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              className="px-6 py-2 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-bold tracking-[0.15em] uppercase text-xs hover:from-purple-700 hover:to-purple-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? "Transmitting…" : "Transmit"}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-center text-xs text-red-400/80">{error}</p>
        )}

        {/* ── Comments list ── */}
        <div className="space-y-4">
          {loading && (
            <p className="text-center text-sm text-purple-300/40 py-8">
              Loading transmissions…
            </p>
          )}
          {!loading && comments.length === 0 && (
            <p className="text-center text-sm text-purple-300/40 py-8">
              No transmissions yet. Be the first.
            </p>
          )}
          {comments.map((c) => (
            <article
              key={c.id}
              className="rounded-lg bg-black/40 border border-purple-900/30 px-5 py-4 space-y-2"
            >
              <p className="text-sm text-gray-200/80 leading-relaxed whitespace-pre-wrap break-words">
                {c.text}
              </p>
              <p className="text-[10px] text-purple-400/40 tracking-wider uppercase">
                Anonymous &mdash; {formatDate(c.created_at)}
              </p>
            </article>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full px-6 py-3 bg-black/60 border-t border-purple-900/30 text-center text-[10px] text-purple-300/50 tracking-wide font-mono">
        &copy; {new Date().getFullYear()} Mycelia Interactive &mdash; Prototype
      </footer>
    </div>
  );
}
