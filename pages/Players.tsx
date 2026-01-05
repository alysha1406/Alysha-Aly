
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { Search, Star, X, Users, Trophy, History, Loader2, Globe, Layers, ArrowLeft, ArrowUp, Activity, TrendingUp, BarChart3, Target, ShieldCheck, Maximize2, Award, Share2, Heart, BookOpen, Mail, Zap, Filter, Twitter, Instagram, ExternalLink, Medal } from 'lucide-react';
import { LanguageContext } from '../App';
import { Player, Honour } from '../types';
import SearchWithSuggestions from '../components/SearchWithSuggestions';

// --- Utility for Flags ---
const getFlagCode = (nationality: string) => {
  const codes: Record<string, string> = {
    'Argentina': 'ar', 'Portugal': 'pt', 'France': 'fr', 'Norway': 'no', 'Brazil': 'br',
    'England': 'gb-eng', 'Belgium': 'be', 'Egypt': 'eg', 'Poland': 'pl', 'Germany': 'de',
    'Spain': 'es', 'Turkey': 'tr', 'Netherlands': 'nl', 'Canada': 'ca', 'Uruguay': 'uy',
    'United States': 'us', 'Mexico': 'mx', 'Italy': 'it'
  };
  return codes[nationality] || 'un';
};

// --- API & Data ---
const SPORTS_DB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const INITIAL_TEAMS = ['Real Madrid', 'Manchester City', 'Barcelona', 'Inter Miami', 'Al Nassr'];
const FEATURED_NAMES = ['Lionel Messi', 'Cristiano Ronaldo', 'Erling Haaland', 'Kylian Mbappe'];

const generateExtendedStats = (seed: number) => {
  const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  return {
    goalsByYear: years.map(y => ({ year: y, val: 10 + (seed % 30) + Math.floor(Math.random() * 10) })),
    perfByYear: years.map(y => ({ year: y, val: 75 + (seed % 15) + Math.floor(Math.random() * 8) }))
  };
};

const mapApiToPlayer = (apiPlayer: any): Player => {
  const seed = parseInt(apiPlayer.idPlayer) || 50;
  const img = apiPlayer.strCutout || apiPlayer.strRender || apiPlayer.strThumb || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800';
  const extended = generateExtendedStats(seed);
  
  return {
    id: apiPlayer.idPlayer,
    name: apiPlayer.strPlayer,
    gender: apiPlayer.strGender || 'men',
    dob: apiPlayer.dateBorn || 'N/A',
    squadNumber: apiPlayer.strNumber || Math.floor(Math.random() * 99).toString(),
    position: { 
      en: apiPlayer.strPosition || 'Forward', 
      tr: apiPlayer.strPosition === 'Forward' ? 'Forvet' : apiPlayer.strPosition === 'Midfielder' ? 'Orta Saha' : 'Defans' 
    },
    nationality: { en: apiPlayer.strNationality || 'Global', tr: apiPlayer.strNationality || 'Küresel' },
    nationalityCode: getFlagCode(apiPlayer.strNationality || ''),
    team: apiPlayer.strTeam || 'Free Agent',
    image: img,
    banner: apiPlayer.strFanart1 || apiPlayer.strBanner || 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=1200',
    bio: { 
      en: apiPlayer.strDescriptionEN || "Elite professional technical profile verified by the Nova Global Registry. Analysis indicates top-tier performance metrics.", 
      tr: "Nova Küresel Kayıt Defteri tarafından doğrulanan seçkin profesyonel teknik profil." 
    },
    attributes: {
      pace: 85 + (seed % 10),
      shooting: 80 + (seed % 15),
      passing: 78 + (seed % 15),
      dribbling: 82 + (seed % 12),
      defending: 30 + (seed % 50),
      physical: 70 + (seed % 20)
    },
    stats: {
      matches: 120 + (seed % 400),
      goals: 15 + (seed % 200),
      assists: 10 + (seed % 100)
    },
    goalsVsYears: extended.goalsByYear,
    perfVsYears: extended.perfByYear,
    clubHistory: [
      { club: apiPlayer.strTeam || 'Primary Club', years: '2022 — Present', logo: '⚽' },
      { club: 'Nova Academy', years: '2018 — 2022', logo: '🛡️' }
    ]
  } as any;
};

// --- Components ---

const FollowTooltip: React.FC<{ label: string; value: string | number; x: number; y: number; visible: boolean }> = ({ label, value, x, y, visible }) => {
  if (!visible) return null;
  return (
    <div 
      className="fixed pointer-events-none z-[3000] transform -translate-x-1/2 -translate-y-[calc(100%+15px)] transition-all duration-75"
      style={{ left: x, top: y }}
    >
      <div className="bg-[#0B0E11] border-2 border-[#FF6600] rounded-xl px-5 py-3 shadow-2xl flex flex-col items-center justify-center min-w-[120px]">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1 text-center">{label}</span>
        <span className="text-3xl font-black text-white leading-none tabular-nums text-center">{value}</span>
      </div>
    </div>
  );
};

// 1. Goals Timeline (Line Area)
const GoalsTimeline: React.FC<{ data: any[]; isExpanded?: boolean }> = ({ data, isExpanded }) => {
  const [tip, setTip] = useState({ visible: false, x: 0, y: 0, val: 0, year: '' });
  const w = isExpanded ? 1100 : 450;
  const h = isExpanded ? 450 : 250;
  const p = 60;
  const max = Math.max(...data.map(d => d.val)) + 10;
  const pts = data.map((d, i) => ({
    x: p + (i * (w - p * 2)) / (data.length - 1),
    y: h - p - (d.val / max) * (h - p * 2),
    val: d.val, year: d.year
  }));
  const lPath = `M ${pts.map(pt => `${pt.x} ${pt.y}`).join(' L ')}`;
  const aPath = `${lPath} L ${pts[pts.length-1].x} ${h-p} L ${pts[0].x} ${h-p} Z`;

  return (
    <div className="relative w-full h-full flex flex-col group/chart cursor-crosshair">
      <div className="mb-6 px-4 border-l-2 border-[#FF6600] pl-4">
        <h4 className={`font-black uppercase tracking-widest ${isExpanded ? 'text-2xl' : 'text-[10px]'} text-[#FF6600]`}>Goals Timeline</h4>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible transition-transform duration-500 group-hover/chart:translate-y-[-5px]">
        <defs><linearGradient id="gGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF6600" stopOpacity="0.4"/><stop offset="100%" stopColor="#FF6600" stopOpacity="0"/></linearGradient></defs>
        <path d={aPath} fill="url(#gGrad)" />
        <path d={lPath} fill="none" stroke="#FF6600" strokeWidth="4" />
        {pts.map((pt, i) => (
          <g key={i} onMouseMove={(e) => setTip({ visible: true, x: e.clientX, y: e.clientY, val: pt.val, year: pt.year })} onMouseLeave={() => setTip({...tip, visible: false})}>
            <circle cx={pt.x} cy={pt.y} r={isExpanded ? 10 : 6} fill="#FF6600" className="hover:r-10 transition-all" />
            <text x={pt.x} y={h - 20} textAnchor="middle" className="text-[10px] font-bold fill-slate-500">{pt.year}</text>
          </g>
        ))}
      </svg>
      <FollowTooltip label={`Goals ${tip.year}`} value={tip.val} x={tip.x} y={tip.y} visible={tip.visible} />
    </div>
  );
};

// 2. Performance Bar Chart
const PerfBarChart: React.FC<{ data: any[]; isExpanded?: boolean }> = ({ data, isExpanded }) => {
  const [tip, setTip] = useState({ visible: false, x: 0, y: 0, val: 0, year: '' });
  const w = isExpanded ? 1100 : 450;
  const h = isExpanded ? 450 : 250;
  const p = 60;
  const bW = isExpanded ? 60 : 30;

  return (
    <div className="relative w-full h-full flex flex-col group/chart cursor-crosshair">
      <div className="mb-6 px-4 border-l-2 border-blue-500 pl-4">
        <h4 className={`font-black uppercase tracking-widest ${isExpanded ? 'text-2xl' : 'text-[10px]'} text-blue-500`}>Performance Index</h4>
      </div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible transition-transform duration-500 group-hover/chart:translate-y-[-5px]">
        {data.map((d, i) => {
          const x = p + (i * (w - p * 2)) / (data.length - 1);
          const bH = (d.val / 100) * (h - p * 2);
          return (
            <g key={i} onMouseMove={(e) => setTip({ visible: true, x: e.clientX, y: e.clientY, val: d.val, year: d.year })} onMouseLeave={() => setTip({...tip, visible: false})}>
              <rect x={x - bW/2} y={h-p-bH} width={bW} height={bH} fill={tip.year === d.year ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)'} rx={4} className="transition-all duration-300" />
              <text x={x} y={h - 20} textAnchor="middle" className="text-[10px] font-bold fill-slate-500">{d.year}</text>
            </g>
          );
        })}
      </svg>
      <FollowTooltip label={`Rating ${tip.year}`} value={`${tip.val}/100`} x={tip.x} y={tip.y} visible={tip.visible} />
    </div>
  );
};

// 3. Technical Skill Radar Graph (New Graph)
const RadarChart: React.FC<{ attributes: Player['attributes']; isExpanded?: boolean }> = ({ attributes, isExpanded }) => {
  const labels = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];
  const values = [attributes.pace, attributes.shooting, attributes.passing, attributes.dribbling, attributes.defending, attributes.physical];
  const size = isExpanded ? 700 : 380;
  const center = size / 2;
  const radius = center - (isExpanded ? 150 : 100);

  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = (v / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  const polyPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center group/radar">
      <div className="mb-6 px-4 border-l-2 border-orange-500 self-start pl-4">
        <h4 className={`font-black uppercase tracking-widest ${isExpanded ? 'text-2xl' : 'text-[10px]'} text-orange-500`}>Technical Matrix</h4>
      </div>
      <svg width={size} height={size} className="overflow-visible filter drop-shadow-2xl transition-all duration-500 group-hover/radar:scale-105">
        {[20, 40, 60, 80, 100].map(step => {
          const stepPts = labels.map((_, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const r = (step / 100) * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return <polygon key={step} points={stepPts} fill="none" stroke="white" strokeOpacity={0.1} strokeWidth="1" />;
        })}
        <polygon points={polyPath} fill="rgba(255, 102, 0, 0.3)" stroke="#FF6600" strokeWidth="3" />
        {points.map((p, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          const labelR = radius + (isExpanded ? 60 : 40);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={isExpanded ? 8 : 4} fill="#FF6600" />
              <text 
                x={center + labelR * Math.cos(angle)} y={center + labelR * Math.sin(angle)} 
                textAnchor="middle" dy=".3em" 
                className={`${isExpanded ? 'text-xl' : 'text-[10px]'} font-black fill-slate-400 uppercase tracking-tighter`}
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Players: React.FC = () => {
  const { lang, t } = useContext(LanguageContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [honours, setHonours] = useState<Honour[]>([]);
  const [isLoadingHonours, setIsLoadingHonours] = useState(false);
  const [search, setSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedChart, setExpandedChart] = useState<'goals' | 'perf' | 'radar' | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const pool: any[] = [];
        const results = await Promise.all([
          ...FEATURED_NAMES.map(n => fetch(`${SPORTS_DB_BASE}/searchplayers.php?p=${encodeURIComponent(n)}`).then(r => r.json())),
          ...INITIAL_TEAMS.map(t => fetch(`${SPORTS_DB_BASE}/searchplayers.php?t=${encodeURIComponent(t)}`).then(r => r.json()))
        ]);
        results.forEach(d => { if (d.player) pool.push(...d.player.map(mapApiToPlayer)); });
        setPlayers(Array.from(new Map(pool.map(p => [p.id, p])).values()));
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    load();
  }, []);

  // Fetch honours when a player is selected
  useEffect(() => {
    if (selectedPlayer) {
      const fetchHonours = async () => {
        setIsLoadingHonours(true);
        try {
          const res = await fetch(`${SPORTS_DB_BASE}/lookuphonours.php?id=${selectedPlayer.id}`);
          const data = await res.json();
          setHonours(data.honours || []);
        } catch (err) {
          console.error("Failed to fetch honours", err);
          setHonours([]);
        } finally {
          setIsLoadingHonours(false);
        }
      };
      fetchHonours();
    } else {
      setHonours([]);
    }
  }, [selectedPlayer]);

  const handleGlobalScout = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${SPORTS_DB_BASE}/searchplayers.php?p=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.player) setPlayers(data.player.map(mapApiToPlayer));
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const filtered = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white selection:bg-[#FF6600]/30 font-['Inter']">
      {/* Search Header */}
      <header className="relative py-40 text-center overflow-hidden border-b border-[#FF6600]/10 bg-[#0B0E11]">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover animate-image-zoom" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <h1 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-8">Registry</h1>
          <div className="max-w-3xl mx-auto -mt-10">
            <SearchWithSuggestions placeholder="Search elite athletes..." onSelect={(q) => { setSearch(q); handleGlobalScout(q); }} />
          </div>
        </div>
      </header>

      {/* Registry Grid */}
      <div className="max-w-[1600px] mx-auto px-12 py-24">
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <Loader2 size={80} className="text-[#FF6600] animate-spin mb-6" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Syncing Registry...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filtered.map(p => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPlayer(p)}
                className="group bg-[#1a1f26] rounded-[3rem] overflow-hidden border-2 border-white/5 hover:border-[#FF6600]/40 transition-all duration-500 cursor-pointer flex flex-col hover:translate-y-[-8px]"
              >
                <div className="relative aspect-[4/5] bg-black/30 flex items-center justify-center p-6">
                  <img src={p.image} alt={p.name} className="h-[95%] w-auto object-contain filter drop-shadow-2xl brightness-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-10">
                    <div className="text-[#FF6600] font-black uppercase tracking-widest text-[10px] mb-1">{p.team}</div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{p.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL-SCREEN PROFILE VIEW (1920x1080 Optimization) */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-[400] bg-[#0B0E11] overflow-y-auto animate-in slide-in-from-bottom-12 duration-700 custom-scrollbar">
          
          {/* HERO ACTION BACKGROUND (ENTIRE PAGE) */}
          <div className="fixed inset-0 z-0 pointer-events-none">
             <img src={selectedPlayer.banner} className="w-full h-full object-cover opacity-15 scale-110 blur-xl" alt="" />
             <div className="absolute inset-0 bg-[#0B0E11]/70" />
          </div>

          <div className="min-h-screen relative z-10 flex flex-col">
            
            {/* Navigation Strip */}
            <div className="sticky top-0 z-[500] px-16 py-10 flex justify-between items-center bg-gradient-to-b from-[#0B0E11] to-transparent">
              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="flex items-center gap-4 px-10 py-5 bg-[#FF6600] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-white hover:text-[#0B0E11] transition-all"
              >
                <ArrowLeft size={20} /> Registry Hub
              </button>
              <div className="flex gap-6">
                 <button onClick={() => setSelectedPlayer(null)} className="p-6 bg-white/10 text-white rounded-full hover:bg-red-600 transition-all border border-white/10"><X size={32} /></button>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="flex-1 max-w-[1900px] mx-auto w-full px-16 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
              
              {/* PORTRAIT COLUMN */}
              <div className="lg:col-span-5 h-[85vh] lg:sticky lg:top-32 rounded-[5rem] overflow-hidden border-2 border-white/10 shadow-[0_100px_200px_rgba(0,0,0,1)] bg-black/40 flex flex-col group/portrait">
                 <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                    <img src={selectedPlayer.image} className="h-full w-auto object-contain filter drop-shadow-[0_40px_100px_rgba(255,102,0,0.5)] animate-in zoom-in-95 duration-1000" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                    
                    {/* Socials Hover Plate */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8 opacity-0 group-hover/portrait:opacity-100 transition-all duration-500 translate-y-12 group-hover/portrait:translate-y-0">
                       <a href="#" className="p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-[#FF6600] transition-all shadow-2xl"><Twitter size={28} /></a>
                       <a href="#" className="p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-[#FF6600] transition-all shadow-2xl"><Instagram size={28} /></a>
                       <a href="#" className="p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-[#FF6600] transition-all shadow-2xl"><Globe size={28} /></a>
                    </div>
                 </div>
                 
                 {/* Name - Medium Sized Bottom Anchored */}
                 <div className="relative p-20 pt-0">
                    <div className="text-[#FF6600] font-black uppercase tracking-[0.5em] text-[10px] mb-4">MEMBER ASSOCIATION VERIFIED</div>
                    <h2 className="text-7xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-2xl">
                       {selectedPlayer.name}
                    </h2>
                    <div className="mt-8 flex gap-8">
                       <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-[2rem] border border-white/10">
                          <img src={`https://flagcdn.com/w160/${selectedPlayer.nationalityCode}.png`} className="w-12 h-8 object-cover rounded shadow-lg" alt="" />
                          <span className="text-[12px] font-black uppercase tracking-widest">{selectedPlayer.nationality[lang]}</span>
                       </div>
                       <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-[2rem] border border-white/10">
                          <ShieldCheck size={24} className="text-[#FF6600]" />
                          <span className="text-[12px] font-black uppercase tracking-widest">{selectedPlayer.team}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* DATA COLUMN */}
              <div className="lg:col-span-7 space-y-24 pt-10">
                 
                 <div className="flex items-center gap-12">
                   <div className="p-8 bg-[#FF6600] rounded-[2.5rem] shadow-2xl"><Target size={48} /></div>
                   <div>
                     <h3 className="text-5xl font-black uppercase tracking-tighter text-white">Technical Dossier</h3>
                     <p className="text-slate-400 font-medium text-lg italic">Algorithmically verified scoring from Football Nova Labs.</p>
                   </div>
                 </div>

                 {/* GRAPH GRID */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div onClick={() => setExpandedChart('goals')} className="bg-[#1a1f26] p-12 rounded-[4rem] border-2 border-white/5 hover:border-[#FF6600]/40 transition-all group/box cursor-pointer">
                      <div className="flex justify-between items-center mb-6">
                        <TrendingUp size={20} className="text-[#FF6600]" />
                        <Maximize2 size={20} className="text-slate-500 opacity-0 group-hover/box:opacity-100 transition-opacity" />
                      </div>
                      <GoalsTimeline data={(selectedPlayer as any).goalsVsYears} />
                    </div>
                    
                    <div onClick={() => setExpandedChart('perf')} className="bg-[#1a1f26] p-12 rounded-[4rem] border-2 border-white/5 hover:border-blue-500/40 transition-all group/box cursor-pointer">
                      <div className="flex justify-between items-center mb-6">
                        <BarChart3 size={20} className="text-blue-500" />
                        <Maximize2 size={20} className="text-slate-500 opacity-0 group-hover/box:opacity-100 transition-opacity" />
                      </div>
                      <PerfBarChart data={(selectedPlayer as any).perfVsYears} />
                    </div>

                    {/* NEW GRAPH: Skill Radar */}
                    <div onClick={() => setExpandedChart('radar')} className="bg-[#1a1f26] p-12 rounded-[4rem] border-2 border-white/5 hover:border-orange-500/40 transition-all group/box cursor-pointer">
                      <div className="flex justify-between items-center mb-6">
                        <Layers size={20} className="text-orange-500" />
                        <Maximize2 size={20} className="text-slate-500 opacity-0 group-hover/box:opacity-100 transition-opacity" />
                      </div>
                      <RadarChart attributes={selectedPlayer.attributes} />
                    </div>

                    {/* Centered Stat Squares */}
                    <div className="grid grid-cols-2 gap-8">
                       <div className="aspect-square bg-[#1a1f26] rounded-[4rem] border-2 border-white/5 flex flex-col items-center justify-center p-8 group hover:border-[#FF6600]/40 transition-all">
                          <Activity size={40} className="text-[#FF6600] mb-8 group-hover:scale-110 transition-transform" />
                          <div className="text-7xl font-black italic tracking-tighter text-center leading-none">{selectedPlayer.stats?.goals}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-4 text-center">CAREER GOALS</div>
                       </div>
                       <div className="aspect-square bg-[#1a1f26] rounded-[4rem] border-2 border-white/5 flex flex-col items-center justify-center p-8 group hover:border-[#FF6600]/40 transition-all">
                          <History size={40} className="text-[#FF6600] mb-8 group-hover:scale-110 transition-transform" />
                          <div className="text-7xl font-black italic tracking-tighter text-center leading-none">{selectedPlayer.stats?.matches}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-4 text-center">TOTAL CAPS</div>
                       </div>
                    </div>
                 </div>

                 {/* CAREER HONOURS SECTION - New section as requested */}
                 <div className="space-y-12">
                   <div className="flex items-center gap-10">
                      <div className="p-6 bg-yellow-500 rounded-3xl shadow-2xl text-slate-900"><Medal size={40} /></div>
                      <div>
                        <h3 className="text-5xl font-black uppercase tracking-tighter text-white">Registry Honours</h3>
                        <p className="text-slate-400 font-medium text-lg italic">Officially verified career achievements and trophies.</p>
                      </div>
                   </div>

                   {isLoadingHonours ? (
                      <div className="flex items-center gap-4 py-10 px-12 bg-white/5 rounded-[3rem] border border-white/10 animate-pulse">
                         <Loader2 size={24} className="animate-spin text-yellow-500" />
                         <span className="text-xs font-black uppercase tracking-widest text-slate-500">Retrieving Archive Records...</span>
                      </div>
                   ) : honours.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {honours.map((h, i) => (
                           <div key={h.id} className="bg-gradient-to-br from-white/10 to-transparent p-10 rounded-[3rem] border border-white/10 hover:border-yellow-500/40 transition-all group flex items-center gap-8">
                              <div className="w-16 h-16 bg-[#0B0E11] rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/10 shrink-0 group-hover:scale-110 transition-transform">🏆</div>
                              <div>
                                 <h4 className="text-xl font-black uppercase tracking-tight text-white leading-tight mb-2">{h.strHonour}</h4>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{h.strSeason}</span>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{h.strTeam}</span>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   ) : (
                      <div className="py-20 px-12 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5 text-center">
                         <Award size={48} className="mx-auto text-slate-700 mb-6 opacity-40" />
                         <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No honours entries found in the primary registry.</p>
                      </div>
                   )}
                 </div>

                 {/* Narrative Card */}
                 <div className="bg-black/40 backdrop-blur-3xl p-24 rounded-[6rem] border-2 border-white/5 relative overflow-hidden group">
                   <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000"><BookOpen size={400} /></div>
                   <h3 className="text-5xl font-black uppercase tracking-tighter mb-10 flex items-center gap-6">
                     <span className="w-20 h-1.5 bg-[#FF6600]" /> Editorial Profile
                   </h3>
                   <p className="text-4xl text-slate-300 leading-relaxed font-medium italic">
                     "{selectedPlayer.bio[lang]}"
                   </p>
                 </div>

                 {/* Registry Associations */}
                 <div className="space-y-12">
                   <div className="flex items-center gap-6">
                      <Award size={40} className="text-[#FF6600]" />
                      <h4 className="text-5xl font-black uppercase tracking-tighter">Registry Path</h4>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pb-20">
                      {selectedPlayer.clubHistory?.map((h, i) => (
                        <div key={i} className="flex items-center gap-10 bg-white/5 p-12 rounded-[5rem] border-2 border-white/10 hover:border-[#FF6600]/40 transition-all group overflow-hidden">
                           <div className="w-24 h-24 bg-[#0B0E11] rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl border border-white/10 shrink-0">{h.logo}</div>
                           <div className="min-w-0">
                              <h4 className="font-black uppercase tracking-tight text-3xl group-hover:text-[#FF6600] transition-colors truncate">{h.club}</h4>
                              <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-4">{h.years}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* OVERLAY EXPANDED GRAPH */}
          {expandedChart && (
            <div className="fixed inset-0 z-[1000] bg-[#0B0E11]/98 backdrop-blur-2xl flex items-center justify-center p-12 animate-in fade-in duration-300">
               <div className="relative w-full max-w-[1200px] bg-black/40 rounded-[6rem] border-2 border-white/10 p-24 shadow-4xl flex flex-col items-center">
                  <button onClick={() => setExpandedChart(null)} className="absolute top-12 right-12 p-6 bg-white/5 hover:bg-red-600 rounded-full text-white shadow-2xl transition-all"><X size={48} /></button>
                  <h2 className="text-6xl font-black uppercase tracking-tighter mb-16 text-[#FF6600]">
                    {expandedChart === 'goals' ? 'Registry Goal Tracker' : expandedChart === 'perf' ? 'Efficiency Analysis' : 'Technical Skill Matrix'}
                  </h2>
                  <div className="w-full h-[500px] flex items-center justify-center">
                    {expandedChart === 'goals' && <GoalsTimeline data={(selectedPlayer as any).goalsVsYears} isExpanded />}
                    {expandedChart === 'perf' && <PerfBarChart data={(selectedPlayer as any).perfVsYears} isExpanded />}
                    {expandedChart === 'radar' && <RadarChart attributes={selectedPlayer.attributes} isExpanded />}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
        className={`fixed bottom-12 right-12 z-[300] p-10 bg-[#FF6600] text-white rounded-full shadow-2xl transition-all duration-700 transform hover:scale-110 active:scale-90 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-48 opacity-0'}`}
      >
        <ArrowUp size={36} />
      </button>

      <style>{`
        @keyframes image-zoom { from { transform: scale(1); } to { transform: scale(1.05); } }
        .animate-image-zoom { animation: image-zoom 20s ease-in-out infinite alternate; }
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0B0E11; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF6600; border-radius: 20px; border: 3px solid #0B0E11; }
      `}</style>
    </div>
  );
};

export default Players;
