
import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  ChevronRight, 
  Newspaper, 
  Clock, 
  ArrowRight, 
  Trophy,
  Zap,
  Globe
} from 'lucide-react';
import { NEWS } from '../data/content';
import { LanguageContext } from '../App';

const News: React.FC = () => {
  const { lang, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleItems, setVisibleItems] = useState(9);

  const categories = ['All', 'FIFA', 'Clubs', 'Awards', 'Leagues', 'Tournaments', 'Governance', 'Analysis', "Women's Football"];

  // Filter logic
  const filteredNews = useMemo(() => {
    return NEWS.filter(n => {
      const matchesSearch = n.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) || 
                            n.summary[lang].toLowerCase().includes(searchQuery.toLowerCase());
      
      const itemCategory = n.category[lang];
      const matchesCategory = selectedCategory === 'All' || itemCategory.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [lang, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. CINEMATIC NEWS HEADER (Football Background) */}
      <header className="bg-slate-950 py-32 md:py-48 text-center relative overflow-hidden border-b border-orange-600/30">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center animate-image-zoom opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] opacity-80" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-orange-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
             <Newspaper size={16} /> OFFICIAL NEWS REGISTRY
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-8 leading-[0.8] drop-shadow-2xl">
            {t.news}
          </h1>
          <p className="text-slate-300 text-xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300">
            "The definitive record of professional global football storytelling and technical briefs."
          </p>
        </div>
      </header>

      {/* 2. BREAKING NEWS TICKER */}
      <div className="bg-slate-900 dark:bg-black py-4 border-b border-orange-600 overflow-hidden relative z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-8">
          <div className="flex items-center gap-3 whitespace-nowrap bg-orange-600 text-white px-6 py-2 text-[11px] font-black uppercase tracking-[0.3em] rounded-sm shadow-xl z-10">
            <TrendingUp size={14} /> Breaking
          </div>
          <div className="animate-marquee whitespace-nowrap flex gap-16 text-xs font-bold uppercase tracking-widest text-slate-300">
            {NEWS.slice(0, 10).map(n => (
              <span key={`ticker-${n.id}`} className="hover:text-orange-500 cursor-pointer transition-colors flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" /> {n.title[lang]}
              </span>
            ))}
            {/* Duplicate for loop */}
            {NEWS.slice(0, 10).map(n => (
              <span key={`ticker-dup-${n.id}`} className="hover:text-orange-500 cursor-pointer transition-colors flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" /> {n.title[lang]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        
        {/* 3. SEARCH & FILTER HUB */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-10 mb-20 -mt-20 relative z-40">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
             <div className="flex items-center gap-3 px-5 py-3 bg-gray-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 text-slate-400 font-black text-[10px] uppercase tracking-widest shrink-0">
               <Filter size={16} className="text-orange-600" /> FILTERS
             </div>
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => { setSelectedCategory(cat); setVisibleItems(9); }}
                 className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                   selectedCategory === cat 
                   ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-105' 
                   : 'bg-white dark:bg-slate-950 text-slate-500 border-gray-100 dark:border-slate-800 hover:border-orange-500'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          <div className="w-full md:w-[450px] relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Search editorial registry..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleItems(9); }}
              className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-4 ring-orange-500/10 shadow-sm dark:text-white transition-all text-sm font-bold"
            />
          </div>
        </div>

        {/* 4. WORLD FOOTBALL REGISTRY GRID */}
        <div className="pb-32">
          <div className="flex items-center gap-6 mb-16">
            <div className="h-1 w-16 bg-orange-600" />
            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Latest Reports</h2>
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredNews.slice(0, visibleItems).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="group cursor-pointer flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={item.image} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt="" 
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-orange-600 text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-xl">
                        {item.category[lang]}
                      </span>
                    </div>
                  </div>
                  <div className="p-10 space-y-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <Clock size={12} className="text-orange-500" /> {item.date}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight h-14 overflow-hidden">
                      {item.title[lang]}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-medium line-clamp-2 leading-relaxed flex-grow">
                      {item.summary[lang]}
                    </p>
                    <div className="pt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 group-hover:gap-5 transition-all">
                      Open Technical Dossier <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-48 text-center bg-slate-50 dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-slate-800 shadow-inner">
               <Newspaper size={80} className="mx-auto text-slate-300 dark:text-slate-700 mb-10" />
               <h3 className="text-4xl font-black uppercase tracking-tighter dark:text-white mb-4">Registry Empty</h3>
               <p className="text-slate-500 text-xl font-medium italic">Adjust your category or search to see more stories.</p>
            </div>
          )}

          {/* 5. LOAD MORE */}
          {filteredNews.length > visibleItems && (
            <div className="mt-24 text-center">
               <button 
                 onClick={() => setVisibleItems(prev => prev + 9)}
                 className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-16 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-xl flex items-center gap-4 mx-auto"
               >
                 Synchronize Database
                 <Zap size={16} />
               </button>
            </div>
          )}
        </div>
      </main>

      {/* 6. BOTTOM CTA SECTION */}
      <section className="bg-orange-600 py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?auto=format&fit=crop&q=80&w=2000')] opacity-10 grayscale scale-110 animate-image-zoom" />
         <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8">Professional Registry</h2>
            <p className="text-orange-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12 italic">
               "Unlock official technical dossiers and exclusive longitudinal match data."
            </p>
            <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-orange-200">
               <span className="flex items-center gap-3"><Newspaper size={14} /> Official Data</span>
               <span className="flex items-center gap-3"><Globe size={14} /> Global Feed</span>
               <span className="flex items-center gap-3"><Zap size={14} /> Real-Time Updates</span>
            </div>
         </div>
      </section>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 50s linear infinite;
        }
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-image-zoom {
          animation: image-zoom 30s ease-in-out infinite alternate;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default News;
