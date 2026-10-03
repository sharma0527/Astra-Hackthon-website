import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, Loader2, ArrowRight, 
  Home, Copy, Check, Upload, ShieldCheck, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { paymentConfig } from '../data/eventConfig';

interface RegistrationSectionProps {
  onGoToTrack?: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({ onGoToTrack }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: '4', // Collegiate: 4 or 5
    // Team Lead
    leadName: '',
    leadEmail: '',
    leadRoll: '',
    leadBranch: 'CSE',
    leadYear: '3rd Year',
    leadPhone: '',
    // Member 2
    m2Name: '',
    m2Email: '',
    m2Roll: '',
    m2Branch: 'CSE',
    m2Year: '3rd Year',
    m2Phone: '',
    // Member 3
    m3Name: '',
    m3Email: '',
    m3Roll: '',
    m3Branch: 'CSE',
    m3Year: '3rd Year',
    m3Phone: '',
    // Member 4
    m4Name: '',
    m4Email: '',
    m4Roll: '',
    m4Branch: 'CSE',
    m4Year: '3rd Year',
    m4Phone: '',
    // Member 5
    m5Name: '',
    m5Email: '',
    m5Roll: '',
    m5Branch: 'CSE',
    m5Year: '3rd Year',
    m5Phone: '',
    // Payment
    utrNumber: ''
  });

  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotMime, setScreenshotMime] = useState<string>('image/jpeg');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  
  const [successInfo, setSuccessInfo] = useState<{
    registrationId: string;
    teamName: string;
    leadEmail: string;
    utr: string;
  } | null>(null);

  const parsedSize = parseInt(formData.teamSize, 10);

  useEffect(() => {
    if (successInfo) {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#4facfe', '#7928ca', '#ffffff']
      });
    }
  }, [successInfo]);

  // Image Upload & Canvas Compression for instant <200KB upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select an image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setErrorMsg('');
      setPreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1280;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setScreenshotBase64(compressed);
          setScreenshotMime('image/jpeg');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshotBase64('');
    setPreviewUrl('');
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(paymentConfig.friendUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const copyRegistrationId = () => {
    if (successInfo?.registrationId) {
      navigator.clipboard.writeText(successInfo.registrationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUtr = formData.utrNumber.trim().replace(/\D/g, '');
    if (!cleanUtr || cleanUtr.length < 10) {
      setErrorMsg('Please enter a valid 12-digit UTR / UPI Reference Number.');
      return;
    }

    if (!screenshotBase64) {
      setErrorMsg('Payment picture is required. Please upload your transaction screenshot.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        teamName: formData.teamName,
        teamSize: parsedSize,
        // Lead
        leadName: formData.leadName,
        leadEmail: formData.leadEmail,
        leadRoll: formData.leadRoll,
        leadBranch: formData.leadBranch,
        leadYear: formData.leadYear,
        leadPhone: formData.leadPhone,
        // Member 2
        m2Name: formData.m2Name,
        m2Email: formData.m2Email,
        m2Roll: formData.m2Roll,
        m2Branch: formData.m2Branch,
        m2Year: formData.m2Year,
        m2Phone: formData.m2Phone,
        // Member 3
        m3Name: formData.m3Name,
        m3Email: formData.m3Email,
        m3Roll: formData.m3Roll,
        m3Branch: formData.m3Branch,
        m3Year: formData.m3Year,
        m3Phone: formData.m3Phone,
        // Member 4
        m4Name: formData.m4Name,
        m4Email: formData.m4Email,
        m4Roll: formData.m4Roll,
        m4Branch: formData.m4Branch,
        m4Year: formData.m4Year,
        m4Phone: formData.m4Phone,
        // Member 5
        m5Name: parsedSize >= 5 ? formData.m5Name : '',
        m5Email: parsedSize >= 5 ? formData.m5Email : '',
        m5Roll: parsedSize >= 5 ? formData.m5Roll : '',
        m5Branch: parsedSize >= 5 ? formData.m5Branch : '',
        m5Year: parsedSize >= 5 ? formData.m5Year : '',
        m5Phone: parsedSize >= 5 ? formData.m5Phone : '',
        // Payment
        utrNumber: cleanUtr,
        screenshotBase64: screenshotBase64,
        screenshotMime: screenshotMime
      };

      const response = await fetch(paymentConfig.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          setErrorMsg('Apps Script is running an outdated deployment. Please update Apps Script: Deploy ➔ Manage deployments ➔ Edit ➔ New version ➔ Deploy.');
          setLoading(false);
          return;
        }
        throw new Error('Server returned unexpected format: ' + responseText.slice(0, 100));
      }

      if (data.status === 'success') {
        setSuccessInfo({
          registrationId: data.registrationId,
          teamName: data.teamName,
          leadEmail: data.leadEmail,
          utr: data.utr || cleanUtr
        });
      } else {
        setErrorMsg(data.message || 'Payment verification failed. Please check your payment details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while reaching verification server. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const branchOptions = ['CSE', 'ECE', 'AIML', 'DS', 'IT', 'DIPLOMA'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // SUCCESS SCREEN
  if (successInfo) {
    return (
      <section className="py-16 px-4 sm:px-6 relative z-10" id="register">
        <div className="max-w-xl mx-auto cyber-glass-card hud-brackets rounded-2xl p-8 sm:p-10 border border-[#00f2fe]/40 shadow-[0_0_60px_rgba(0,242,254,0.25)] text-center font-mono">
          <div className="w-16 h-16 bg-[#00f2fe]/10 rounded-full border border-[#00f2fe] flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(0,242,254,0.4)]">
            <CheckCircle2 className="w-10 h-10 text-[#00f2fe]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Verified &amp; Saved to Sheet</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            REGISTRATION CONFIRMED
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 font-sans">
            Welcome to ASTRA Hackathon 2026! Team <strong className="text-[#00f2fe]">{successInfo.teamName}</strong> is recorded.
          </p>

          <div className="bg-[#050914] border border-[#00f2fe]/30 rounded-xl p-5 mb-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#00f2fe]/10 border-b border-l border-[#00f2fe]/30 text-[10px] text-[#00f2fe] uppercase tracking-widest font-mono">
              OFFICIAL ENTRY
            </div>
            
            <span className="text-[11px] text-slate-400 uppercase tracking-widest block mb-1">
              Your Application ID
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00f2fe] tracking-wider mb-2 font-mono">
              {successInfo.registrationId}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs text-slate-300 font-sans">
              <span>Verified UTR: <strong className="text-cyan-300 font-mono">{successInfo.utr}</strong></span>
              <span className="text-slate-600">•</span>
              <span>Saved in official sheet for: <strong className="text-slate-200">{successInfo.leadEmail}</strong></span>
            </div>

            <button
              onClick={copyRegistrationId}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#00f2fe]/50 transition"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied to Clipboard' : 'Copy Application ID'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#hero"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#00f2fe] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-cyan-300 transition shadow-[0_0_20px_rgba(0,242,254,0.3)] font-mono"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </a>

            {onGoToTrack && (
              <button
                onClick={onGoToTrack}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0a122e] border border-[#00f2fe]/40 text-cyan-300 font-bold text-xs uppercase tracking-wider hover:bg-[#00f2fe]/10 transition font-mono"
              >
                <span>Track Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // FORM INTERFACE
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 relative z-10" id="register">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-xs font-bold text-[#00f2fe] mb-3 shadow-[0_0_15px_rgba(0,242,254,0.2)] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
            <span className="tracking-wider uppercase">OFFICIAL REGISTRATION PORTAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Join ASTRA Hackathon 2026
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-lg mx-auto font-sans">
            Collegiate student teams (4 to 5 members). All details match the official sheet directly.
          </p>
        </div>

        {/* Cyber Form Card */}
        <div className="cyber-glass-card hud-brackets rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.12)] p-6 sm:p-8 bg-[#0a122e]/90 border border-[#00f2fe]/30 font-sans">
          
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#00f2fe]/20 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 text-white">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]"></span>
              </span>
              <span className="font-bold text-white tracking-wide font-mono">
                Official Intake &amp; AI Anti-Scam Shield
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold uppercase tracking-wider font-mono">
                ACTIVE
              </span>
            </div>
            
            <div className="text-[11px] text-slate-400 font-mono">
              Fee: <strong className="text-[#00f2fe]">{paymentConfig.formattedFee}</strong> per team
            </div>
          </div>

          {/* Option: Launch in Official Google Form */}
          <div className="mb-6 p-4 rounded-xl bg-[#071026] border border-[#00f2fe]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
            <div className="flex items-center gap-2.5 text-xs text-slate-200 text-center sm:text-left">
              <span className="material-symbols-outlined text-[#00f2fe] text-lg shrink-0">description</span>
              <div>
                <span className="font-bold text-white block sm:inline">Prefer filling via Google Forms? </span>
                <span className="text-slate-400 text-[11px]">Direct intake with standard Google Drive upload.</span>
              </div>
            </div>

            <a
              href={paymentConfig.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-space-950 border border-[#00f2fe]/50 text-[#00f2fe] hover:bg-[#00f2fe]/10 font-bold text-xs uppercase tracking-wider transition shrink-0 font-mono shadow-[0_0_15px_rgba(0,242,254,0.2)]"
            >
              <span>OPEN GOOGLE FORM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Error / Anti-Scam Rejection Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/90 border border-red-500/60 flex items-start gap-3 text-red-200 text-xs sm:text-sm shadow-[0_0_25px_rgba(239,68,68,0.25)]">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300 font-mono tracking-wide uppercase">Verification Blocked</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Team Name & Team Size */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00f2fe] uppercase tracking-wider">
                  Step 1: Team Setup
                </span>
                <span className="text-[11px] text-slate-400 font-mono">All fields marked * are required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase">TEAM NAME *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. ASTRA CREW"
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition"
                    value={formData.teamName}
                    onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase">TEAM SIZE *</label>
                  <select
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2.5 text-white text-sm outline-none transition"
                    value={formData.teamSize}
                    onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                  >
                    <option value="4">4 Members (Lead + 3 Members)</option>
                    <option value="5">5 Members (Lead + 4 Members)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Lead Section */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-mono text-[#00f2fe] uppercase tracking-widest block">
                Team Lead Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Lead Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none"
                    value={formData.leadName}
                    onChange={e => setFormData({ ...formData, leadName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Lead Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="Lead Email (1 use only)"
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none"
                    value={formData.leadEmail}
                    onChange={e => setFormData({ ...formData, leadEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Lead Roll No *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 21NR1A0501"
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none"
                    value={formData.leadRoll}
                    onChange={e => setFormData({ ...formData, leadRoll: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Lead Branch *</label>
                  <select
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none"
                    value={formData.leadBranch}
                    onChange={e => setFormData({ ...formData, leadBranch: e.target.value })}
                  >
                    {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Lead Year *</label>
                  <select
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none"
                    value={formData.leadYear}
                    onChange={e => setFormData({ ...formData, leadYear: e.target.value })}
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Lead Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="10-digit Mobile No"
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none"
                    value={formData.leadPhone}
                    onChange={e => setFormData({ ...formData, leadPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Member 2 Details */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block">
                Member 2 Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input required type="text" placeholder="Member 2 Name *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m2Name} onChange={e => setFormData({ ...formData, m2Name: e.target.value })} />
                <input required type="email" placeholder="Member 2 Email *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m2Email} onChange={e => setFormData({ ...formData, m2Email: e.target.value })} />
                <input required type="text" placeholder="Member 2 Roll No *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m2Roll} onChange={e => setFormData({ ...formData, m2Roll: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m2Branch} onChange={e => setFormData({ ...formData, m2Branch: e.target.value })}>
                  {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m2Year} onChange={e => setFormData({ ...formData, m2Year: e.target.value })}>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <input required type="tel" placeholder="Member 2 Phone Number *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m2Phone} onChange={e => setFormData({ ...formData, m2Phone: e.target.value })} />
              </div>
            </div>

            {/* Member 3 Details */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block">
                Member 3 Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input required type="text" placeholder="Member 3 Name *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m3Name} onChange={e => setFormData({ ...formData, m3Name: e.target.value })} />
                <input required type="email" placeholder="Member 3 Email *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m3Email} onChange={e => setFormData({ ...formData, m3Email: e.target.value })} />
                <input required type="text" placeholder="Member 3 Roll No *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m3Roll} onChange={e => setFormData({ ...formData, m3Roll: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m3Branch} onChange={e => setFormData({ ...formData, m3Branch: e.target.value })}>
                  {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m3Year} onChange={e => setFormData({ ...formData, m3Year: e.target.value })}>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <input required type="tel" placeholder="Member 3 Phone Number *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m3Phone} onChange={e => setFormData({ ...formData, m3Phone: e.target.value })} />
              </div>
            </div>

            {/* Member 4 Details */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block">
                Member 4 Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input required type="text" placeholder="Member 4 Name *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m4Name} onChange={e => setFormData({ ...formData, m4Name: e.target.value })} />
                <input required type="email" placeholder="Member 4 Email *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m4Email} onChange={e => setFormData({ ...formData, m4Email: e.target.value })} />
                <input required type="text" placeholder="Member 4 Roll No *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m4Roll} onChange={e => setFormData({ ...formData, m4Roll: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m4Branch} onChange={e => setFormData({ ...formData, m4Branch: e.target.value })}>
                  {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m4Year} onChange={e => setFormData({ ...formData, m4Year: e.target.value })}>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <input required type="tel" placeholder="Member 4 Phone Number *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m4Phone} onChange={e => setFormData({ ...formData, m4Phone: e.target.value })} />
              </div>
            </div>

            {/* Member 5 Details (Optional / if team size is 5) */}
            {parsedSize >= 5 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block">
                  Member 5 Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input required type="text" placeholder="Member 5 Name *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m5Name} onChange={e => setFormData({ ...formData, m5Name: e.target.value })} />
                  <input required type="email" placeholder="Member 5 Email *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m5Email} onChange={e => setFormData({ ...formData, m5Email: e.target.value })} />
                  <input required type="text" placeholder="Member 5 Roll No *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m5Roll} onChange={e => setFormData({ ...formData, m5Roll: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m5Branch} onChange={e => setFormData({ ...formData, m5Branch: e.target.value })}>
                    {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m5Year} onChange={e => setFormData({ ...formData, m5Year: e.target.value })}>
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <input required type="tel" placeholder="Member 5 Phone Number *" className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3 py-2 text-white text-sm outline-none" value={formData.m5Phone} onChange={e => setFormData({ ...formData, m5Phone: e.target.value })} />
                </div>
              </div>
            )}

            {/* Step 2: Pay Registration Fee */}
            <div className="pt-5 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00f2fe] uppercase tracking-wider">
                  Step 2: Pay Registration Fee ({paymentConfig.formattedFee})
                </span>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> AI Anti-Scam Verified
                </span>
              </div>

              {/* Clean UPI QR Card - Cleaned as requested */}
              <div className="bg-[#050914] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-36 h-36 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg shrink-0">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `upi://pay?pa=${paymentConfig.friendUpiId}&pn=${paymentConfig.friendName}&am=${paymentConfig.feeAmount}&cu=INR`
                    )}`} 
                    alt="UPI QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="text-xs text-slate-300">
                    Scan via any UPI App (GPay / PhonePe / Paytm / BHIM) to pay <strong className="text-[#00f2fe]">{paymentConfig.formattedFee}</strong>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white">
                    <span>{paymentConfig.friendUpiId}</span>
                    <button 
                      type="button" 
                      onClick={copyUpi} 
                      className="text-[#00f2fe] hover:text-cyan-300 flex items-center gap-1 font-sans text-[11px]"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ENTER THE UTR NUMBER & PAYMENT PICTURE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase">
                    ENTER THE UTR NUMBER *
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={12}
                    placeholder="12-digit UPI Ref / UTR"
                    className="w-full bg-[#050914] border border-slate-700 focus:border-[#00f2fe] rounded-lg px-3.5 py-2.5 text-white text-sm font-mono tracking-wider outline-none transition"
                    value={formData.utrNumber}
                    onChange={e => setFormData({ ...formData, utrNumber: e.target.value.replace(/\D/g, '') })}
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Digits: {formData.utrNumber.length}/12
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase">
                    PAYMENT PICTURE *
                  </label>
                  
                  {previewUrl ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#050914] border border-[#00f2fe]/40">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={previewUrl} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-700 shrink-0" />
                        <span className="text-xs text-emerald-400 font-mono truncate">✓ Picture Selected</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        className="text-slate-400 hover:text-red-400 p-1 rounded transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full bg-[#050914] border border-dashed border-slate-700 hover:border-[#00f2fe] rounded-lg px-3.5 py-2.5 text-slate-300 text-xs flex items-center justify-between cursor-pointer transition">
                      <span className="truncate">Upload Payment Screenshot</span>
                      <Upload className="w-4 h-4 text-[#00f2fe]" />
                      <input required type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Uploaded directly to your Google Drive.
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#00f2fe] text-black font-extrabold text-sm uppercase tracking-wider hover:bg-cyan-300 transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,242,254,0.35)] disabled:opacity-50 font-mono"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>AI VERIFYING RECEIPT, AMOUNT &amp; UTR...</span>
                </>
              ) : (
                <span>SUBMIT OFFICIAL REGISTRATION</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};
