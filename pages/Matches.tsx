
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUp, 
  Clock, 
  Shield, 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  X, 
  Zap,
  Activity,
  Target,
  Maximize2,
  Calendar as CalendarIcon,
  ChevronRight,
  Monitor,
  MapPin,
  Globe,
  Timer
} from 'lucide-react';
import { LanguageContext } from '../App';
import { useLiveMatches } from '../hooks/useLiveMatches';
import { Match } from '../types';

// --- Utility for Flags ---
const getFlagCode = (team: string) => {
  const codes: Record<string, string> = {
    'Brazil': 'br', 'France': 'fr', 'Argentina': 'ar', 'Germany': 'de', 'Spain': 'es',
    'Italy': 'it', 'England': 'gb-eng', 'Portugal': 'pt', 'Netherlands': 'nl',
    'Belgium': 'be', 'Turkey': 'tr', 'Croatia': 'hr', 'Japan': 'jp', 'USA': 'us',
    'Real Madrid': 'es', 'Man City': 'gb-eng', 'Liverpool': 'gb-eng', 'Barcelona': 'es',
    'Arsenal': 'gb-eng', 'PSG': 'fr', 'Inter Milan': 'it', 'Bayern Munich': 'de'
  };
  return codes[team] || 'un';
};

// --- High Fidelity Graph Components ---

const DetailedTrendGraph: React.FC<{ isMini?: boolean }> = ({ isMini }) => {
  const points = [80, 90, 40, 95, 20, 100, 85, 60, 90, 95, 30, 70, 100, 90, 85, 40, 95, 75, 100, 95];
  const width = isMini ? 300 : 1200;
  const height = isMini ? 60 : 500;
  const padding = isMini ? 5 : 80;

  const pathD = `M ${points.map((p, i) => `${padding + (i * (width - padding * 2)) / (points.length - 1)} ${height - padding - (p / 100) * (height - padding * 2)}`).join(' L ')}`;

  return (
    <div className="w-full flex flex-col items-center">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {!isMini && (
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6600" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        )}
        <path
          d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
          fill={isMini ? "none" : "url(#trendGrad)"}
        />
        <path
          d={pathD}
          fill="none"
          stroke="#FF6600"
          strokeWidth={isMini ? 2 : 5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={isMini ? "" : "url(#glow)"}
        />
        {!isMini && points.map((p, i) => {
          const cx = padding + (i * (width - padding * 2)) / (points.length - 1);
          const cy = height - padding - (p / 100) * (height - padding * 2);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="6" fill="#0B0E11" stroke="#FF6600" strokeWidth="3" />
              <text x={cx} y={cy - 20} textAnchor="middle" className="text-[12px] font-black fill-white">{p}</text>
            </g>
          );
        })}
      </svg>
      {!isMini && (
        <div className="flex justify-between w-full px-20 mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>Match Session 01</span>
          <span>Match Session 10</span>
          <span>Match Session 20</span>
        </div>
      )}
    </div>
  );
};

const DetailedGoalChart: React.FC = () => {
  const data = [
    { label: 'JAN', val: 18 }, { label: 'FEB', val: 24 }, { label: 'MAR', val: 12 },
    { label: 'APR', val: 30 }, { label: 'MAY', val: 22 }, { label: 'JUN', val: 28 }
  ];
  const width = 1200;
  const height = 500;
  const padding = 80;
  const barW = 80;

  return (
    <div className="w-full flex flex-col items-center">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {data.map((d, i) => {
          const x = padding + (i * (width - padding * 2)) / (data.length - 1);
          const bH = (d.val / 35) * (height - padding * 2);
          return (
            <g key={i} className="group/bar">
              <rect 
                x={x - barW/2} y={height - padding - bH} width={barW} height={bH} 
                fill="#FF6600" rx="10" 
                className="transition-all duration-300 group-hover/bar:fill-white group-hover/bar:shadow-2xl"
              />
              <text x={x} y={height - padding - bH - 20} textAnchor="middle" className="text-xl font-black fill-white opacity-0 group-hover/bar:opacity-100 transition-opacity">{d.val}</text>
              <text x={x} y={height - 20} textAnchor="middle" className="text-xs font-black fill-slate-500 uppercase tracking-widest">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Matches: React.FC = () => {
  const { matches, isSyncing } = useLiveMatches();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'trend' | 'goals' | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const liveMatches = matches.filter(m => m.status === 'live');
  const pastMatches = matches.filter(m => m.status === 'finished').slice(0, 18);
  const nextMatch = useMemo(() => matches.find(m => m.status === 'upcoming'), [matches]);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#FF6600]/30 font-['Inter'] relative">
      
      {/* 1. MOVING TICKER HEADLINE BAR */}
      <div className="bg-orange-600 py-3 relative z-20 overflow-hidden border-b border-white/10">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Timer size={16} className="text-white animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">NEXT KICK-OFF:</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-950">
                {nextMatch ? `${nextMatch.homeTeam} VS ${nextMatch.awayTeam}` : "NO UPCOMING FIXTURES"}
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white bg-black/20 px-3 py-1 rounded-full">
                {nextMatch ? `${nextMatch.date} @ ${nextMatch.time}` : "-- : --"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* 2. HERO SECTION (With localized background image) */}
        <header className="relative pt-32 pb-48 text-center overflow-hidden border-b border-white/5">
          {/* BACKGROUND LOCALIZED TO HEADER */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover scale-110 opacity-40 animate-image-zoom" 
              alt="Football Stadium" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-3 bg-orange-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
               <Trophy size={16} /> OFFICIAL COMPETITION HUB
            </div>
            {/* Heading changed to Matches */}
            <h2 className="text-6xl md:text-[12rem] font-black uppercase tracking-tighter text-white mb-8 leading-[0.8] drop-shadow-2xl">
              Matches
            </h2>
            <p className="text-slate-300 text-xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300">
              "Relive professional results and track live session dynamics in real-time."
            </p>
          </div>
        </header>

        {/* 3. INTERACTIVE DATA MODAL TRIGGERS */}
        <main className="max-w-[1920px] mx-auto px-12 pb-32">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 -mt-24 mb-24 relative z-20">
            <button 
              onClick={() => setActiveModal('trend')}
              className="group relative h-44 bg-[#0B0E11]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex items-center justify-between px-16 overflow-hidden transition-all hover:border-[#FF6600] hover:shadow-[0_20px_60px_rgba(255,102,0,0.3)]"
            >
              <div className="flex items-center gap-8 z-10">
                <div className="p-6 bg-orange-600 rounded-[2rem] shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-4xl font-black uppercase tracking-tighter">Performance Trend</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Rolling Longitudinal Analysis</p>
                </div>
              </div>
              <Maximize2 size={24} className="text-slate-600 group-hover:text-white transition-colors z-10" />
              <div className="absolute top-0 right-0 opacity-5 -mr-16 -mt-16 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={280} />
              </div>
            </button>

            <button 
              onClick={() => setActiveModal('goals')}
              className="group relative h-44 bg-[#0B0E11]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex items-center justify-between px-16 overflow-hidden transition-all hover:border-blue-500 hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)]"
            >
              <div className="flex items-center gap-8 z-10">
                <div className="p-6 bg-blue-600 rounded-[2rem] shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                  <BarChart3 size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-4xl font-black uppercase tracking-tighter">Goal Distribution</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Monthly Efficiency Indices</p>
                </div>
              </div>
              <Maximize2 size={24} className="text-slate-600 group-hover:text-white transition-colors z-10" />
              <div className="absolute top-0 right-0 opacity-5 -mr-16 -mt-16 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={280} />
              </div>
            </button>
          </div>

          {/* 4. MATCH FEED SECTION */}
          <div className="space-y-32">
            {liveMatches.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-8">
                  <div className="w-2 h-16 bg-red-600 animate-pulse rounded-full" />
                  <div>
                    <h2 className="text-6xl font-black uppercase tracking-tighter">Live Sessions</h2>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-1">REAL-TIME DATA STREAM ACTIVE</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {liveMatches.map(match => <MatchCardBox key={match.id} match={match} />)}
                </div>
              </div>
            )}

            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-2 h-16 bg-[#FF6600] rounded-full" />
                  <div>
                    <h2 className="text-6xl font-black uppercase tracking-tighter">Verified Stream</h2>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-1">HISTORICAL RECORD ARCHIVE</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {pastMatches.map(match => <MatchCardBox key={match.id} match={match} />)}
              </div>
            </div>
          </div>

          {/* 5. ANALYTICS SUMMARY FOOTER */}
          <div className="mt-48 pt-24 border-t border-white/10 flex flex-col lg:flex-row items-end justify-between gap-16">
            <div className="max-w-xl space-y-8">
              <div className="flex items-center gap-6 text-[#FF6600]">
                <Shield size={48} />
                <h4 className="text-4xl font-black uppercase tracking-tighter italic">Registry Standard</h4>
              </div>
              <p className="text-slate-400 text-lg font-medium leading-relaxed italic border-l-4 border-orange-600 pl-8">
                "Verified longitudinal analysis finalized by Football Nova Technical Hub. All registry data is synchronized across global confederation servers every 800ms."
              </p>
            </div>
            <div className="flex-1 max-w-3xl bg-[#0B0E11]/90 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl flex items-center justify-between gap-12 shadow-4xl">
               <div className="shrink-0">
                  <div className="text-xs font-black text-[#FF6600] uppercase tracking-widest mb-2">Technical Velocity</div>
                  <div className="text-5xl font-black italic tracking-tighter leading-none text-white">8.2% Delta</div>
               </div>
               <div className="flex-grow">
                  <DetailedTrendGraph isMini />
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL OVERLAYS (Full-screen, Scrollable) */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-3xl" onClick={() => setActiveModal(null)} />
          <div className="relative bg-[#0B0E11] w-full h-full md:w-[96%] md:h-[94vh] md:rounded-[5rem] border border-white/10 shadow-[0_50px_200px_rgba(0,0,0,1)] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-700">
            
            {/* Modal Navigation Bar */}
            <div className="sticky top-0 z-10 px-16 py-10 bg-[#0B0E11]/95 backdrop-blur-2xl border-b border-white/10 flex justify-between items-center">
              <button 
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-4 px-10 py-5 bg-[#FF6600] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#0B0E11] transition-all shadow-2xl"
              >
                <ChevronRight size={20} className="rotate-180" /> Back to Match Stream
              </button>
              <div className="text-center">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">LONGITUDINAL INDEX</div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                  {activeModal === 'trend' ? 'Performance Velocity Report' : 'Goal Distribution Analytics'}
                </h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-6 bg-white/5 rounded-full hover:bg-red-600 transition-colors shadow-2xl border border-white/10">
                <X size={32} />
              </button>
            </div>

            <div className="p-24 flex flex-col items-center">
              <div className="text-center mb-24 max-w-4xl">
                <div className="inline-flex items-center gap-4 text-orange-500 font-black uppercase tracking-[0.6em] text-[11px] mb-8">
                  <Shield size={24} /> NOVA TECHNICAL ANALYTICS
                </div>
                <p className="text-slate-400 text-3xl font-medium leading-relaxed italic">
                  "Registry-verified efficiency indices calculated against global difficulty benchmarks."
                </p>
              </div>

              <div className="w-full bg-black/60 rounded-[5rem] p-24 border border-white/5 shadow-inner mb-24">
                 {activeModal === 'trend' ? <DetailedTrendGraph /> : <DetailedGoalChart />}
              </div>

              {/* High-Impact Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-7xl">
                {[
                  { icon: Zap, label: 'Technical Delta', val: '+4.2%' },
                  { icon: Target, label: 'Scoring Index', val: '2.84 / G' },
                  { icon: Activity, label: 'Performance Tier', val: 'Top 2%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-16 rounded-[4rem] border border-white/10 flex flex-col items-center text-center group hover:border-[#FF6600]/60 transition-all shadow-2xl">
                    <stat.icon size={56} className="text-[#FF6600] mb-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="text-7xl font-black italic tracking-tighter mb-6 leading-none text-white">{stat.val}</div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATERS */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-12 right-12 z-[100] p-10 bg-[#FF6600] text-white rounded-full shadow-[0_30px_70px_rgba(255,102,0,0.6)] border-2 border-white/20 transition-all duration-700 transform hover:scale-110 active:scale-90 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-48 opacity-0'}`}
      >
        <ArrowUp size={36} />
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 14px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF6600; border-radius: 20px; border: 4px solid #020617; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-image-zoom {
          animation: image-zoom 30s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

// --- High Fidelity Match Card Box ---
const MatchCardBox: React.FC<{ match: Match }> = ({ match }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/match/${match.id}`)}
      className="group bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[3.5rem] p-1.5 hover:border-[#FF6600]/60 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all duration-700 hover:-translate-y-4 cursor-pointer"
    >
      <div className="bg-[#0B0E11]/90 rounded-[3.3rem] p-12 flex flex-col h-full border border-white/5">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Trophy size={16} className="text-orange-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 truncate max-w-[160px] italic">{match.competition}</span>
          </div>
          <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">{match.status === 'finished' ? 'Final Index' : match.date}</span>
          </div>
        </div>

        {/* Teams - Bold Center Layout */}
        <div className="flex flex-col gap-10 mb-14 flex-grow justify-center">
          <div className="flex items-center justify-between group/line">
            <div className="flex items-center gap-8">
              <div className="w-16 h-10 rounded-lg shadow-2xl overflow-hidden border border-white/10 group-hover/line:scale-110 transition-transform duration-500">
                <img src={`https://flagcdn.com/w160/${getFlagCode(match.homeTeam)}.png`} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-4xl font-black uppercase tracking-tighter text-white group-hover/line:text-[#FF6600] transition-colors leading-none">{match.homeTeam}</span>
            </div>
            {match.status !== 'upcoming' && (
               <span className="text-5xl font-black italic tracking-tighter text-slate-600 group-hover/line:text-white transition-colors">{match.homeScore}</span>
            )}
          </div>

          <div className="flex items-center justify-between group/line">
            <div className="flex items-center gap-8">
              <div className="w-16 h-10 rounded-lg shadow-2xl overflow-hidden border border-white/10 group-hover/line:scale-110 transition-transform duration-500">
                <img src={`https://flagcdn.com/w160/${getFlagCode(match.awayTeam)}.png`} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-4xl font-black uppercase tracking-tighter text-white group-hover/line:text-[#FF6600] transition-colors leading-none">{match.awayTeam}</span>
            </div>
            {match.status !== 'upcoming' && (
               <span className="text-5xl font-black italic tracking-tighter text-slate-600 group-hover/line:text-white transition-colors">{match.awayScore}</span>
            )}
          </div>
        </div>

        {/* Venue / Location Row */}
        <div className="flex items-center gap-6 mb-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
           <div className="flex items-center gap-2"><MapPin size={12} className="text-[#FF6600]" /> {match.venue}</div>
           <div className="flex items-center gap-2"><Globe size={12} className="text-[#FF6600]" /> {match.location}</div>
        </div>

        {/* Status / Score Focus */}
        <div className="relative h-28 bg-black/40 rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-[#FF6600]/40 transition-all shadow-inner">
          {match.status === 'upcoming' ? (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">SESSION START</span>
              <span className="text-5xl font-black italic tracking-tighter text-[#FF6600] leading-none">{match.time}</span>
            </div>
          ) : (
            <div className="flex items-center gap-14">
               <span className="text-8xl font-black italic tracking-tighter leading-none tabular-nums text-white animate-in fade-in zoom-in-75 duration-700">{match.homeScore}</span>
               <div className="flex flex-col items-center gap-3">
                 <span className="text-[#FF6600] text-4xl font-black opacity-50">:</span>
                 <div className={`w-2.5 h-2.5 rounded-full ${match.status === 'live' ? 'bg-red-600 animate-pulse shadow-[0_0_20px_rgba(220,38,38,1)]' : 'bg-slate-700'}`} />
               </div>
               <span className="text-8xl font-black italic tracking-tighter leading-none tabular-nums text-white animate-in fade-in zoom-in-75 duration-700">{match.awayScore}</span>
            </div>
          )}
          
          <button className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center">
             <span className="bg-white text-black px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest shadow-4xl translate-y-24 group-hover:translate-y-0 transition-transform duration-700">Detailed Analytics Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Matches;
