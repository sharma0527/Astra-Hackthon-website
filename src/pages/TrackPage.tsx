import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import PixelSnow from '../components/ui/PixelSnow';
import { trackApplication } from '../services/applicationApi';
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
  Target
} from 'lucide-react';

// Rate-limiting helper: max 2 tracking checks per Application ID
const getTrackingAttempts = (id: string): number => {
  try {
    const val = localStorage.getItem(`astra_query_count_${id}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

const incrementTrackingAttempt = (id: string): number => {
  try {
    const next = getTrackingAttempts(id) + 1;
    localStorage.setItem(`astra_query_count_${id}`, next.toString());
    return next;
  } catch {
    return 1;
  }
};

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
  const [queryCount, setQueryCount] = useState<number | null>(null);

  const handleSearch = async () => {
    const rawInput = searchId.trim();

    // 1. Empty input validation
    if (!rawInput) {
      setErrorMessage('Please enter your Application ID.');
      setResult(null);
      return;
    }

    // 2. Format validation (accept ASTRA-2026-TEAM001, ASTRA-2026-XXXX, etc.)
    const normalizedId = rawInput.toUpperCase();
    const formatRegex = /^ASTRA(-2026)?-[A-Z0-9_-]+$/i;
    if (!formatRegex.test(normalizedId)) {
      setErrorMessage('Please enter a valid Application ID, for example ASTRA-2026-TEAM001.');
      setResult(null);
      return;
    }

    // 3. Security rate limit: 1 Application ID can only be checked 2 times
    const existingCount = getTrackingAttempts(normalizedId);
    if (existingCount >= 2) {
      setErrorMessage(`Security Rate Limit Reached: Application ID "${normalizedId}" has already reached the maximum limit of 2 tracking queries. Per security policy, each ID can be verified a maximum of 2 times. If you require further status verification, please contact the organizing team.`);
      setResult(null);
      setQueryCount(existingCount);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await trackApplication(normalizedId);
      if (response.success && (response.application || response.data)) {
        const nextCount = incrementTrackingAttempt(normalizedId);
        setQueryCount(nextCount);
        setResult(response.application || response.data || null);
        setErrorMessage(null);
      } else {
        const msg = response.message || response.error || 'Application not found. Please check your Application ID and try again.';
        setErrorMessage(msg);
        setResult(null);
      }
    } catch {
      setErrorMessage('Unable to connect to the application tracking service. Please try again later.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
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
    const statusUpper = currentStatus.toUpperCase();

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
    const s = status.toUpperCase();
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
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            {s}
          </span>
        );
    }
  };

  // Helper to extract member name string safely
  const getMemberName = (m: { name: string } | string): string => {
    if (typeof m === 'string') return m;
    if (m && typeof m === 'object' && 'name' in m) return m.name;
    return String(m || 'Member');
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
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
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
                placeholder="ASTRA-2026-TEAM001"
                className="w-full pl-12 pr-4 py-3.5 bg-space-950 rounded-xl border border-cyan-500/30 text-white font-mono text-sm sm:text-base tracking-widest uppercase focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Search className="w-4 h-4 text-black" />
              )}
              <span>{isLoading ? 'SEARCHING...' : 'TRACK APPLICATION'}</span>
            </button>
          </form>

          {/* Rate-Limit Policy Status Bar */}
          <div className="mt-4 pt-3.5 border-t border-cyan-500/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Policy: Maximum 2 tracking verifications allowed per Application ID</span>
            </div>
            {queryCount !== null && (
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                queryCount >= 2
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              }`}>
                {queryCount} / 2 checks used {queryCount >= 2 ? '(Limit reached)' : '(1 remaining)'}
              </span>
            )}
          </div>
        </GlassCard>

        {/* Loading State */}
        {isLoading && (
          <GlassCard glowColor="cyan" className="p-12 text-center animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping" />
              <div className="w-full h-full border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-mono font-bold tracking-widest text-cyan-300 uppercase">
              SEARCHING THE ASTRA NETWORK...
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-sans">
              Querying live Google Apps Script endpoint for application credentials.
            </p>
          </GlassCard>
        )}

        {/* Error State */}
        {errorMessage && !isLoading && (
          <GlassCard glowColor="none" className="p-8 text-center border-rose-500/30 bg-rose-950/10 mb-8">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold font-display text-white mb-2">
              APPLICATION STATUS ADVISORY
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
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
            
            {/* Found Banner Card */}
            <GlassCard glowColor="cyan" className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>APPLICATION FOUND</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                    {result.applicationId}
                  </h2>
                </div>
                <div>
                  {getStatusBadge(result.status)}
                </div>
              </div>

              {/* Required Metadata: Application ID, Team ID, Team Name, Status, Team Lead, Email, College, Branch, Track */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                
                {/* 1. Team ID */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TEAM ID</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-1">{result.teamId || 'N/A'}</div>
                </div>

                {/* 2. Team Name */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-400" />
                    TEAM NAME
                  </div>
                  <div className="text-sm font-bold font-sans text-white mt-1">{result.teamName}</div>
                </div>

                {/* 3. Team Lead */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TEAM LEAD</div>
                  <div className="text-sm font-bold font-sans text-[#00f2fe] mt-1">{result.teamLead}</div>
                </div>

                {/* 4. Registered Email (Masked) */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    REGISTERED EMAIL
                  </div>
                  <div className="text-sm font-mono text-slate-300 mt-1 truncate">{result.email}</div>
                </div>

                {/* 5. College */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <School className="w-3 h-3 text-purple-400" />
                    COLLEGE
                  </div>
                  <div className="text-sm font-sans text-slate-200 mt-1 line-clamp-1">{result.college}</div>
                </div>

                {/* 6. Branch */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-emerald-400" />
                    BRANCH
                  </div>
                  <div className="text-sm font-mono text-emerald-300 mt-1">{result.branch}</div>
                </div>

                {/* 7. Track */}
                <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800 sm:col-span-2 lg:col-span-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3 h-3 text-cyan-400" />
                    TRACK
                  </div>
                  <div className="text-sm font-bold font-sans text-cyan-300 mt-1">{result.track}</div>
                </div>

              </div>

              {/* Dynamic Team Members List (NO separate Team Count card) */}
              <div className="mt-6 p-5 rounded-xl bg-space-950/70 border border-slate-800">
                <div className="text-xs font-mono text-cyan-300 uppercase font-semibold mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>TEAM MEMBERS</span>
                </div>

                {result.members && result.members.length > 0 ? (
                  <ol className="space-y-2 text-xs sm:text-sm">
                    {result.members.map((member, idx) => {
                      const memberName = getMemberName(member);
                      const isLead = idx === 0 || memberName.toLowerCase().includes('(lead)') || memberName.toLowerCase() === result.teamLead.toLowerCase();

                      return (
                        <li
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-lg bg-space-900/60 border border-slate-800/80 font-mono"
                        >
                          <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-white font-medium">{memberName}</span>
                          {isLead && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 ml-auto font-bold tracking-wider">
                              LEAD
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="p-3 rounded bg-space-900/40 text-xs text-slate-400 font-mono">
                    1. {result.teamLead} (Lead)
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
            </GlassCard>

          </div>
        )}

      </div>
    </div>
  );
};
