
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  PlayCircle, 
  Zap, 
  Star, 
  Globe, 
  ArrowRight,
  Twitter,
  Instagram,
  Youtube,
  MessageSquare,
  Clock,
  Shield,
  ArrowUp
} from 'lucide-react';
import { NEWS, MATCHES, PLAYERS } from '../data/content';
import { LanguageContext } from '../App';
import { useLiveMatches } from '../hooks/useLiveMatches';
import MatchCard from '../components/MatchCard';
import VideoModal from '../components/VideoModal';

const Home: React.FC<{ onSubscribeClick?: () => void }> = ({ onSubscribeClick }) => {
  const { lang, t } = useContext(LanguageContext);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { matches, lastUpdateId } = useLiveMatches();
  const navigate = useNavigate();

  // Actual football related high-quality images
  const heroSlides = [
    {
      title: lang === 'en' ? 'The Home of Football Passion' : 'Futbol Tutkusunun Evi',
      desc: lang === 'en' ? 'Experience the beautiful game with 3D insights and global coverage.' : '3D analizler ve küresel kapsam ile güzel oyunu deneyimleyin.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000',
      cta: t.get_tickets,
      secondaryCta: t.play_now,
      path: '/tournaments',
      video: 'https://www.youtube.com/embed/P0X62XG9Mxc' // UCL Highlights
    },
    {
      title: lang === 'en' ? 'Global Icons. Absolute Dominance' : 'Küresel İkonlar. Mutlak Hakimiyet',
      desc: lang === 'en' ? 'Meet the world-class athletes redefining the limits of performance.' : 'Performansın sınırlarını yeniden tanımlayan sporcularla tanışın.',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=2000',
      cta: t.explore_players,
      secondaryCta: t.watch_now,
      path: '/players',
      video: 'https://www.youtube.com/embed/8_S9N0zO2kY' // Messi skills
    },
    {
      title: lang === 'en' ? 'Precision in Every Kick' : 'Her Vuruşta Hassasiyet',
      desc: lang === 'en' ? 'Explore the science behind the official match dynamics.' : 'Resmi maç dinamiklerinin arkasındaki bilimi keşfedin.',
      image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=2000',
      cta: t.view_all_stories,
      secondaryCta: t.watch_now,
      path: '/news',
      video: 'https://www.youtube.com/embed/L_XJ_s5IsQc' // Best goals
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroSlides.length]);

  const handleNext = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  const handlePrev = () => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const openVideo = (url: string) => {
    setActiveVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden bg-slate-900 group">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10" />
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full flex flex-col justify-center">
                <div className="text-white space-y-6 animate-in slide-in-from-left-12 duration-1000 max-w-4xl">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-1 bg-orange-600" />
                    <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-xs">OFFICIAL FEED</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl font-medium text-slate-300 max-w-xl leading-relaxed">
                    {slide.desc}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => navigate(slide.path)}
                      className="bg-orange-600 hover:bg-white hover:text-orange-600 text-white px-10 py-4 font-black rounded-sm transition-all duration-300 uppercase tracking-widest text-[10px] shadow-2xl"
                    >
                      {slide.cta}
                    </button>
                    <button 
                      onClick={() => openVideo(slide.video)}
                      className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-slate-950 text-white px-10 py-4 font-black rounded-sm transition-all duration-300 flex items-center gap-2 uppercase tracking-widest text-[10px]"
                    >
                      <PlayCircle size={18} />
                      {slide.secondaryCta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-8 right-8 z-30 flex gap-2">
          <button onClick={handlePrev} className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-full backdrop-blur-md transition-all border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-full backdrop-blur-md transition-all border border-white/10">
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Live Match Hub - Showing flags prominent */}
      <section className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
             <div className="max-w-xl">
               <div className="flex items-center gap-3 mb-4">
                 <Zap className="text-orange-500" size={18} />
                 <h3 className="text-orange-600 font-black uppercase tracking-[0.4em] text-[10px]">LIVE MATCHES HUB</h3>
               </div>
               <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                 Real-Time Pitch Data
               </h2>
             </div>
             <button 
               onClick={() => navigate('/matches')}
               className="group flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-lg"
             >
               Explore All Matches
               <ArrowRight size={16} />
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.slice(0, 3).map((match) => (
              <div key={match.id} className="transform hover:-translate-y-2 transition-all duration-300">
                <MatchCard match={match} isUpdated={lastUpdateId === match.id} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limited News Items */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12 border-l-4 border-orange-600 pl-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">{t.news}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm italic mt-1">Official Registry Highlights</p>
          </div>
          <Link to="/news" className="text-[10px] font-black text-orange-600 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest border-b-2 border-orange-600 pb-1 transition-all">
            {t.view_all_stories}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {NEWS.slice(0, 3).map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/news/${item.id}`)} 
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative overflow-hidden aspect-video bg-gray-200 dark:bg-slate-800 mb-5 rounded-2xl shadow-md">
                <img src={item.image} alt={item.title[lang]} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                  {item.category[lang]}
                </div>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors mb-2 leading-tight">
                {item.title[lang]}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 font-medium">
                {item.summary[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Actual Football Highlights from YouTube */}
      <section className="bg-slate-950 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-orange-500 font-black uppercase tracking-[0.4em] text-[9px] mb-6">
               <PlayCircle size={14} /> BROADCAST SUITE
             </div>
             <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Video Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { title: "Classic Finals: Relive the Magic", url: "https://www.youtube.com/embed/P0X62XG9Mxc", img: "https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?auto=format&fit=crop&w=800" },
              { title: "Greatest Goals: Top 10 Registry", url: "https://www.youtube.com/embed/L_XJ_s5IsQc", img: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&w=800" }
            ].map((vid, i) => (
              <div key={i} className="group relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video bg-slate-900 border border-white/5 cursor-pointer" onClick={() => openVideo(vid.url)}>
                <img src={vid.img} className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-all duration-700" alt="" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-2xl transform group-hover:scale-110 transition-transform">
                    <PlayCircle size={32} className="text-white" />
                  </div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{vid.title}</h4>
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> GLOBAL FEED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Athletes - High Fidelity Cards like Player Page */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="flex items-center gap-6 mb-16">
              <div className="h-1 w-16 bg-orange-600" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter dark:text-white">Trending Athletes</h2>
           </div>
           
           <div className="flex gap-8 overflow-x-auto no-scrollbar pb-10 snap-x">
             {PLAYERS.map((player) => (
               <div 
                 key={player.id} 
                 onClick={() => navigate('/players')}
                 className="min-w-[280px] md:min-w-[320px] snap-center group cursor-pointer"
               >
                 <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#1a1f26] border-2 border-white/5 hover:border-orange-600/40 transition-all duration-500 shadow-xl flex flex-col justify-end p-8">
                    <img src={player.image} className="absolute inset-0 w-full h-full object-contain filter drop-shadow-2xl brightness-110 p-4 transition-transform duration-700 group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                    <div className="relative z-10">
                        <span className="text-orange-500 font-black uppercase tracking-widest text-[9px] mb-1 block">{player.team}</span>
                        <h4 className="text-2xl font-black uppercase tracking-tighter text-white">{player.name}</h4>
                        <div className="mt-2 flex items-center gap-2">
                           <img src={`https://flagcdn.com/w40/${player.nationalityCode}.png`} className="w-6 h-4 object-cover rounded-sm" alt="" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{player.nationality[lang]}</span>
                        </div>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Social Pitch Feed - Now with images and correct links */}
      <section className="bg-slate-50 dark:bg-slate-900 py-24 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Social Pitch Feed</h2>
            <div className="flex gap-3">
               <a href="https://twitter.com/FIFAcom" target="_blank" rel="noreferrer" className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:bg-orange-600 hover:text-white transition-all text-slate-500">
                 <Twitter size={20} />
               </a>
               <a href="https://instagram.com/fifaworldcup" target="_blank" rel="noreferrer" className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:bg-orange-600 hover:text-white transition-all text-slate-500">
                 <Instagram size={20} />
               </a>
               <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:bg-orange-600 hover:text-white transition-all text-slate-500">
                 <Youtube size={20} />
               </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { platform: 'Twitter', icon: Twitter, text: "A historical performance on the pitch today! Registry data shows a 92% technical score for the winning side. #FootballNova", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600", link: "https://twitter.com" },
              { platform: 'Instagram', icon: Instagram, text: "Atmosphere check at the stadium. Pure passion. Check out the full story on Nova+ app. #LiveFootball", img: "https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?auto=format&fit=crop&w=600", link: "https://instagram.com" },
              { platform: 'Registry', icon: MessageSquare, text: "Upcoming fixtures for the Global Cup Qualifiers are officially verified. Prepare your registries.", img: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&w=600", link: "/" }
            ].map((post, i) => (
              <a key={i} href={post.link} target="_blank" rel="noreferrer" className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-700 hover:scale-[1.02] transition-all flex flex-col h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white">
                    <post.icon size={18} />
                  </div>
                  <div>
                    <h5 className="font-black uppercase tracking-tighter text-slate-900 dark:text-white text-sm">@FootballNova</h5>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">2h ago</span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  {post.text}
                </p>
                <div className="mt-auto aspect-video rounded-xl overflow-hidden shadow-inner">
                   <img src={post.img} className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 right-8 z-[100] p-4 bg-orange-600 text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoUrl={activeVideoUrl} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
