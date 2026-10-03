import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Loader2, 
  Home, Copy, Check, Upload, ShieldCheck, X, Sparkles, RefreshCw, Trophy, Calendar, MapPin, Search, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { paymentConfig } from '../data/eventConfig';
import { ParticleText } from '../components/ui/ParticleText';

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
  const [qrImgSrc, setQrImgSrc] = useState(
    paymentConfig.friendUpiQrUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=sivakottamachalla@ybl&pn=sivakottamachalla&am=999&cu=INR&tn=ASTRA%20Hackathon')}`
  );

  // Check if current device has a completed registration
  const [savedRegistration, setSavedRegistration] = useState<{
    registrationId: string;
    teamName: string;
    leadEmail: string;
    utr: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('astra_completed_registration');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const parsedSize = parseInt(formData.teamSize, 10);

  useEffect(() => {
    if (savedRegistration) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#8b5cf6', '#4facfe', '#ffffff']
        });
      } catch {}
    }
  }, [savedRegistration]);

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
    if (savedRegistration?.registrationId) {
      navigator.clipboard.writeText(savedRegistration.registrationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleRegisterAnotherTeam = () => {
    try {
      localStorage.removeItem('astra_completed_registration');
      window.dispatchEvent(new Event('registrationChange'));
    } catch {}
    setSavedRegistration(null);
    setScreenshotBase64('');
    setPreviewUrl('');
    setQrImgSrc(
      paymentConfig.friendUpiQrUrl ||
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=sivakottamachalla@ybl&pn=sivakottamachalla&am=999&cu=INR&tn=ASTRA%20Hackathon')}`
    );
    setFormData({
      teamName: '',
      teamSize: '4',
      leadName: '',
      leadEmail: '',
      leadRoll: '',
      leadBranch: 'CSE',
      leadYear: '3rd Year',
      leadPhone: '',
      m2Name: '',
      m2Email: '',
      m2Roll: '',
      m2Branch: 'CSE',
      m2Year: '3rd Year',
      m2Phone: '',
      m3Name: '',
      m3Email: '',
      m3Roll: '',
      m3Branch: 'CSE',
      m3Year: '3rd Year',
      m3Phone: '',
      m4Name: '',
      m4Email: '',
      m4Roll: '',
      m4Branch: 'CSE',
      m4Year: '3rd Year',
      m4Phone: '',
      m5Name: '',
      m5Email: '',
      m5Roll: '',
      m5Branch: 'CSE',
      m5Year: '3rd Year',
      m5Phone: '',
      utrNumber: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Validate Team Name
    if (!formData.teamName.trim()) {
      setErrorMsg('Please enter your Team Name.');
      return;
    }

    // 2. Validate Team Lead
    const cleanLeadPhone = formData.leadPhone.trim().replace(/\D/g, '');
    if (!formData.leadName.trim() || !formData.leadEmail.trim() || !formData.leadRoll.trim()) {
      setErrorMsg('Please enter complete details for Team Leader (Name, Email, Roll No).');
      return;
    }
    if (cleanLeadPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Phone Number for the Team Leader.');
      return;
    }

    // 3. Validate Member 2
    const cleanM2Phone = formData.m2Phone.trim().replace(/\D/g, '');
    if (!formData.m2Name.trim() || !formData.m2Email.trim() || !formData.m2Roll.trim()) {
      setErrorMsg('Please enter complete details for Member 2 (Name, Email, Roll No).');
      return;
    }
    if (cleanM2Phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Phone Number for Member 2.');
      return;
    }

    // 4. Validate Member 3
    const cleanM3Phone = formData.m3Phone.trim().replace(/\D/g, '');
    if (!formData.m3Name.trim() || !formData.m3Email.trim() || !formData.m3Roll.trim()) {
      setErrorMsg('Please enter complete details for Member 3 (Name, Email, Roll No).');
      return;
    }
    if (cleanM3Phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Phone Number for Member 3.');
      return;
    }

    // 5. Validate Member 4
    const cleanM4Phone = formData.m4Phone.trim().replace(/\D/g, '');
    if (!formData.m4Name.trim() || !formData.m4Email.trim() || !formData.m4Roll.trim()) {
      setErrorMsg('Please enter complete details for Member 4 (Name, Email, Roll No).');
      return;
    }
    if (cleanM4Phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Phone Number for Member 4.');
      return;
    }

    // 6. Validate Member 5 if team size is 5
    let cleanM5Phone = '';
    if (parsedSize >= 5) {
      cleanM5Phone = formData.m5Phone.trim().replace(/\D/g, '');
      if (!formData.m5Name.trim() || !formData.m5Email.trim() || !formData.m5Roll.trim()) {
        setErrorMsg('Please enter complete details for Member 5 (Name, Email, Roll No).');
        return;
      }
      if (cleanM5Phone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit Phone Number for Member 5.');
        return;
      }
    }

    // 7. Validate Payment
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
        teamName: formData.teamName.trim(),
        teamSize: parsedSize,
        // Lead
        leadName: formData.leadName.trim(),
        leadEmail: formData.leadEmail.trim(),
        leadRoll: formData.leadRoll.trim(),
        leadBranch: formData.leadBranch,
        leadYear: formData.leadYear,
        leadPhone: cleanLeadPhone,
        // Member 2
        m2Name: formData.m2Name.trim(),
        m2Email: formData.m2Email.trim(),
        m2Roll: formData.m2Roll.trim(),
        m2Branch: formData.m2Branch,
        m2Year: formData.m2Year,
        m2Phone: cleanM2Phone,
        // Member 3
        m3Name: formData.m3Name.trim(),
        m3Email: formData.m3Email.trim(),
        m3Roll: formData.m3Roll.trim(),
        m3Branch: formData.m3Branch,
        m3Year: formData.m3Year,
        m3Phone: cleanM3Phone,
        // Member 4
        m4Name: formData.m4Name.trim(),
        m4Email: formData.m4Email.trim(),
        m4Roll: formData.m4Roll.trim(),
        m4Branch: formData.m4Branch,
        m4Year: formData.m4Year,
        m4Phone: cleanM4Phone,
        // Member 5
        m5Name: parsedSize >= 5 ? formData.m5Name.trim() : '',
        m5Email: parsedSize >= 5 ? formData.m5Email.trim() : '',
        m5Roll: parsedSize >= 5 ? formData.m5Roll.trim() : '',
        m5Branch: parsedSize >= 5 ? formData.m5Branch : '',
        m5Year: parsedSize >= 5 ? formData.m5Year : '',
        m5Phone: parsedSize >= 5 ? cleanM5Phone : '',
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
        const info = {
          registrationId: data.registrationId,
          teamName: data.teamName,
          leadEmail: data.leadEmail,
          utr: data.utr || cleanUtr
        };
        setSavedRegistration(info);
        try {
          localStorage.setItem('astra_completed_registration', JSON.stringify(info));
          window.dispatchEvent(new Event('registrationChange'));
        } catch {}
      } else {
        setErrorMsg(data.message || 'Payment verification failed. Please check your payment details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while reaching verification server. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const branchOptions = ['CSE', 'ECE', 'AIML', 'DS', 'IT', 'EEE', 'MECH', 'CIVIL', 'DIPLOMA', 'OTHER'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // =========================================================================
  // VIEW 1: REGISTRATION COMPLETED -> SHOW ASTRA HACKATHON PARTICLE TEXT
  // =========================================================================
  if (savedRegistration) {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-6 relative z-10" id="register">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Card with Cyber Glass & Glowing Border */}
          <div className="cyber-glass-card hud-brackets rounded-3xl p-6 sm:p-10 border border-[#00f2fe]/40 shadow-[0_0_90px_rgba(0,242,254,0.25)] text-center relative overflow-hidden bg-[#060a18]/95 font-sans">
            
            {/* Top Status Header */}
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-[#00f2fe]/40 text-[#00f2fe] text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,242,254,0.2)] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
                <span>REGISTRATION COMPLETE • FINAL ROUND ACTIVE</span>
              </div>
            </div>

            {/* Dazzling Interactive ParticleText Canvas showing only ASTRA HACKATHON */}
            <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden relative my-3 bg-[#050713]/90 border border-[#00f2fe]/30 shadow-[inset_0_0_50px_rgba(0,0,0,0.85)] flex items-center justify-center">
              <div className="absolute top-3 left-4 text-[10px] sm:text-xs font-mono text-[#00f2fe]/75 tracking-widest uppercase flex items-center gap-1.5 pointer-events-none z-10">
                <Sparkles className="w-3.5 h-3.5 text-[#00f2fe] animate-pulse" />
                <span>Interactive Particles • Move cursor / touch canvas</span>
              </div>

              <ParticleText
                text="ASTRA HACKATHON"
                particleSize={2.4}
                density={4}
                color="#00f2fe"
                highlightColor="#8b5cf6"
                scatter={190}
                gatherDuration={1600}
                stagger={420}
                pointerRepel={45}
                repelRadius={130}
                idleDrift={0.8}
                trigger="mount"
                fontSize="clamp(2.4rem, 8vw, 6rem)"
                fontWeight={900}
                fontFamily="inherit"
                glow={true}
              />
            </div>

            {/* Exact Requested Heading */}
            <div className="mt-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-display">
                Welcome to ASTRA Hackathon Grand Finale 2026!
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Your registration is confirmed. Shortlisted teams are advancing to the offline engineering marathon at{' '}
                <span className="text-[#00f2fe] font-semibold">NRI Institute of Technology</span>. Check your live application status below.
              </p>
            </div>

            {/* Event Quick Intel Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto mb-8 font-mono text-xs text-left">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#00f2fe]/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#00f2fe]" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Date</span>
                  <span className="font-bold text-white text-xs">21-09-2026</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#00f2fe]/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Location</span>
                  <span className="font-bold text-white text-xs truncate">NRIIT, Perecharla</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#00f2fe]/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Format</span>
                  <span className="font-bold text-white text-xs">Offline Prototype Final</span>
                </div>
              </div>
            </div>

            {/* Application ID Card */}
            <div className="bg-[#050914] border border-[#00f2fe]/40 rounded-2xl p-5 mb-8 text-left relative overflow-hidden max-w-xl mx-auto font-mono shadow-[0_0_35px_rgba(0,242,254,0.15)]">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#00f2fe]/10 border-b border-l border-[#00f2fe]/30 text-[10px] text-[#00f2fe] uppercase tracking-widest">
                OFFICIAL ENTRY
              </div>
              
              <span className="text-[11px] text-slate-400 uppercase tracking-widest block mb-1">
                Your Application ID
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#00f2fe] tracking-wider mb-2">
                {savedRegistration.registrationId}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs text-slate-300 font-sans">
                {savedRegistration.teamName && (
                  <span>Team: <strong className="text-white">{savedRegistration.teamName}</strong></span>
                )}
                {savedRegistration.leadEmail && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span>Lead: <strong className="text-slate-200">{savedRegistration.leadEmail}</strong></span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={copyRegistrationId}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#00f2fe]/50 transition"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied to Clipboard' : 'Copy Application ID'}</span>
              </button>
            </div>

            {/* Action Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center font-mono">
              {onGoToTrack && (
                <button
                  type="button"
                  onClick={onGoToTrack}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-[0_0_25px_rgba(0,242,254,0.4)]"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Application Status</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0a122e] border border-[#00f2fe]/40 text-cyan-300 font-bold text-xs uppercase tracking-wider hover:bg-[#00f2fe]/10 transition"
              >
                <Home className="w-4 h-4" />
                <span>Explore Event Details</span>
              </a>

              <button
                type="button"
                onClick={handleRegisterAnotherTeam}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-slate-400 hover:text-white text-xs tracking-wider transition hover:bg-white/5"
                title="Reset form to register another team"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Register Another Team</span>
              </button>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // VIEW 2: NOT REGISTERED YET -> SHOW REGISTRATION FORM
  // =========================================================================
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
              <span className="font-bold text-white tracking-wide font-mono">REGISTRATION PORTAL OPEN</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              ₹{paymentConfig.registrationFee} per team • Verified Online
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs sm:text-sm animate-fade-in font-sans">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-red-300">Submission Notice</strong>
                {errorMsg}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Team Basics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00f2fe] text-xs font-mono tracking-wider uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                <span>Step 1: Team Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="e.g. CyberKnights"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Total Team Members <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition font-sans"
                  >
                    <option value="4">4 Members (Standard Team)</option>
                    <option value="5">5 Members (Extended Team)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Lead */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[#00f2fe] text-xs font-mono tracking-wider uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                <span>Step 2: Team Leader Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lead Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lead Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.leadEmail}
                    onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                    placeholder="lead@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lead Roll No <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.leadRoll}
                    onChange={(e) => setFormData({ ...formData, leadRoll: e.target.value })}
                    placeholder="e.g. 22NR1A0501"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch</label>
                  <select
                    value={formData.leadBranch}
                    onChange={(e) => setFormData({ ...formData, leadBranch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Year</label>
                  <select
                    value={formData.leadYear}
                    onChange={(e) => setFormData({ ...formData, leadYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lead Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.leadPhone}
                    onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Member 2 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[#00f2fe] text-xs font-mono tracking-wider uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                <span>Step 3: Member 2 Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 2 Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.m2Name}
                    onChange={(e) => setFormData({ ...formData, m2Name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 2 Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.m2Email}
                    onChange={(e) => setFormData({ ...formData, m2Email: e.target.value })}
                    placeholder="member2@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 2 Roll No <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.m2Roll}
                    onChange={(e) => setFormData({ ...formData, m2Roll: e.target.value })}
                    placeholder="e.g. 22NR1A0502"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 2 Branch <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.m2Branch}
                    onChange={(e) => setFormData({ ...formData, m2Branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 2 Year <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.m2Year}
                    onChange={(e) => setFormData({ ...formData, m2Year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 2 Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.m2Phone}
                    onChange={(e) => setFormData({ ...formData, m2Phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Member 3 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[#00f2fe] text-xs font-mono tracking-wider uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                <span>Step 4: Member 3 Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 3 Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.m3Name}
                    onChange={(e) => setFormData({ ...formData, m3Name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 3 Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.m3Email}
                    onChange={(e) => setFormData({ ...formData, m3Email: e.target.value })}
                    placeholder="member3@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 3 Roll No <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.m3Roll}
                    onChange={(e) => setFormData({ ...formData, m3Roll: e.target.value })}
                    placeholder="e.g. 22NR1A0503"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 3 Branch <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.m3Branch}
                    onChange={(e) => setFormData({ ...formData, m3Branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 3 Year <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.m3Year}
                    onChange={(e) => setFormData({ ...formData, m3Year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 3 Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.m3Phone}
                    onChange={(e) => setFormData({ ...formData, m3Phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Member 4 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[#00f2fe] text-xs font-mono tracking-wider uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                <span>Step 5: Member 4 Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 4 Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.m4Name}
                    onChange={(e) => setFormData({ ...formData, m4Name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 4 Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.m4Email}
                    onChange={(e) => setFormData({ ...formData, m4Email: e.target.value })}
                    placeholder="member4@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 4 Roll No <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.m4Roll}
                    onChange={(e) => setFormData({ ...formData, m4Roll: e.target.value })}
                    placeholder="e.g. 22NR1A0504"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 4 Branch <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.m4Branch}
                    onChange={(e) => setFormData({ ...formData, m4Branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 4 Year <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.m4Year}
                    onChange={(e) => setFormData({ ...formData, m4Year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member 4 Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.m4Phone}
                    onChange={(e) => setFormData({ ...formData, m4Phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Optional Member 5 */}
            {parsedSize >= 5 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-[#00f2fe] text-xs font-mono tracking-wider uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                  <span>Step 6: Member 5 Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Member 5 Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.m5Name}
                      onChange={(e) => setFormData({ ...formData, m5Name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Member 5 Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.m5Email}
                      onChange={(e) => setFormData({ ...formData, m5Email: e.target.value })}
                      placeholder="member5@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Member 5 Roll No <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.m5Roll}
                      onChange={(e) => setFormData({ ...formData, m5Roll: e.target.value })}
                      placeholder="e.g. 22NR1A0505"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Member 5 Branch <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.m5Branch}
                      onChange={(e) => setFormData({ ...formData, m5Branch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                    >
                      {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Member 5 Year <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.m5Year}
                      onChange={(e) => setFormData({ ...formData, m5Year: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                    >
                      {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Member 5 Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.m5Phone}
                      onChange={(e) => setFormData({ ...formData, m5Phone: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment & Verification Section */}
            <div className="pt-6 border-t border-slate-800 space-y-5">
              <div className="flex items-center gap-2 text-[#00f2fe] text-xs font-mono tracking-wider uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                <span>Final Step: Registration Fee &amp; UPI Verification</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-5 rounded-xl bg-[#050914] border border-[#00f2fe]/30">
                
                {/* UPI QR & Details */}
                <div className="flex flex-col items-center sm:flex-row gap-4">
                  <div className="w-32 h-32 rounded-xl bg-white p-2 shrink-0 shadow-[0_0_20px_rgba(0,242,254,0.25)] flex items-center justify-center">
                    <img
                      src={qrImgSrc}
                      alt="UPI QR Code - Scan to Pay ₹999"
                      className="w-full h-full object-contain"
                      onError={() => {
                        setQrImgSrc(
                          `https://quickchart.io/qr?text=${encodeURIComponent(
                            'upi://pay?pa=sivakottamachalla@ybl&pn=sivakottamachalla&am=999&cu=INR&tn=ASTRA%20Hackathon'
                          )}&size=300`
                        );
                      }}
                    />
                  </div>
                  <div className="text-center sm:text-left text-xs space-y-1.5">
                    <span className="text-[#00f2fe] font-mono uppercase tracking-wider block font-bold">
                      Scan to Pay {paymentConfig.formattedFee}
                    </span>
                    <p className="text-slate-300">
                      Recipient: <strong className="text-white">{paymentConfig.friendName}</strong>
                    </p>
                    <p className="text-slate-400 font-mono text-[11px] break-all">
                      {paymentConfig.friendUpiId}
                    </p>
                    <button
                      type="button"
                      onClick={copyUpi}
                      className="inline-flex items-center gap-1.5 text-[11px] text-cyan-300 hover:text-white px-2.5 py-1 rounded bg-white/5 border border-white/10 transition mt-1 font-mono"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? 'Copied UPI ID' : 'Copy UPI ID'}</span>
                    </button>
                  </div>
                </div>

                {/* UTR Input & Screenshot Upload */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      12-Digit UTR / Transaction ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={formData.utrNumber}
                      onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                      placeholder="e.g. 377898096414"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a18] border border-slate-700 focus:border-[#00f2fe] text-white text-sm font-mono focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Payment Screenshot <span className="text-red-400">*</span>
                    </label>
                    {previewUrl ? (
                      <div className="relative inline-flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-[#00f2fe]/40">
                        <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                        <span className="text-xs text-emerald-300 font-mono">Receipt Attached</span>
                        <button
                          type="button"
                          onClick={removeScreenshot}
                          className="p-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 ml-2"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#00f2fe]/40 hover:border-[#00f2fe] bg-white/[0.02] text-xs text-slate-300 hover:text-white transition font-mono">
                        <Upload className="w-4 h-4 text-[#00f2fe]" />
                        <span>Upload Screenshot (JPG/PNG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-extrabold text-sm uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition shadow-[0_0_30px_rgba(0,242,254,0.4)] font-mono"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Payment with AI...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Payment &amp; Submit Registration</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};
export default RegistrationSection;
