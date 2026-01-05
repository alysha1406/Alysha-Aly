
import React, { useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Shield, 
  Calendar, 
  Clock, 
  Users, 
  Activity,
  Trophy,
  Zap,
  Target,
  BarChart3,
  Thermometer,
  Wind
} from 'lucide-react';
import { LanguageContext } from '../App';
import { MATCHES } from '../data/content';

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

const MatchDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useContext(LanguageContext);

  const match = useMemo(() => MATCHES.find(m => m.id === id), [id]);

  if (!match) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-12 text-center">
        <Shield size={100} className="text-slate-800 mb-8" />
        <h2 className="text-4xl font-black uppercase text-white mb-6">Registry Not Found</h2>
        <button 
          onClick={() => navigate('/matches')}
          className="bg-orange-600 px-12 py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-2xl"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#FF6600]/30 font-['Inter'] relative overflow-x-hidden">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover scale-105 opacity-20" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-[#020617]" />
      </div>

      {/* 2. MATCH HERO HEADER */}
      <section className="relative pt-32 pb-24 z-10 overflow-hidden border-b border-orange-600/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 animate-image-zoom" 
            alt="Stadium Atmosphere" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <button 
            onClick={() => navigate('/matches')}
            className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#FF6600] transition-all group mb-16 backdrop-blur-xl"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Match Center
          </button>

          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="flex flex-col items-center gap-8 group/home">
               <div className="w-48 h-28 bg-white/5 rounded-[2rem] p-4 border border-white/10 shadow-2xl overflow-hidden group-hover/home:scale-110 transition-transform duration-700">
                  <img src={`https://flagcdn.com/w160/${getFlagCode(match.homeTeam)}.png`} className="w-full h-full object-cover rounded-xl" alt="" />
               </div>
               <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">{match.homeTeam}</h2>
            </div>

            <div className="flex flex-col items-center">
               <div className="bg-orange-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-2xl">
                 {match.competition}
               </div>
               
               <div className="flex items-center gap-12 bg-[#0B0E11]/80 backdrop-blur-2xl px-16 py-8 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                 {match.status === 'upcoming' ? (
                   <span className="text-7xl font-black italic tracking-tighter text-[#FF6600]">{match.time}</span>
                 ) : (
                   <>
                     <span className="text-9xl font-black italic tracking-tighter tabular-nums leading-none animate-in zoom-in-95">{match.homeScore}</span>
                     <span className="text-slate-800 text-6xl font-black">:</span>
                     <span className="text-9xl font-black italic tracking-tighter tabular-nums leading-none animate-in zoom-in-95">{match.awayScore}</span>
                   </>
                 )}
               </div>

               <div className="mt-8 flex items-center gap-4">
                 <div className={`w-2 h-2 rounded-full ${match.status === 'live' ? 'bg-red-600 animate-pulse' : 'bg-slate-500'}`} />
                 <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">{match.status}</span>
               </div>
            </div>

            <div className="flex flex-col items-center gap-8 group/away">
               <div className="w-48 h-28 bg-white/5 rounded-[2rem] p-4 border border-white/10 shadow-2xl overflow-hidden group-hover/away:scale-110 transition-transform duration-700">
                  <img src={`https://flagcdn.com/w160/${getFlagCode(match.awayTeam)}.png`} className="w-full h-full object-cover rounded-xl" alt="" />
               </div>
               <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">{match.awayTeam}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE INFORMATION GRID */}
      <main className="max-w-7xl mx-auto px-12 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* VENUE & LOGISTICS COLUMN */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-[#0B0E11]/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] shadow-4xl group hover:border-[#FF6600]/40 transition-all">
              <div className="flex items-center gap-4 text-[#FF6600] mb-10">
                <MapPin size={28} />
                <h3 className="text-2xl font-black uppercase tracking-tighter">Venue Registry</h3>
              </div>
              
              <div className="space-y-10">
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Stadium</div>
                  <div className="text-3xl font-black italic tracking-tighter">{match.venue}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location Hub</div>
                  <div className="text-2xl font-black italic tracking-tighter text-slate-300">{match.location}</div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance</div>
                    <div className="text-2xl font-black italic tracking-tighter text-orange-500">{match.attendance || 'TBD'}</div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registry ID</div>
                    <div className="text-2xl font-black italic tracking-tighter text-slate-600">#{match.id.split('-')[1]}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0B0E11]/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] shadow-4xl group hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-4 text-blue-500 mb-10">
                <Thermometer size={28} />
                <h3 className="text-2xl font-black uppercase tracking-tighter">Atmospheric Data</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-12">
                 <div className="flex flex-col gap-2">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temp</div>
                   <div className="text-4xl font-black italic tracking-tighter">18°C</div>
                 </div>
                 <div className="flex flex-col gap-2 text-right">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wind</div>
                   <div className="text-4xl font-black italic tracking-tighter">12 km/h</div>
                 </div>
                 <div className="flex flex-col gap-2">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pitch</div>
                   <div className="text-4xl font-black italic tracking-tighter">Dry</div>
                 </div>
                 <div className="flex flex-col gap-2 text-right">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Humidity</div>
                   <div className="text-4xl font-black italic tracking-tighter">62%</div>
                 </div>
              </div>
            </div>
          </div>

          {/* MATCH DETAILS COLUMN */}
          <div className="lg:col-span-8 space-y-12">
             <div className="bg-black/40 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/5 relative overflow-hidden">
               <div className="flex items-center gap-8 mb-16">
                  <div className="p-4 bg-[#FF6600] rounded-2xl shadow-2xl">
                    <Activity size={32} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Technical Summary</h3>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mt-1 italic">Verified Longitudinal Analysis Active</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="flex flex-col items-center p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <Target size={32} className="text-[#FF6600] mb-6" />
                    <div className="text-5xl font-black italic tracking-tighter mb-2">58%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Possession Index</div>
                  </div>
                  <div className="flex flex-col items-center p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <Zap size={32} className="text-orange-400 mb-6" />
                    <div className="text-5xl font-black italic tracking-tighter mb-2">14</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">registry shots</div>
                  </div>
                  <div className="flex flex-col items-center p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <Globe size={32} className="text-blue-500 mb-6" />
                    <div className="text-5xl font-black italic tracking-tighter mb-2">92%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Technical Pass Accuracy</div>
                  </div>
               </div>

               <div className="mt-16 p-12 bg-[#020617] rounded-[3rem] border border-white/5">
                 <div className="flex justify-between items-center mb-10">
                    <h4 className="text-xl font-black uppercase tracking-tight italic">Registry Referee Team</h4>
                    <span className="bg-white/5 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/10">Official Appointment</span>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center border border-orange-600/30">
                       <Shield size={40} className="text-orange-600" />
                    </div>
                    <div>
                       <div className="text-3xl font-black uppercase tracking-tighter text-white">{match.referee}</div>
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Member Association: NOVA TECHNICAL PANEL</div>
                    </div>
                 </div>
               </div>
             </div>

             {/* TIMELINE (Simulated) */}
             <div className="bg-white/5 backdrop-blur-2xl p-16 rounded-[4rem] border border-white/10">
               <div className="flex items-center gap-8 mb-16">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-2xl">
                    <Clock size={32} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Session Timeline</h3>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mt-1 italic">90 Minute Longitudinal Feed</p>
                  </div>
               </div>

               <div className="space-y-12 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-1 before:bg-white/5">
                  {[
                    { t: '12\'', e: 'Technical Strike', p: match.homeTeam, s: '1 - 0' },
                    { t: '45+2\'', e: 'Half-Time Registry Pause', p: 'SYSTEM', s: '1 - 0' },
                    { t: '68\'', e: 'Response Goal', p: match.awayTeam, s: '1 - 1' },
                    { t: '90+4\'', e: 'Session Finalization', p: 'SYSTEM', s: match.homeScore + ' - ' + match.awayScore }
                  ].map((evt, i) => (
                    <div key={i} className="flex items-center gap-10 relative z-10 animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 200}ms` }}>
                       <div className="w-16 h-16 bg-[#0B0E11] rounded-2xl flex items-center justify-center font-black text-[#FF6600] border border-white/10 shadow-xl shrink-0">{evt.t}</div>
                       <div className="flex-grow flex items-center justify-between bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-orange-500/40 transition-all group">
                          <div>
                            <div className="text-xl font-black uppercase tracking-tight text-white group-hover:text-orange-500 transition-colors">{evt.e}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{evt.p}</div>
                          </div>
                          <div className="text-3xl font-black italic tracking-tighter text-slate-400">{evt.s}</div>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* FOOTER CTA SECTION */}
      <section className="bg-orange-600 py-32 relative overflow-hidden z-10">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-fixed" />
         <div className="max-w-7xl mx-auto px-12 text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-10 leading-[0.8]">The Global Pitch Registry</h2>
            <p className="text-orange-100 text-2xl md:text-3xl font-medium max-w-4xl mx-auto mb-16 italic">
               "Authority over the world game begins with precise documentation of every professional encounter."
            </p>
            <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-[0.5em] text-orange-200">
               <span className="flex items-center gap-4"><Shield size={20} /> Encrypted Registry</span>
               <span className="flex items-center gap-4"><Globe size={20} /> Multi-Territory Access</span>
               <span className="flex items-center gap-4"><Activity size={20} /> Real-Time Dynamics</span>
            </div>
         </div>
      </section>

      <style>{`
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-image-zoom {
          animation: image-zoom 30s ease-in-out infinite alternate;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF6600; border-radius: 20px; border: 3px solid #020617; }
      `}</style>
    </div>
  );
};

export default MatchDetail;
