'use client';

import { useState } from 'react';
import { Button } from '@/app/components/studio/Button';

export default function SignupForms() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Submitting request…' });
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          type: 'access_request',
        }),
      });
      if (res.status === 409) {
        setStatus({ type: 'error', message: 'This email is already registered.' });
        return;
      }
      if (!res.ok) throw new Error('API error');
      setStatus({
        type: 'success',
        message:
          'Request received. If approved, you will receive a private play link within 24 hours.',
      });
      setForm({ name: '', email: '' });
    } catch {
      setStatus({ type: 'error', message: 'Submission failed. Please try again.' });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="studio-card p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-studio-text mb-2">
          Request Prototype Access
        </h3>
        <p className="text-sm text-studio-text-muted mb-6 leading-relaxed">
          The Liminal Sin prototype is available by invitation only. Submit your
          name and email and we will respond within 24 hours with a private play
          link if approved.
        </p>
        <p className="text-xs text-studio-text-muted mb-6">
          Desktop browsers recommended. Mobile play is not supported.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-studio-text mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-studio-text focus:outline-none focus:ring-2 focus:ring-studio-accent/30"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-studio-text mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-studio-text focus:outline-none focus:ring-2 focus:ring-studio-accent/30"
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Submit request
          </Button>
        </form>
      </div>

      {status.message && (
        <p
          className={`text-center text-sm mt-6 p-3 rounded-lg border ${
            status.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : status.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-black/8 bg-white text-studio-text-muted'
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
