import { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import PixelSnow from '../components/ui/PixelSnow';
import { trackApplication, validateApplicationId } from '../services/applicationApi';
import type { Application, ApplicationStatus } from '../types/tracking';
import {
  Search,
  CheckCircle2,
  Clock,
  ArrowLeft,
  AlertCircle,
  Users,
  Mail,
  Calendar,
  Sparkles,
  RefreshCw,
  XCircle,
  Clock3,
  School,
  GitBranch,
  Target,
  FileText,
  Hash,
  ShieldCheck,
  UserCheck,
  Phone,
  MessageCircle,
  X
} from 'lucide-react';

interface TrackPageProps {
  onBackToHome: () => void;
  onGoToRegister: () => void;
}

export const TrackPage: React.FC<TrackPageProps> = ({
  onBackToHome,
  onGoToRegister
}) => {
  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Application | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const executeSearch = async (rawInput: string) => {
    const trimmed = (rawInput || '').trim();

    // 1. Validation using unified validator supporting UUID & legacy formats
    const validation = validateApplicationId(trimmed);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter your Application ID.');
      setIsLimitReached(false);
      setResult(null);
      return;
    }

    const normalizedId = validation.normalizedId;
    setIsLoading(true);
    setErrorMessage(null);
    setIsLimitReached(false);
    setResult(null);

    try {
      const app = await trackApplication(normalizedId);
      setResult(app);
      setErrorMessage(null);
      setIsLimitReached(false);
    } catch (err: any) {
      const rawMsg = err?.message || 'Application not found. Please check your Application ID and try again.';
      if (rawMsg.startsWith('LIMIT_REACHED:')) {
        setIsLimitReached(true);
        setErrorMessage(rawMsg.replace('LIMIT_REACHED:', ''));
      } else {
        setIsLimitReached(false);
        setErrorMessage(rawMsg);
      }
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Support direct tracking if applicationId or id is in query params
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get('applicationId') || urlParams.get('id');
      if (idParam) {
        const cleanId = idParam.trim().toUpperCase();
        setSearchId(cleanId);
        executeSearch(cleanId);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(searchId);
  };

  // Pipeline stages
  const pipelineSteps: { key: string; label: string }[] = [
    { key: 'SUBMITTED', label: 'APPLICATION SUBMITTED' },
    { key: 'UNDER_REVIEW', label: 'APPLICATION UNDER REVIEW' },
    { key: 'SHORTLISTED', label: 'SHORTLISTED' },
    { key: 'CONFIRMED', label: 'CONFIRMED' },
    { key: 'COMPLETED', label: 'HACKATHON PARTICIPATION' }
  ];

  const getStepState = (
    stepIndex: number,
    currentStatus: ApplicationStatus
  ): 'completed' | 'active' | 'pending' | 'special' => {
    const statusUpper = (currentStatus || '').toUpperCase();

    if (statusUpper === 'REJECTED' || statusUpper === 'WAITLISTED') {
      if (stepIndex === 0) return 'completed';
      return 'special';
    }

    if (statusUpper === 'SUBMITTED') {
      if (stepIndex === 0) return 'completed';
      return 'pending';
    }

    if (statusUpper === 'UNDER_REVIEW') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'active';
      return 'pending';
    }

    if (statusUpper === 'SHORTLISTED') {
      if (stepIndex <= 1) return 'completed';
      if (stepIndex === 2) return 'active';
      return 'pending';
    }

    if (statusUpper === 'CONFIRMED') {
      if (stepIndex <= 2) return 'completed';
      if (stepIndex === 3) return 'active';
      return 'pending';
    }

    if (statusUpper === 'COMPLETED') {
      return 'completed';
    }

    return 'pending';
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {s}
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Sparkles className="w-3.5 h-3.5" />
            {s}
          </span>
        );
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Clock className="w-3.5 h-3.5" />
            {s}
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Clock3 className="w-3.5 h-3.5" />
            WAITLISTED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <XCircle className="w-3.5 h-3.5" />
            NOT SELECTED
          </span>
        );
      case 'DUPLICATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <XCircle className="w-3.5 h-3.5" />
            DUPLICATE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            {s || 'SUBMITTED'}
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 z-10">
      {/* Full-screen Interactive WebGL Pixel Snow Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
          className="w-full h-full opacity-60"
        />
      </div>

      {/* Background Cosmic Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation back */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO ASTRA HACKATHON 2026</span>
          </button>

          <button
            onClick={onGoToRegister}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Need to register? <span className="text-cyan-400 underline">Open Form</span>
          </button>
        </div>

        {/* Portal Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200">
            TRACK YOUR ASTRA HACKATHON 2026 APPLICATION
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-sans">
            Enter your Application ID to view the latest registration status and committee progression.
          </p>
        </div>

        {/* Search Input Box */}
        <GlassCard glowColor="cyan" className="p-6 sm:p-8 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                placeholder="Enter Application ID (e.g. ASTRA-2026-...)"
                className="w-full pl-12 pr-10 py-3.5 bg-space-950 rounded-xl border border-cyan-500/30 text-white font-mono text-sm sm:text-base tracking-wider uppercase focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-inner"
              />
              {searchId && (
                <button
                  type="button"
                  onClick={() => setSearchId('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Search className="w-4 h-4 text-black" />
              )}
              <span>{isLoading ? 'Checking application...' : 'TRACK APPLICATION'}</span>
            </button>
          </form>
        </GlassCard>

        {/* Loading State */}
        {isLoading && (
          <GlassCard glowColor="cyan" className="p-12 text-center animate-fadeIn mb-8">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping" />
              <div className="w-full h-full border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-mono font-bold tracking-widest text-cyan-300 uppercase">
              Checking application...
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-sans">
              Connecting to ASTRA registration network...
            </p>
          </GlassCard>
        )}

        {/* Error State: Limit Reached */}
        {errorMessage && isLimitReached && !isLoading && (
          <GlassCard glowColor="none" className="p-8 text-center border-amber-500/40 bg-amber-950/20 mb-8 animate-fadeIn">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2">
              TRACKING LIMIT REACHED
            </h3>
            <p className="text-sm text-amber-200 max-w-lg mx-auto mb-6 font-mono leading-relaxed">
              {errorMessage}
            </p>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-space-950/80 border border-amber-500/30 mb-6 text-left">
              <div className="text-xs font-mono text-amber-300 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>FOR ASSISTANCE CONTACT ORGANIZERS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                <a
                  href="tel:9701711338"
                  className="p-2 rounded bg-space-900 border border-slate-700 text-xs font-mono text-cyan-300 hover:border-cyan-400 hover:text-white transition-colors"
                >
                  9701711338
                </a>
                <a
                  href="tel:9392757990"
                  className="p-2 rounded bg-space-900 border border-slate-700 text-xs font-mono text-cyan-300 hover:border-cyan-400 hover:text-white transition-colors"
                >
                  9392757990
                </a>
                <a
                  href="tel:8688011599"
                  className="p-2 rounded bg-space-900 border border-slate-700 text-xs font-mono text-cyan-300 hover:border-cyan-400 hover:text-white transition-colors"
                >
                  8688011599
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://chat.whatsapp.com/IUboDrvxO5M0k69IPHd41U"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>JOIN OFFICIAL WHATSAPP GROUP</span>
              </a>
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-space-950 border border-slate-700 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </GlassCard>
        )}

        {/* Error State: Normal Error */}
        {errorMessage && !isLimitReached && !isLoading && (
          <GlassCard glowColor="none" className="p-8 text-center border-rose-500/30 bg-rose-950/10 mb-8 animate-fadeIn">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold font-display text-white mb-2">
              APPLICATION STATUS ADVISORY
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 font-mono">
              {errorMessage}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-space-950 border border-slate-700 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </GlassCard>
        )}

        {/* Result Found */}
        {result && !isLoading && (
          <div className="space-y-6 animate-fadeIn">
            {/* Main Application Summary Card */}
            <GlassCard glowColor="cyan" className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>APPLICATION FOUND</span>
                    {result.limit !== undefined && (
                      <span className="ml-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[10px] tracking-wide">
                        Tracking: {result.usage ?? 1} / {result.limit} (Remaining: {result.remaining ?? 0})
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                    {result.applicationId}
                  </h2>
                </div>
                <div>
                  {getStatusBadge(result.status)}
                </div>
              </div>

              {/* Required Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                {/* 1. Application ID */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Hash className="w-3 h-3 text-cyan-400" />
                    APPLICATION ID
                  </div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-1">
                    {result.applicationId}
                  </div>
                </div>

                {/* 2. Team ID */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    TEAM ID
                  </div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
                    {result.teamId || 'N/A'}
                  </div>
                </div>

                {/* 3. Team Name */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-400" />
                    TEAM NAME
                  </div>
                  <div className="text-sm font-bold font-sans text-white mt-1">
                    {result.teamName || 'N/A'}
                  </div>
                </div>

                {/* 4. Status */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    STATUS
                  </div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                    {result.status || 'SUBMITTED'}
                  </div>
                </div>

                {/* 5. Team Lead */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-[#00f2fe]" />
                    TEAM LEAD
                  </div>
                  <div className="text-sm font-bold font-sans text-[#00f2fe] mt-1">
                    {result.teamLead || 'N/A'}
                  </div>
                </div>

                {/* 6. Registered Email */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    REGISTERED EMAIL
                  </div>
                  <div className="text-sm font-mono text-slate-300 mt-1 truncate">
                    {result.maskedEmail || result.email || 'N/A'}
                  </div>
                </div>

                {/* 7. Branch */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-emerald-400" />
                    BRANCH
                  </div>
                  <div className="text-sm font-mono text-emerald-300 mt-1">
                    {result.branch || 'N/A'}
                  </div>
                </div>

                {/* Optional College (if returned by backend) */}
                {result.college && (
                  <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <School className="w-3 h-3 text-purple-400" />
                      COLLEGE
                    </div>
                    <div className="text-sm font-sans text-slate-200 mt-1 line-clamp-1">
                      {result.college}
                    </div>
                  </div>
                )}

                {/* 8. Problem Statement Domain */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3 h-3 text-cyan-400" />
                    PROBLEM STATEMENT DOMAIN
                  </div>
                  <div className="text-sm font-bold font-sans text-cyan-300 mt-1">
                    {result.domain || result.track || 'N/A'}
                  </div>
                </div>

                {/* 9. Problem Statement */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800 sm:col-span-2 lg:col-span-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3 text-purple-400" />
                    PROBLEM STATEMENT
                  </div>
                  <div className="text-sm font-sans text-slate-200 mt-1 leading-relaxed">
                    {result.problemStatement || 'N/A'}
                  </div>
                </div>
              </div>

              {/* TEAM MEMBERS (NO separate Team Count card) */}
              <div className="mt-6 p-5 sm:p-6 rounded-xl bg-space-950/70 border border-slate-800">
                <div className="text-xs font-mono text-cyan-300 uppercase font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>TEAM MEMBERS</span>
                </div>

                {result.members && result.members.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.members.map((member, idx) => {
                      const isLead =
                        member.role === 'Team Lead' ||
                        (!member.role && idx === 0) ||
                        (result.teamLead && member.name?.toLowerCase() === result.teamLead.toLowerCase());

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border font-mono flex items-center justify-between transition-colors ${
                            isLead
                              ? 'bg-cyan-950/30 border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.08)]'
                              : 'bg-space-900/60 border-slate-800/80'
                          }`}
                        >
                          <div>
                            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                              {member.role || (idx === 0 ? 'Team Lead' : `Team Member ${idx}`)}
                            </div>
                            <div className="text-sm font-bold text-white mt-1">
                              {member.name}
                            </div>
                          </div>
                          {isLead && (
                            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-bold tracking-wider">
                              LEAD
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-space-900/60 border border-slate-800/80 font-mono">
                    <div className="text-[11px] text-cyan-400 uppercase font-semibold">Team Lead</div>
                    <div className="text-sm font-bold text-white mt-1">{result.teamLead}</div>
                  </div>
                )}
              </div>

              {/* Official Remarks / Review Notes */}
              {result.reviewNotes && (
                <div className="mt-6 p-4 rounded-xl bg-space-950/60 border border-cyan-500/20 text-xs text-slate-300">
                  <span className="text-cyan-400 font-mono font-semibold uppercase block mb-1">
                    OFFICIAL REMARKS:
                  </span>
                  {result.reviewNotes}
                </div>
              )}
            </GlassCard>

            {/* Visual Progress Pipeline Stepper */}
            <GlassCard glowColor="violet" className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold font-display text-white">
                  REGISTRATION STATUS PIPELINE
                </h3>
                {result.lastUpdated && (
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Updated: {new Date(result.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Pipeline Steps List */}
              <div className="space-y-4">
                {pipelineSteps.map((step, idx) => {
                  const state = getStepState(idx, result.status);

                  return (
                    <div
                      key={step.key}
                      className={`flex items-start gap-4 p-3.5 rounded-xl transition-colors ${
                        state === 'active'
                          ? 'bg-cyan-950/40 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                          : 'bg-space-950/40 border border-slate-800/80'
                      }`}
                    >
                      {/* Step Indicator */}
                      <div className="shrink-0 mt-0.5">
                        {state === 'completed' ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : state === 'active' ? (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center animate-pulse">
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-space-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <div className={`text-sm font-bold font-mono ${
                            state === 'active'
                              ? 'text-cyan-300'
                              : state === 'completed'
                              ? 'text-white'
                              : 'text-slate-300'
                          }`}>
                            {step.label}
                          </div>
                          <div className="text-xs text-slate-300">
                            {state === 'completed' && 'Completed'}
                            {state === 'active' && 'Current Step in Progress'}
                            {state === 'pending' && 'Pending Verification'}
                            {state === 'special' && 'Condition Met'}
                          </div>
                        </div>

                        <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded self-start sm:self-auto ${
                          state === 'completed'
                            ? 'text-emerald-400 bg-emerald-950/50'
                            : state === 'active'
                            ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/30'
                            : 'text-slate-300'
                        }`}>
                          {state === 'completed' ? '✓ Completed' : state === 'active' ? '● In Progress' : '○ Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Status Callout */}
              {result.status?.toUpperCase() === 'WAITLISTED' && (
                <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200">
                  <span className="font-bold font-mono uppercase block mb-1">WAITLIST NOTICE</span>
                  Your application has been placed on the waiting list. If seats open during final confirmations, our steering committee will notify your team via email.
                </div>
              )}

              {result.status?.toUpperCase() === 'REJECTED' && (
                <div className="mt-6 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200">
                  <span className="font-bold font-mono uppercase block mb-1">COMMITTEE ADVISORY</span>
                  Thank you for submitting your innovation proposal. Due to high submission density, your team was not selected for this cohort. We encourage you to participate in upcoming campus hackathons!
                </div>
              )}

              {result.status?.toUpperCase() === 'DUPLICATE' && (
                <div className="mt-6 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200">
                  <span className="font-bold font-mono uppercase block mb-1">DUPLICATE ENTRY DETECTED</span>
                  This registration was flagged as a duplicate entry (matching existing Team Name, Team Lead, or Roll Number). If you believe this is in error, please contact the organizing team.
                </div>
              )}
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
