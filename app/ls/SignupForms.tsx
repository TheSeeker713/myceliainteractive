'use client';
import { useState } from 'react';
import { CTAButton } from '@/components/Hero';

export default function SignupForms() {
  const [judgeForm, setJudgeForm] = useState({ name: '', email: '' });
  const [testerForm, setTesterForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleJudgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Encrypting connection...' });
    // This will hit the Step 5 API later
    setTimeout(() => {
      setStatus({ type: 'success', message: 'Judge access logged successfully.' });
      setJudgeForm({ name: '', email: '' });
    }, 1000);
  };

  const handleTesterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Encrypting connection...' });
    // This will hit the Step 5 API later
    setTimeout(() => {
      setStatus({ type: 'success', message: 'Tester position reserved. Awaiting origin coordinates.' });
      setTesterForm({ name: '', email: '' });
    }, 1000);
  };

  return (
    <div className="w-full space-y-12">
      {/* GLOBAL DISCLAIMER */}
      <div className="max-w-2xl mx-auto rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-center mb-8">
        <p className="text-red-300 text-sm font-light">
          <strong className="font-bold text-red-400 block mb-1 uppercase tracking-widest">System Alert</strong>
          We do not care about your identity. We are only interested in your choices. 
          Using fake names, pseudonyms, or encrypted aliases is highly encouraged.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Judge Form */}
        <div className="rounded-xl border border-hero-cyan-500/30 bg-hero-bg-default/40 backdrop-blur-md p-6 sm:p-8 flex flex-col">
          <h3 className="text-2xl font-bold text-hero-cyan-300 mb-2">Contest Judges</h3>
          <p className="text-cyan-100/70 text-sm mb-6">Optional registry for full systemic clearance. Gain VIP review access when the portal unlocks.</p>
          <form onSubmit={handleJudgeSubmit} className="space-y-4 mt-auto">
            <div>
              <label className="block text-xs font-medium text-cyan-200 uppercase tracking-wider mb-1">Alias / Call Sign</label>
              <input 
                type="text" 
                required
                value={judgeForm.name}
                onChange={(e) => setJudgeForm({...judgeForm, name: e.target.value})}
                className="w-full bg-hero-bg-dark/80 border border-hero-cyan-900 rounded p-3 text-cyan-50 focus:border-hero-cyan-400 focus:outline-none focus:ring-1 focus:ring-hero-cyan-400 transition-colors"
                placeholder="Enter your handle" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cyan-200 uppercase tracking-wider mb-1">Comm-Link (Email)</label>
              <input 
                type="email" 
                required
                value={judgeForm.email}
                onChange={(e) => setJudgeForm({...judgeForm, email: e.target.value})}
                className="w-full bg-hero-bg-dark/80 border border-hero-cyan-900 rounded p-3 text-cyan-50 focus:border-hero-cyan-400 focus:outline-none focus:ring-1 focus:ring-hero-cyan-400 transition-colors"
                placeholder="signal@network.com" 
              />
            </div>
            <button type="submit" className="w-full mt-4 bg-transparent border border-hero-cyan-400 text-hero-cyan-300 hover:bg-hero-cyan-900/40 font-semibold py-3 px-4 rounded transition-all">
              Authorize Clearance
            </button>
          </form>
        </div>

        {/* Tester Form */}
        <div className="rounded-xl border border-hero-magenta-500/30 bg-hero-bg-default/40 backdrop-blur-md p-6 sm:p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-hero-magenta-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">
            Limit: 30 Slots
          </div>
          <h3 className="text-2xl font-bold text-hero-magenta-300 mb-2">Beta Subjects</h3>
          <p className="text-magenta-100/70 text-sm mb-6">Volunteer to test the psychological payload. Slots are strictly limited to the first 30 suitable candidates.</p>
          <form onSubmit={handleTesterSubmit} className="space-y-4 mt-auto">
            <div>
              <label className="block text-xs font-medium text-magenta-200 uppercase tracking-wider mb-1">Subject Designation</label>
              <input 
                type="text" 
                required
                value={testerForm.name}
                onChange={(e) => setTesterForm({...testerForm, name: e.target.value})}
                className="w-full bg-hero-bg-dark/80 border border-hero-magenta-900 rounded p-3 text-magenta-50 focus:border-hero-magenta-400 focus:outline-none focus:ring-1 focus:ring-hero-magenta-400 transition-colors"
                placeholder="Anon-01" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-magenta-200 uppercase tracking-wider mb-1">Drop Point (Email)</label>
              <input 
                type="email" 
                required
                value={testerForm.email}
                onChange={(e) => setTesterForm({...testerForm, email: e.target.value})}
                className="w-full bg-hero-bg-dark/80 border border-hero-magenta-900 rounded p-3 text-magenta-50 focus:border-hero-magenta-400 focus:outline-none focus:ring-1 focus:ring-hero-magenta-400 transition-colors"
                placeholder="shadow@network.com" 
              />
            </div>
            <button type="submit" className="w-full mt-4 bg-hero-magenta-600 hover:bg-hero-magenta-500 text-white font-semibold py-3 px-4 rounded transition-all shadow-[0_0_15px_rgba(139,44,245,0.3)] hover:shadow-[0_0_25px_rgba(139,44,245,0.5)]">
              Submit Application
            </button>
          </form>
        </div>
      </div>

      {status.message && (
        <div className="text-center w-full max-w-sm mx-auto p-3 rounded-lg border border-cyan-500/50 bg-cyan-900/20 text-cyan-200 animate-pulse mt-8">
          {status.message}
        </div>
      )}

    </div>
  );
}
