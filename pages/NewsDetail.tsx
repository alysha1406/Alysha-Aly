
import React, { useContext, useMemo, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  ArrowLeft, 
  Calendar, 
  Shield, 
  Zap, 
  Globe, 
  TrendingUp, 
  Target, 
  Clock, 
  ArrowRight, 
  Info, 
  Download,
  Share2
} from 'lucide-react';
import { NEWS, RichNewsItem } from '../data/content';
import { LanguageContext } from '../App';
import NewsCard from '../components/NewsCard';

const EnhancedAnalyticalGraph: React.FC<{ data: number[]; label: string }> = ({ data, label }) => {
  const w = 500;
  const h = 250;
  const p = 50;
  const max = Math.max(...data) * 1.2;
  const points = data.map((d, i) => ({
    x: p + (i * (w - p * 2)) / (data.length - 1),
    y: h - p - (d / max) * (h - p * 2)
  }));
  const path = `M ${points.map(pt => `${pt.x} ${pt.y}`).join(' L ')}`;
  const area = `${path} L ${points[points.length-1].x} ${h-p} L ${points[0].x} ${h-p} Z`;

  return (
    <div className="bg-[#0B0E11] p-10 rounded-[3rem] border-2 border-orange-600/20 shadow-[0_0_50px_rgba(255,102,0,0.1)] w-full group/graph relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-orange-600 rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white">{label}</span>
         </div>
         <TrendingUp size={18} className="text-orange-600 animate-pulse" />
      </div>
      
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible filter drop-shadow-[0_0_15px_rgba(255,102,0,0.4)]">
        <defs>
          <linearGradient id="gradDetail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6600" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={area} fill="url(#gradDetail)" className="animate-in fade-in duration-1000" />
        <path d={path} fill="none" stroke="#FF6600" strokeWidth="5" strokeLinecap="round" filter="url(#neonGlow)" className="animate-draw-path" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="6" fill="#020617" stroke="#FF6600" strokeWidth="3" className="hover:r-8 transition-all" />
            <text x={pt.x} y={pt.y - 15} textAnchor="middle" className="text-[10px] font-black fill-white opacity-0 group-hover/graph:opacity-100 transition-opacity">{data[i]}</text>
          </g>
        ))}
      </svg>
      
      <div className="flex justify-between mt-8 text-[9px] font-black text-slate-500 uppercase tracking-widest border-t border-white/5 pt-6">
         <span>Registry Start</span>
         <span>Live Snapshot</span>
         <span>Projection</span>
      </div>

      <style>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw-path {
          animation: drawPath 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const NewsDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useContext(LanguageContext);

  const article = useMemo(() => NEWS.find(n => n.id === id) as RichNewsItem | undefined, [id]);
  const related = useMemo(() => NEWS.filter(n => n.id !== id).slice(0, 3), [id]);

  if (!article) return <Navigate to="/news" />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. CINEMATIC DETAIL HEADER */}
      <header className="bg-slate-950 py-32 md:py-48 relative overflow-hidden border-b border-orange-600/30">
        <div className="absolute inset-0 z-0">
          <img src={article.image} alt="" className="w-full h-full object-cover animate-image-zoom opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" />
        </div>
        
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <button 
            onClick={() => navigate('/news')}
            className="mb-12 inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-orange-500 transition-all bg-white/5 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-xl group shadow-2xl"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> Back to News Feed
          </button>
          
          <div className="max-w-5xl">
            <div className="mb-10 flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-[0.4em]">
              <span className="bg-orange-600 px-6 py-2 text-white shadow-[0_10px_30px_rgba(255,102,0,0.4)] rounded-sm">
                {article.category[lang]}
              </span>
              <div className="flex items-center gap-3 text-white/80">
                <Calendar size={18} className="text-orange-500" />
                {article.date}
              </div>
              <div className="flex items-center gap-3 text-green-500 animate-pulse">
                 <Zap size={18} />
                 Verified technical Dossier
              </div>
            </div>

            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85] mb-12 drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-1000">
              {article.title[lang]}
            </h1>
          </div>
        </div>
      </header>

      {/* 2. REGISTRY STATUS BAR */}
      <div className="bg-slate-900 dark:bg-black py-5 border-b border-orange-600/30 sticky top-20 z-40 backdrop-blur-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-12 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
           <div className="flex items-center gap-10">
              <span className="flex items-center gap-3 text-orange-500"><Shield size={16} /> Official Entry</span>
              <span className="flex items-center gap-3"><Globe size={16} /> Global Registry Access</span>
           </div>
           <div className="hidden md:flex items-center gap-10">
              <span className="text-slate-400 flex items-center gap-3"><Clock size={16} /> 4 Minute Read</span>
              <span className="text-green-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Synchronized
              </span>
           </div>
        </div>
      </div>

      {/* 3. TECHNICAL DOSSIER CONTENT */}
      <main className="max-w-7xl mx-auto px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
        
        {/* Narrative Left Column */}
        <div className="lg:col-span-7 space-y-16">
          <div className="border-l-8 border-orange-600 pl-12 py-4">
            <p className="text-2xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight italic">
              "{article.summary[lang]}"
            </p>
          </div>

          <div className="prose prose-2xl dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-medium leading-relaxed space-y-12">
            <p className="first-letter:text-9xl first-letter:font-black first-letter:text-orange-600 first-letter:mr-8 first-letter:float-left first-letter:leading-none">
              {article.content[lang]}
            </p>
            
            <img 
              src={`https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?auto=format&fit=crop&q=80&w=1400`} 
              className="w-full h-[600px] object-cover rounded-[4rem] shadow-4xl border border-gray-100 dark:border-white/5 grayscale-0 hover:grayscale-0 transition-all duration-700" 
              alt="Professional Stadium View"
            />

            <p>
              Strategic stakeholders have confirmed that the data synchronization protocols are now finalized across all major hubs. 
              The technical committee has reviewed the longitudinal efficiency metrics and suggests that the 2026 expansion 
              will provide an unrivaled platform for member association growth.
            </p>

            <blockquote className="bg-slate-50 dark:bg-slate-900 p-16 rounded-[4rem] border border-orange-600/20 relative overflow-hidden group shadow-inner">
              <div className="absolute -right-24 -top-24 opacity-5 group-hover:rotate-12 transition-transform duration-1000 text-orange-600">
                <Shield size={350} />
              </div>
              <p className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white relative z-10 leading-tight">
                "The evolution of the global game is measured through precise technical scorecards. This briefing represents the gold standard of that documentation."
              </p>
              <cite className="block mt-10 text-[11px] font-black text-orange-600 uppercase tracking-[0.5em] relative z-10">
                — NOVA EDITORIAL REGISTRY BUREAU
              </cite>
            </blockquote>

            <p>
              Further updates will be synchronized with the global registry as technical sessions conclude. 
              All associations are encouraged to review the performance indices provided in the analytics dashboard 
              to ensure multi-territory compliance.
            </p>
          </div>

          {/* Registry Interaction Footer */}
          <div className="pt-24 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="flex items-center gap-8">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 italic">Disseminate Report</h4>
                <div className="flex gap-4">
                  {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                    <button key={idx} className="bg-slate-100 dark:bg-white/5 p-5 rounded-full text-slate-600 dark:text-slate-400 hover:bg-orange-600 hover:text-white transition-all shadow-xl hover:-translate-y-1">
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
             </div>
             <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-orange-600 hover:gap-6 transition-all">
                <Download size={20} /> Download Registry PDF
             </button>
          </div>
        </div>

        {/* Technical Dashboard Right Column (Sticky) */}
        <aside className="lg:col-span-5 space-y-16 lg:sticky lg:top-48">
          
          {/* 1. ANIMATED ANALYTICS HUB */}
          <section className="space-y-10">
            <div className="flex items-center gap-4 text-orange-600">
               <Target size={28} className="animate-spin-slow" />
               <h3 className="text-3xl font-black uppercase tracking-tighter italic">Analytics Hub</h3>
            </div>
            <EnhancedAnalyticalGraph data={article.analyticsData} label={article.analyticsLabel} />
          </section>

          {/* 2. REGISTRY FACTS DOSSIER */}
          <section className="bg-white dark:bg-[#0B0E11] p-12 rounded-[3.5rem] border-2 border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-4 text-blue-500 mb-12 relative z-10">
                <Info size={28} />
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Registry Facts</h3>
             </div>
             <div className="space-y-10 relative z-10">
                {article.facts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-6 group/fact">
                     <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-orange-600 group-hover/fact:scale-150 transition-transform shadow-[0_0_10px_rgba(255,102,0,1)]" />
                     <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover/fact:text-slate-900 dark:group-hover/fact:text-white transition-colors leading-relaxed">
                        {fact}
                     </p>
                  </div>
                ))}
             </div>
             <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/5 relative z-10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Strategic Partner</div>
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-[#FF6600] border border-white/10 shadow-2xl">N</div>
                   <span className="font-black text-sm uppercase tracking-tighter text-slate-400">Nova technical Labs</span>
                </div>
             </div>
          </section>

          {/* 3. RELATED REPORTS Mini Grid */}
          <section className="space-y-12">
             <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                <TrendingUp size={28} className="text-orange-600" />
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Live Trending</h3>
             </div>
             <div className="space-y-10">
               {related.map(item => (
                 <Link key={item.id} to={`/news/${item.id}`} className="flex gap-8 group">
                   <div className="w-36 h-28 rounded-3xl overflow-hidden shadow-2xl shrink-0 border-2 border-transparent group-hover:border-orange-600 transition-all">
                      <img src={item.image} className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-700" alt="" />
                   </div>
                   <div className="space-y-3">
                     <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{item.category[lang]}</span>
                     <h5 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight">
                       {item.title[lang]}
                     </h5>
                   </div>
                 </Link>
               ))}
             </div>
          </section>
        </aside>
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        .animate-image-zoom {
          animation: image-zoom 40s ease-in-out infinite alternate;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF6600; border-radius: 20px; border: 3px solid #020617; }
      `}</style>
    </div>
  );
};

export default NewsDetail;
