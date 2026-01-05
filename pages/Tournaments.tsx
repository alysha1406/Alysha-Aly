
import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft,
  ChevronDown,
  TrendingUp,
  Layers
} from 'lucide-react';
import { TOURNAMENTS } from '../data/content';
import { LanguageContext } from '../App';
import { Tournament } from '../types';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('June 11, 2026 00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 dark:bg-black rounded-[4rem] p-10 md:p-20 border-2 border-orange-600/20 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-1000" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="text-center md:text-left space-y-6">
          <div className="text-orange-500 font-black uppercase tracking-[0.6em] text-[11px] mb-4">
             PRE-TOURNAMENT REGISTRY CLOCK
          </div>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">
            FIFA World Cup 2026
          </h2>
          <p className="text-slate-400 font-medium text-xl md:text-3xl italic max-w-2xl leading-relaxed">
            "The Largest Sporting Event in Global History Begins in United States, Mexico, and Canada."
          </p>
        </div>
        <div className="flex gap-4 md:gap-10">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hrs', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Sec', value: timeLeft.seconds }
          ].map((unit) => (
            <div key={unit.label} className="flex flex-col items-center group/unit">
              <div className="bg-slate-800/40 dark:bg-slate-950/60 backdrop-blur-3xl w-24 h-24 md:w-36 md:h-36 flex items-center justify-center rounded-[2.5rem] border border-white/5 shadow-2xl transition-all duration-500 hover:border-orange-600/40">
                <span className="text-4xl md:text-6xl font-black text-white tabular-nums italic">
                  {unit.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{unit.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TournamentCard: React.FC<{ tournament: Tournament; onClick: (t: Tournament) => void }> = ({ tournament, onClick }) => {
  const { lang } = useContext(LanguageContext);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateY(-10px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(tournament)}
      className="group bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border-2 border-transparent hover:border-orange-600/30 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col relative"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <img src={tournament.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
        <div className="absolute top-8 left-8 flex gap-4">
          <span className="bg-orange-600 text-white px-5 py-2 text-[10px] font-black uppercase tracking-widest shadow-2xl">
            {tournament.category.toUpperCase()}
          </span>
          <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest shadow-2xl ${
            tournament.status === 'ongoing' ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white'
          }`}>
            {tournament.status.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-8 left-10 flex items-center gap-6">
          <span className="text-3xl font-black text-white italic tracking-tighter bg-black/40 backdrop-blur-md px-6 py-2 rounded-lg border border-white/10">{tournament.logo}</span>
          <div className="w-14 h-9 overflow-hidden shadow-2xl rounded border border-white/20">
            <img src={`https://flagcdn.com/w160/${tournament.hostFlag}.png`} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      </div>
      <div className="p-12 flex flex-col flex-grow">
        <div className="flex-grow space-y-6">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors leading-[0.85]">
            {tournament.name[lang]}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium line-clamp-3 leading-relaxed italic">
            "{tournament.description[lang]}"
          </p>
        </div>
        <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] border-t-2 border-gray-100 dark:border-slate-800 pt-10 mt-10">
          <div className="flex items-center gap-4">
            <span className="text-orange-600">CYCLE</span> {tournament.year}
          </div>
          <div className="flex items-center gap-4 text-right">
             {tournament.host[lang]}
          </div>
        </div>
      </div>
    </div>
  );
};

const TournamentDetailModal: React.FC<{ tournament: Tournament; onClose: () => void }> = ({ tournament, onClose }) => {
  const { lang } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState<'matches' | 'standings' | 'awards' | 'media'>('standings');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-12">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0B0E11] w-full max-w-[1600px] h-full md:h-auto min-h-[90vh] md:rounded-[5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-700 border border-white/10">
        
        {/* PROFESSIONAL BACK BUTTON */}
        <button 
          onClick={onClose} 
          className="absolute top-12 left-12 z-[140] flex items-center gap-4 px-8 py-4 bg-orange-600 text-white rounded-full transition-all shadow-2xl group border border-orange-500/50"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-[0.3em] text-xs">Return to Registry</span>
        </button>

        <div className="shrink-0 relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={tournament.image} className="w-full h-full object-cover animate-image-zoom opacity-60" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/20 to-transparent" />
          <div className="absolute bottom-16 left-16 right-16 flex flex-col items-center text-center gap-12 w-full max-w-5xl mx-auto">
            <div className="animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                <div className="flex items-center justify-center gap-4 mb-6">
                   <div className="bg-orange-600 px-6 py-2 rounded-sm text-[11px] font-black text-white uppercase tracking-[0.5em] shadow-2xl">TECHNICAL DOSSIER</div>
                   {tournament.status === 'ongoing' && <div className="bg-red-600 px-6 py-2 rounded-sm text-[11px] font-black text-white uppercase tracking-[0.5em] animate-pulse text-[10px]">LIVE FEED ACTIVE</div>}
                </div>
                <h2 className="text-7xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-[0.75] mb-4">
                  {tournament.name[lang]}
                </h2>
                <div className="mt-12 flex flex-wrap justify-center gap-8">
                   <div className="flex items-center gap-5 text-white font-black uppercase tracking-[0.3em] text-xs bg-white/5 px-10 py-5 rounded-[2rem] backdrop-blur-3xl border border-white/10">
                      <span className="text-orange-500">HOST:</span> {tournament.host[lang]}
                   </div>
                   <div className="flex items-center gap-5 text-white font-black uppercase tracking-[0.3em] text-xs bg-white/5 px-10 py-5 rounded-[2rem] backdrop-blur-3xl border border-white/10">
                      <span className="text-orange-500">SEASON:</span> {tournament.year}
                   </div>
                </div>
            </div>
          </div>

          {/* SCROLL DOWN INDICATOR FOR USABILITY */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer opacity-70 hover:opacity-100" onClick={() => scrollContainerRef.current?.scrollBy({ top: 300, behavior: 'smooth' })}>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Scroll to Explore</span>
            <ChevronDown size={24} className="text-orange-600" />
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto custom-scrollbar p-16 lg:p-24 bg-white dark:bg-[#0B0E11]">
          <div className="flex justify-center gap-12 lg:gap-20 mb-20 border-b-2 border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar">
            {['standings', 'matches', 'awards'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-10 text-xs font-black uppercase tracking-[0.5em] transition-all border-b-4 shrink-0 ${
                  activeTab === tab 
                  ? 'border-orange-600 text-slate-900 dark:text-white' 
                  : 'border-transparent text-slate-400 hover:text-orange-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {activeTab === 'standings' && (
              <div className="space-y-24">
                {tournament.groups?.map((group, gIdx) => (
                  <div key={gIdx} className="bg-white dark:bg-black/40 rounded-[4rem] border-2 border-gray-100 dark:border-white/5 shadow-4xl overflow-hidden">
                    <div className="bg-[#1a1f26] px-14 py-8 flex justify-between items-center border-b border-white/5">
                      <span className="font-black uppercase tracking-[0.5em] text-xs text-orange-500">
                         {group.name} TECHNICAL DATA
                      </span>
                    </div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-gray-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/40">
                          <th className="px-14 py-10">Association / Club</th>
                          <th className="px-10 py-10 text-center">SESSION COUNT</th>
                          <th className="px-10 py-10 text-right">TECHNICAL PTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.teams.map((team, tIdx) => (
                          <tr key={tIdx} className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-orange-500/5 transition-all">
                            <td className="px-14 py-10 flex items-center gap-10 font-black dark:text-white text-3xl">
                              <div className="w-20 h-12 overflow-hidden shadow-2xl rounded-lg border border-white/10">
                                <img src={`https://flagcdn.com/w160/${team.flag}.png`} className="w-full h-full object-cover" alt="" />
                              </div>
                              <span className="tracking-tighter uppercase italic">{team.name}</span>
                            </td>
                            <td className="px-10 py-10 text-center text-slate-500 font-black italic text-3xl">{team.played}</td>
                            <td className="px-10 py-10 text-right font-black text-6xl text-orange-600 italic tracking-tighter">{team.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )) || (
                  <div className="py-60 text-center bg-slate-50 dark:bg-black/50 rounded-[5rem] border-2 border-dashed border-slate-100 dark:border-white/5">
                    <Layers size={80} className="mx-auto text-slate-200 dark:text-slate-800 mb-12 opacity-50" />
                    <h3 className="text-5xl font-black uppercase tracking-tighter dark:text-white mb-6">Draw Registry Sealed</h3>
                    <p className="text-slate-500 uppercase font-black text-xs tracking-[0.4em]">Official schedules are undergoing final synchronization.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="bg-slate-50 dark:bg-white/5 p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/5 flex items-center justify-between group">
                      <div className="space-y-4">
                        <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Match Session 0{i}</div>
                        <h4 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Awaiting Data</h4>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                           Venue Verification Pending
                        </div>
                      </div>
                      <ChevronRight size={32} className="text-slate-200 group-hover:text-orange-600 transition-colors" />
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'awards' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {tournament.awards?.map((award, aIdx) => (
                  <div key={aIdx} className="bg-white dark:bg-black/60 p-16 rounded-[4.5rem] border-2 border-gray-100 dark:border-white/5 shadow-2xl hover:border-orange-600 transition-all flex flex-col items-center text-center">
                    <div className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4 italic">{award.title[lang]}</div>
                    <div className="text-4xl font-black uppercase tracking-tighter dark:text-white leading-none">{award.winner}</div>
                  </div>
                )) || (
                  <div className="col-span-full py-60 text-center">
                    <h3 className="text-5xl font-black uppercase tracking-tighter dark:text-white mb-6">Honors Registry Pending</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Tournaments: React.FC = () => {
  const { lang, t } = useContext(LanguageContext);
  const [activeFilter, setActiveFilter] = useState<'all' | 'men' | 'women' | 'youth' | 'club'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const filteredTournaments = useMemo(() => {
    return TOURNAMENTS.filter(tour => {
      const matchesFilter = activeFilter === 'all' || tour.category === activeFilter;
      const matchesSearch = tour.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tour.host[lang].toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [lang, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      
      {/* PROFESSIONAL CENTERED HEADER */}
      <header className="bg-slate-950 py-48 md:py-64 text-center relative overflow-hidden border-b border-orange-600/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 animate-image-zoom blur-sm" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] opacity-90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-4 bg-orange-600 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.6em] mb-16 text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
             COMPETITION REGISTRY
          </div>
          <h1 className="text-7xl md:text-[14rem] font-black uppercase tracking-tighter text-white mb-10 leading-[0.75] drop-shadow-[0_40px_80px_rgba(0,0,0,1)] text-center">
            Tournaments
          </h1>
          <p className="text-slate-300 text-2xl md:text-5xl max-w-5xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300 drop-shadow-2xl text-center">
            "Official documentation of global football's most prestigious competitive cycles."
          </p>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-8 md:px-16 py-24 space-y-48">
        
        <section className="-mt-64 relative z-30">
          <CountdownTimer />
        </section>

        <div className="bg-white dark:bg-[#0B0E11] rounded-[4rem] shadow-2xl p-12 border-2 border-gray-100 dark:border-white/5 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex items-center gap-10 w-full lg:w-auto overflow-x-auto no-scrollbar pb-4 lg:pb-0">
             <div className="flex items-center gap-4 px-8 py-5 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 text-slate-400 font-black text-[11px] uppercase tracking-[0.4em] shrink-0">
               FILTER BY CATEGORIES
             </div>
             {['all', 'men', 'women', 'youth', 'club'].map(f => (
               <button
                 key={f}
                 onClick={() => { setActiveFilter(f as any); window.scrollTo({ top: 800, behavior: 'smooth' }); }}
                 className={`whitespace-nowrap px-14 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all border-2 ${
                   activeFilter === f 
                   ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-110' 
                   : 'bg-white dark:bg-black/40 text-slate-500 border-transparent hover:border-orange-500/40'
                 }`}
               >
                 {f === 'all' ? 'FULL REGISTRY' : f.toUpperCase()}
               </button>
             ))}
          </div>

          <div className="relative w-full lg:w-[600px] group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={28} />
            <input 
              type="text" 
              placeholder="Query Competition Database..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-20 pr-10 py-7 bg-slate-50 dark:bg-white/5 border-none rounded-[2.5rem] outline-none focus:ring-4 ring-orange-500/10 transition-all text-xl font-bold dark:text-white shadow-inner"
            />
          </div>
        </div>

        <div className="pb-60">
          <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-10">
            <div className="flex items-center gap-10">
              <div className="h-1.5 w-32 bg-orange-600 rounded-full" />
              <div className="text-center md:text-left">
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter dark:text-white">World Registry</h2>
                <p className="text-orange-600 font-black uppercase tracking-[0.5em] text-xs mt-2 italic">Official Competitive Cycles Indexed</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map(tour => (
                <TournamentCard 
                  key={tour.id} 
                  tournament={tour} 
                  onClick={setSelectedTournament} 
                />
              ))
            ) : (
              <div className="col-span-full py-80 text-center bg-slate-50 dark:bg-white/5 rounded-[6rem] border-4 border-dashed border-slate-100 dark:border-white/10 shadow-inner">
                <h3 className="text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8">Registry Search Failed.</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTournament && (
        <TournamentDetailModal 
          tournament={selectedTournament} 
          onClose={() => setSelectedTournament(null)} 
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 14px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF6600; border-radius: 20px; border: 4px solid #020617; }
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-image-zoom {
          animation: image-zoom 40s ease-in-out infinite alternate;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Tournaments;
