
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Globe, Menu, X, Sun, Moon, Search } from 'lucide-react';
import Logo from './Logo';
import { LanguageContext } from '../App';
import SearchWithSuggestions from './SearchWithSuggestions';

const Navbar: React.FC<{ onAuthClick: () => void }> = ({ onAuthClick }) => {
  const { lang, setLang, t, theme, toggleTheme } = useContext(LanguageContext);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 'home', path: '/', label: t.home },
    { id: 'news', path: '/news', label: t.news },
    { id: 'matches', path: '/matches', label: t.matches },
    { id: 'tournaments', path: '/tournaments', label: t.tournaments },
    { id: 'players', path: '/players', label: t.players },
    { id: 'rankings', path: '/rankings', label: t.rankings },
    { id: 'history', path: '/history', label: t.history },
    { id: 'media', path: '/media', label: t.media },
  ];

  const handleSearchToggle = () => setIsSearchExpanded(!isSearchExpanded);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      {/* Top Strip */}
      <div className="hidden lg:flex justify-end px-12 py-1 bg-slate-900 dark:bg-black text-white text-[10px] font-semibold tracking-widest uppercase gap-6 border-b border-slate-800">
        <button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
          <Globe size={12} />
          {lang === 'en' ? t.turkish : t.english}
        </button>
        <span className="hover:text-orange-400 cursor-pointer">{t.nova_plus}</span>
        <span className="hover:text-orange-400 cursor-pointer">{t.store}</span>
        <span className="hover:text-orange-400 cursor-pointer">{t.tickets}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/">
            <Logo size={48} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 h-full">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-4 h-full flex items-center text-sm font-bold uppercase tracking-wider border-b-4 transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'border-orange-500 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-gray-200 dark:hover:border-slate-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} flex items-center justify-center`}>
                {theme === 'dark' ? <Moon size={10} className="text-orange-600" /> : <Sun size={10} className="text-orange-500" />}
              </span>
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden flex items-center ${isSearchExpanded ? 'w-48 md:w-80' : 'w-10'}`}>
              {isSearchExpanded ? (
                <SearchWithSuggestions 
                  placeholder={t.search}
                  autoFocus 
                  onClose={() => setIsSearchExpanded(false)}
                />
              ) : (
                <button 
                  onClick={handleSearchToggle}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white transition-all"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            <button onClick={onAuthClick} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <User size={24} />
            </button>

            <button className="lg:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white dark:bg-slate-900 z-40 overflow-y-auto">
          <div className="p-6 flex flex-col space-y-6">
            <div className="mb-6">
              <SearchWithSuggestions placeholder={t.search} />
            </div>
            {navItems.map((item) => (
              <Link key={item.id} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
