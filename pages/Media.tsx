
import React, { useState, useContext, useMemo } from 'react';
import { 
  PlayCircle, 
  Image as ImageIcon, 
  Filter, 
  ChevronRight, 
  Maximize2, 
  Download, 
  Share2, 
  Heart,
  Clock,
  Flame,
  Search,
  Trophy,
  Twitter,
  Instagram,
  X,
  MessageSquare,
  BookOpen,
  Mail,
  Zap,
  Globe,
  Music2,
  Eye,
  ExternalLink
} from 'lucide-react';
import { LanguageContext } from '../App';
import VideoModal from '../components/VideoModal';

// --- Data Definitions ---

const VIDEO_LIBRARY = [
  {
    id: 'v1',
    title: { en: 'Final Glory: The Road to 2026', tr: 'Final Gururu: 2026 Yolu' },
    desc: { en: 'A cinematic look at the preparation for the largest tournament in history.', tr: 'Tarihin en büyük turnuvası için hazırlıklara sinematik bir bakış.' },
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12:45',
    category: 'Highlights',
    date: 'May 20, 2024',
    views: '1.2M'
  },
  {
    id: 'v2',
    title: { en: 'Tactical Masterclass: The False 9', tr: 'Taktik Deha: Sahte 9' },
    desc: { en: 'Analyzing how modern managers have evolved the striker position.', tr: 'Modern menajerlerin forvet pozisyonunu nasıl geliştirdiğini analiz ediyoruz.' },
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '08:15',
    category: 'Analysis',
    date: 'May 18, 2024',
    views: '850K'
  },
  {
    id: 'v3',
    title: { en: 'Iconic Goals: The Solo Run', tr: 'İkonik Goller: Solo Koşu' },
    desc: { en: 'A breakdown of the most breathtaking individual efforts in World Cup history.', tr: 'Dünya Kupası tarihindeki en nefes kesici bireysel çabaların dökümü.' },
    thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '05:30',
    category: 'Classics',
    date: 'May 15, 2024',
    views: '2.4M'
  }
];

const PHOTO_GALLERY = [
  { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', caption: 'Atmosphere at the Arena' },
  { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800', caption: 'Trophy Celebration' },
  { url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800', caption: 'The Final Kick' },
  { url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=800', caption: 'Historic Rivalry' },
  { url: 'https://images.unsplash.com/photo-1541534741688-6078c64b5913?auto=format&fit=crop&q=80&w=800', caption: 'Fans Unified' },
  { url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800', caption: 'Young Talents' }
];

const SOCIAL_FEED = [
  {
    id: 's1',
    platform: 'X',
    handle: '@FootballNova',
    content: 'The 2026 schedule is officially out! 📅 Which stadium are you heading to first? #FootballNova #WorldCup2026',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
    link: 'https://twitter.com',
    stats: '1.2K Likes • 450 Reposts'
  },
  {
    id: 's2',
    platform: 'Instagram',
    handle: 'footballnova_official',
    content: 'Atmosphere check! 🏟️ Pure passion in the stands tonight as the local favorites take the pitch. #NovaAtmosphere',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
    link: 'https://instagram.com',
    stats: '15.4K Likes'
  },
  {
    id: 's3',
    platform: 'TikTok',
    handle: 'nova_footy',
    content: 'Insane skill move from the youth academy today! 🔥 Can you name the trick? #Skillz #FutureStars',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600',
    link: 'https://tiktok.com',
    stats: '250K Views • 45K Likes'
  }
];

const Media: React.FC = () => {
  const { lang, t } = useContext(LanguageContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const filters = ['All', 'Video', 'Highlights', 'Analysis', 'Photo', 'Social'];

  const filteredVideos = useMemo(() => {
    return VIDEO_LIBRARY.filter(v => {
      const matchSearch = v.title[lang].toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeFilter === 'All' || activeFilter === 'Video' || v.category === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [lang, searchQuery, activeFilter]);

  const filteredPhotos = useMemo(() => {
    if (activeFilter !== 'All' && activeFilter !== 'Photo') return [];
    return PHOTO_GALLERY;
  }, [activeFilter]);

  const filteredSocial = useMemo(() => {
    if (activeFilter !== 'All' && activeFilter !== 'Social') return [];
    return SOCIAL_FEED;
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-slate-950 py-32 md:py-48 text-center relative overflow-hidden border-b border-orange-600/30">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center animate-image-zoom opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] opacity-80" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-orange-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
             <PlayCircle size={16} /> NOVA BROADCAST SUITE
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-8 leading-[0.8] drop-shadow-2xl">
            {t.media}
          </h1>
          <p className="text-slate-300 text-xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300">
            "Official multimedia access to the global heartbeat of football storytelling."
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-20 relative z-30">
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] p-12 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
             <div className="flex bg-slate-50 dark:bg-slate-800 p-2 rounded-[1.5rem] w-full lg:w-auto overflow-x-auto no-scrollbar shadow-inner">
               {filters.map(f => (
                 <button
                   key={f}
                   onClick={() => setActiveFilter(f)}
                   className={`flex-1 lg:flex-none px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                     activeFilter === f ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                   }`}
                 >
                   {f}
                 </button>
               ))}
             </div>

             <div className="relative w-full lg:w-[450px] group">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search multimedia..." 
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] outline-none focus:ring-4 ring-orange-500/10 transition-all font-bold dark:text-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-32 space-y-32">
        {/* Video Highlights Section */}
        {filteredVideos.length > 0 && (
          <section>
            <div className="flex items-center gap-6 mb-16">
              <div className="h-1 w-20 bg-orange-600" />
              <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Video Library</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredVideos.map(video => (
                <div key={video.id} className="group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800 border border-transparent group-hover:border-orange-500 transition-all duration-500">
                    <img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <PlayCircle size={40} />
                      </div>
                    </div>
                    <div className="absolute bottom-6 right-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                      {video.duration}
                    </div>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500 font-black uppercase tracking-widest text-[10px]">{video.category}</span>
                      <span className="text-slate-400 font-bold text-[10px]">• {video.date}</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white group-hover:text-orange-600 transition-colors">{video.title[lang]}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">{video.desc[lang]}</p>
                    <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-widest pt-2">
                       <span className="flex items-center gap-1.5"><Eye size={14} /> {video.views}</span>
                       <span className="flex items-center gap-1.5"><Download size={14} /> SAVE</span>
                       <span className="flex items-center gap-1.5"><Share2 size={14} /> SHARE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Pitch Feed Section */}
        {filteredSocial.length > 0 && (
          <section className="bg-slate-50 dark:bg-slate-900/40 -mx-4 lg:-mx-8 px-4 lg:px-8 py-32 border-y border-gray-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
                <div className="flex items-center gap-6">
                  <div className="h-1 w-20 bg-orange-600" />
                  <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Social Pitch Feed</h2>
                </div>
                <div className="flex gap-4">
                  {[X, Instagram, MessageSquare].map((Icon, idx) => (
                    <button key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:bg-orange-600 hover:text-white transition-all text-slate-500 border border-transparent hover:border-orange-500">
                      <Icon size={24} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredSocial.map(post => (
                  <a 
                    key={post.id} 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-700 hover:-translate-y-4 transition-all duration-500 block"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                          {post.platform === 'X' ? <X size={24} /> : post.platform === 'Instagram' ? <Instagram size={24} /> : <Music2 size={24} />}
                        </div>
                        <div>
                          <h5 className="font-black uppercase tracking-tighter text-slate-900 dark:text-white text-lg">{post.handle}</h5>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.platform} • Global</span>
                        </div>
                      </div>
                      <ExternalLink size={20} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                      {post.content}
                    </p>

                    <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-8 shadow-inner bg-slate-100 dark:bg-slate-950">
                      <img src={post.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                      {post.platform === 'TikTok' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md p-5 rounded-full text-white">
                            <PlayCircle size={48} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-700">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.stats}</span>
                       <div className="flex gap-4">
                         <Heart size={18} className="text-slate-300 hover:text-red-500 transition-colors" />
                         <Share2 size={18} className="text-slate-300 hover:text-orange-500 transition-colors" />
                       </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Photo Gallery Section */}
        {filteredPhotos.length > 0 && (
          <section>
            <div className="flex items-center gap-6 mb-16">
              <div className="h-1 w-20 bg-orange-600" />
              <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Photo Gallery</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPhotos.map((photo, i) => (
                <div 
                  key={i} 
                  className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-xl cursor-pointer"
                  onClick={() => setActivePhoto(photo.url)}
                >
                  <img src={photo.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-12">
                     <span className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-2">EDITORIAL SHOT</span>
                     <p className="text-white text-xl font-black uppercase tracking-tighter leading-tight">{photo.caption}</p>
                     <div className="mt-6 flex gap-4">
                       <button className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-orange-600 transition-all">
                         <Maximize2 size={18} className="text-white" />
                       </button>
                       <button className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-orange-600 transition-all">
                         <Download size={18} className="text-white" />
                       </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[5rem] shadow-inner border border-slate-100 dark:border-slate-800">
           <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-2 rounded-full text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8 shadow-sm">
             <Globe size={16} /> BROADCASTER HUB
           </div>
           <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter dark:text-white mb-6 leading-none">Verified Production Partner</h2>
           <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed italic">
             "Providing high-bandwidth access to the world's most extensive digital sports library. Football Nova Editorial governs all verified content."
           </p>
           <div className="mt-12 flex flex-wrap justify-center gap-8">
             <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl">
               Apply for Media Rights
             </button>
             <button className="bg-transparent border-2 border-slate-200 dark:border-slate-700 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-orange-500 dark:text-white transition-all">
               Browse Archive
             </button>
           </div>
        </section>
      </div>

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />

      {activePhoto && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setActivePhoto(null)} />
           <div className="relative max-w-6xl w-full aspect-square md:aspect-auto md:max-h-[85vh] rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10">
              <button onClick={() => setActivePhoto(null)} className="absolute top-10 right-10 p-5 bg-white/10 hover:bg-orange-600 text-white rounded-full transition-all z-10 shadow-2xl">
                 <X size={28} />
              </button>
              <img src={activePhoto} className="w-full h-full object-contain bg-black" alt="" />
           </div>
        </div>
      )}

      <style>{`
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-image-zoom {
          animation: image-zoom 20s ease-in-out infinite alternate;
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

export default Media;
