
import React, { useState, createContext, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Players from './pages/Players';
import Rankings from './pages/Rankings';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import TeamDetail from './pages/TeamDetail';
import Tournaments from './pages/Tournaments';
import History from './pages/History';
import Media from './pages/Media';
import { Language } from './types';

const TRANSLATIONS = {
  en: {
    home: 'Home',
    news: 'News',
    matches: 'Matches',
    tournaments: 'Tournaments',
    players: 'Players',
    rankings: 'Rankings',
    history: 'History',
    media: 'Media',
    live_matches: 'Live Scores',
    search: 'Search players, news...',
    featured_story: 'Featured Story',
    view_all_stories: 'View All Stories',
    official_platforms: 'Official Platforms',
    vote_now: 'Vote Now',
    view_tables: 'View Tables',
    explore_history: 'Explore History',
    get_tickets: 'Get Tickets',
    watch_now: 'Watch Now',
    explore_players: 'Explore Players',
    inside_nova: 'Inside the World of Football Nova',
    nova_awards: 'Nova Awards',
    live_rankings: 'Live Rankings',
    centenary_hub: 'Centenary Hub',
    nova_plus: 'NOVA+ Shows',
    store: 'Store',
    tickets: 'Tickets',
    turkish: 'Turkish',
    english: 'English',
    play_now: 'Play Now',
    start_watching: 'Start Watching',
    subscribe_now: 'Abone Ol'
  },
  tr: {
    home: 'Anasayfa',
    news: 'Haberler',
    matches: 'Maçlar',
    tournaments: 'Turnuvalar',
    players: 'Oyuncular',
    rankings: 'Sıralamalar',
    history: 'Tarihçe',
    media: 'Medya',
    live_matches: 'Canlı Skorlar',
    search: 'Oyuncu, haber ara...',
    featured_story: 'Öne Çıkan Hikaye',
    view_all_stories: 'Tüm Haberleri Gör',
    official_platforms: 'Resmi Platformlar',
    vote_now: 'Şimdi Oyla',
    view_tables: 'Tabloları Gör',
    explore_history: 'Tarihi Keşfet',
    get_tickets: 'Bilet Al',
    watch_now: 'Şimdi İzle',
    explore_players: 'Oyuncuları Keşfet',
    inside_nova: 'Futbol Nova Dünyasından İçerikler',
    nova_awards: 'Nova Ödülleri',
    live_rankings: 'Canlı Sıralamalar',
    centenary_hub: 'Yüzyıllık Merkez',
    nova_plus: 'NOVA+ Programları',
    store: 'Mağaza',
    tickets: 'Biletler',
    turkish: 'Türkçe',
    english: 'İngilizce',
    play_now: 'Şimdi Oyna',
    start_watching: 'İzlemeye Başla',
    subscribe_now: 'Abone Ol'
  }
};

type Theme = 'dark' | 'light';

export const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof TRANSLATIONS.en;
  theme: Theme;
  toggleTheme: () => void;
}>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
  theme: 'dark',
  toggleTheme: () => {}
});

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  const contextValue = useMemo(() => ({
    lang,
    setLang,
    t,
    theme,
    toggleTheme
  }), [lang, t, theme]);

  return (
    <LanguageContext.Provider value={contextValue}>
      <Router>
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
          <Navbar onAuthClick={() => setIsAuthOpen(true)} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home onSubscribeClick={() => setIsAuthOpen(true)} />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/match/:id" element={<MatchDetail />} />
              <Route path="/team/:teamName" element={<TeamDetail />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/players" element={<Players />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/history" element={<History />} />
              <Route path="/media" element={<Media />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;
