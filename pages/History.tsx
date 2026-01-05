
import React, { useState, useContext, useRef, useMemo } from 'react';
// Correcting the missing import for useNavigate
import { useNavigate } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Calendar, 
  Trophy, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  TrendingUp, 
  Users,
  Shield,
  PlayCircle,
  Download,
  Newspaper,
  BookOpen,
  ArrowUpRight,
  Clock,
  Globe,
  Search,
  X
} from 'lucide-react';
import { LanguageContext } from '../App';
import { RANKINGS_2023, RANKINGS_2022 } from '../data/content';
import { RankingItem } from '../types';

const ERAS = ['All', '1900-1950', '1950-1980', '1980-2000', 'Modern Era'];

const MILESTONES = [
  {
    year: '1904',
    era: '1900-1950',
    title: { en: 'Foundation of Global Football', tr: 'Küresel Futbolun Kuruluşu' },
    desc: { en: 'Football Nova was established in Paris, marking the birth of international football governance.', tr: 'Futbol Nova, uluslararası futbol yönetiminin doğuşunu işaret ederek Paris\'te kuruldu.' },
    image: 'https://images.unsplash.com/photo-1541534741688-6078c64b5913?auto=format&fit=crop&q=80&w=800'
  },
  {
    year: '1930',
    era: '1900-1950',
    title: { en: 'First World Championship', tr: 'İlk Dünya Şampiyonası' },
    desc: { en: 'Uruguay hosted the inaugural tournament, defeating Argentina in the final to become champions.', tr: 'Uruguay, finalde Arjantin\'i yenerek şampiyon olan ilk turnuvaya ev sahipliği yaptı.' },
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'
  },
  {
    year: '1954',
    era: '1950-1980',
    title: { en: 'Miracle of Bern', tr: 'Bern Mucizesi' },
    desc: { en: 'West Germany overcame the invincible "Magical Magyars" of Hungary in a legendary final.', tr: 'Batı Almanya, efsanevi bir finalde Macaristan\'ın yenilmez "Sihirli Macarlarını" mağlup etti.' },
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=1200'
  },
  {
    year: '1970',
    era: '1950-1980',
    title: { en: 'The Perfect Team', tr: 'Mükemmel Takım' },
    desc: { en: 'Pele and Brazil showcased "Joga Bonito" in Mexico, winning their third title permanently.', tr: 'Pele ve Brezilya, Meksika\'da "Joga Bonito"yu sergileyerek üçüncü şampiyonluklarını kalıcı olarak kazandılar.' },
    image: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=1200'
  },
  {
    year: '1991',
    era: '1980-2000',
    title: { en: 'Women\'s Revolution', tr: 'Kadın Devrimi' },
    desc: { en: 'The first Women\'s World Cup took place in China, won by the United States.', tr: 'Çin\'de düzenlenen ilk Kadınlar Dünya Kupası\'nı Amerika Birleşik Devletleri kazandı.' },
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6d77?auto=format&fit=crop&q=80&w=800'
  },
  {
    year: '2022',
    era: 'Modern Era',
    title: { en: 'The Greatest Final', tr: 'En Büyük Final' },
    desc: { en: 'Messi led Argentina to glory in Qatar after a dramatic shootout against France.', tr: 'Messi, Fransa\'ya karşı oynanan dramatik bir penaltı atışından sonra Arjantin\'i Katar\'da zafere taşıdı.' },
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'
  }
];

const SUCCESSFUL_NATIONS = [
  { name: 'Brazil', titles: 5, color: '#facc15' },
  { name: 'Germany', titles: 4, color: '#000000' },
  { name: 'Italy', titles: 4, color: '#1d4ed8' },
  { name: 'Argentina', titles: 3, color: '#06b6d4' },
  { name: 'France', titles: 2, color: '#1e3a8a' },
  { name: 'Uruguay', titles: 2, color: '#38bdf8' }
];

const History: React.FC = () => {
  const { lang, theme, t } = useContext(LanguageContext);
  // Initializing the navigate function using useNavigate hook
  const navigate = useNavigate();
  const [activeEra, setActiveEra] = useState('All');
  const [activeMilestone, setActiveMilestone] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter(m => activeEra === 'All' || m.era === activeEra);
  }, [activeEra]);

  const maxTitles = Math.max(...SUCCESSFUL_NATIONS.map(n => n.titles));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-slate-950 py-32 md:py-48 text-center relative overflow-hidden border-b border-orange-600/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover animate-image-zoom opacity-60" 
            alt="History Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] opacity-80" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-orange-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
             <BookOpen size={16} /> THE WORLD ARCHIVE hub
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-8 leading-[0.8] drop-shadow-2xl">
            {t.history}
          </h1>
          <p className="text-slate-300 text-xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300">
            "Tracing the centenary legacy of the world's greatest sporting phenomenon."
          </p>
        </div>
      </header>

      {/* Timeline Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
              <div className="flex items-center gap-8">
                <div className="h-1 w-20 bg-orange-600" />
                <h2 className="text-5xl font-black uppercase tracking-tighter dark:text-white">Centenary Stream</h2>
              </div>
              <div className="flex bg-white dark:bg-slate-800 p-2 rounded-[1.5rem] shadow-2xl overflow-x-auto no-scrollbar border border-slate-100 dark:border-slate-700">
                 {ERAS.map(era => (
                   <button
                     key={era}
                     onClick={() => setActiveEra(era)}
                     className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                       activeEra === era ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                     }`}
                   >
                     {era}
                   </button>
                 ))}
              </div>
           </div>

           <div className="relative group">
              <button 
                onClick={() => handleScroll('left')} 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 z-20 p-6 bg-white dark:bg-slate-800 rounded-full text-slate-500 shadow-2xl hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={36} />
              </button>
              <div 
                ref={scrollRef}
                className="flex gap-12 overflow-x-auto scrollbar-hide pb-16 snap-x no-scrollbar"
              >
                {filteredMilestones.map((item, idx) => (
                  <div 
                    key={idx}
                    className="min-w-[320px] md:min-w-[550px] snap-center cursor-pointer group/card"
                    onClick={() => setActiveMilestone(idx)}
                  >
                    <div className={`relative aspect-[16/10] rounded-[4rem] overflow-hidden mb-10 border-4 transition-all duration-1000 ${activeMilestone === idx ? 'border-orange-600 scale-100 shadow-[0_50px_100px_-20px_rgba(249,115,22,0.3)]' : 'border-transparent scale-95 opacity-40 grayscale hover:opacity-60'}`}>
                      <img src={item.image} className="w-full h-full object-cover transition-transform duration-[4s] group-hover/card:scale-110" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-10 left-12">
                        <span className="text-7xl md:text-[8rem] font-black italic tracking-tighter text-white/40 leading-none drop-shadow-2xl">{item.year}</span>
                      </div>
                    </div>
                    <div className={`transition-all duration-700 px-8 ${activeMilestone === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                      <div className="flex items-center gap-4 text-orange-500 font-black uppercase tracking-[0.4em] text-[11px] mb-4">
                        <Star size={16} /> {item.era} ARCHIVE
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter dark:text-white mb-4 leading-none">{item.title[lang]}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg">{item.desc[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleScroll('right')} 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 z-20 p-6 bg-white dark:bg-slate-800 rounded-full text-slate-500 shadow-2xl hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={36} />
              </button>
           </div>
        </div>
      </section>

      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600 rounded-full blur-[120px]" />
           <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <div>
                  <div className="flex items-center gap-4 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                     <TrendingUp size={20} /> PERFORMANCE ANALYTICS
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-8 leading-[0.8]">
                    Era Dominance
                  </h2>
                  <p className="text-2xl text-slate-400 font-medium leading-relaxed italic">
                    "Decades of technical data revealing the cyclical nature of international supremacy."
                  </p>
               </div>

               <div className="space-y-10 bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl">
                  {SUCCESSFUL_NATIONS.map((nation, idx) => (
                    <div key={nation.name} className="space-y-4 group/bar">
                       <div className="flex justify-between items-end">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover/bar:text-orange-400 transition-colors">{nation.name}</span>
                          <span className="text-xl font-black text-white italic">{nation.titles} TROPHIES</span>
                       </div>
                       <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full rounded-full transition-all duration-1500 ease-out animate-bar-rise shadow-[0_0_30px_rgba(255,75,31,0.5)]"
                            style={{ 
                              width: `${(nation.titles / maxTitles) * 100}%`,
                              backgroundColor: nation.color,
                              animationDelay: `${idx * 200}ms`
                            }}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="relative h-[700px] rounded-[5rem] overflow-hidden group shadow-[0_60px_100px_-20px_rgba(0,0,0,1)] border border-white/10">
               <img src="https://images.unsplash.com/photo-1541534741688-6078c64b5913?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-60 group-hover:opacity-80" alt="" />
               <div className="absolute inset-0 p-16 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent">
                  <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(249,115,22,0.4)]">
                    <Trophy size={48} className="text-white" />
                  </div>
                  <h3 className="text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-none">The Golden Record</h3>
                  <p className="text-slate-300 font-medium text-xl max-w-lg mb-12 leading-relaxed italic">
                    "Tracing the physical manifestation of global supremacy across a century of change."
                  </p>
                  {/* Fixed navigate error by ensuring navigate is correctly initialized within the component */}
                  <button onClick={() => navigate('/media')} className="bg-white text-slate-950 px-12 py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-orange-600 hover:text-white transition-all w-fit shadow-2xl">Access Equipment Registry</button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-image-zoom {
          animation: image-zoom 20s ease-in-out infinite alternate;
        }
        @keyframes bar-rise {
          from { width: 0; }
        }
        .animate-bar-rise {
          animation: bar-rise 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default History;
