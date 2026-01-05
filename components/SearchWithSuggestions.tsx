
import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Newspaper, Trophy, Shield, ArrowRight } from 'lucide-react';
import { PLAYERS, NEWS, TOURNAMENTS, RANKINGS } from '../data/content';
import { LanguageContext } from '../App';

interface SearchWithSuggestionsProps {
  placeholder: string;
  className?: string;
  onSelect?: (value: string) => void;
  initialValue?: string;
  autoFocus?: boolean;
  onClose?: () => void;
  global?: boolean;
}

const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  placeholder,
  className = "",
  onSelect,
  initialValue = "",
  autoFocus = false,
  onClose,
  global = false
}) => {
  const { lang } = useContext(LanguageContext);
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Consolidate all searchable data
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase();
    const results: { id: string; title: string; type: 'player' | 'news' | 'tournament' | 'team'; path: string }[] = [];

    // Search Players
    PLAYERS.forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
        results.push({ id: p.id, title: p.name, type: 'player', path: '/players' });
      }
    });

    // Search News
    NEWS.forEach(n => {
      if (n.title[lang].toLowerCase().includes(q)) {
        results.push({ id: n.id, title: n.title[lang], type: 'news', path: `/news/${n.id}` });
      }
    });

    // Search Tournaments
    TOURNAMENTS.forEach(t => {
      if (t.name[lang].toLowerCase().includes(q)) {
        results.push({ id: t.id, title: t.name[lang], type: 'tournament', path: '/tournaments' });
      }
    });

    // Search Teams (from Rankings)
    RANKINGS.forEach(r => {
      if (r.team.toLowerCase().includes(q)) {
        results.push({ id: r.team, title: r.team, type: 'team', path: `/team/${encodeURIComponent(r.team)}` });
      }
    });

    return results.slice(0, 8); // Limit results for UI clarity
  }, [query, lang]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        handleItemClick(suggestions[activeIndex]);
      } else {
        onSelect?.(query);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleItemClick = (item: typeof suggestions[0]) => {
    setQuery(item.title);
    setIsOpen(false);
    onSelect?.(item.title);
    navigate(item.path);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'player': return <User size={14} />;
      case 'news': return <Newspaper size={14} />;
      case 'tournament': return <Trophy size={14} />;
      case 'team': return <Shield size={14} />;
      default: return <Search size={14} />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative group">
        <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? 'text-orange-500' : 'text-slate-400 group-focus-within:text-orange-500'}`} size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
            onSelect?.(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full pl-14 pr-12 py-4.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-orange-500 transition-all dark:text-white font-medium shadow-sm"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); onSelect?.(''); inputRef.current?.focus(); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-black/50 border border-gray-100 dark:border-slate-800 overflow-hidden z-[200] animate-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="px-4 py-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Suggestions</span>
            </div>
            {suggestions.map((item, index) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all text-left ${
                  activeIndex === index ? 'bg-orange-500 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${activeIndex === index ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700 text-orange-600'}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight leading-none mb-1">{item.title}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${activeIndex === index ? 'text-white/70' : 'text-slate-400'}`}>
                      {item.type}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} className={`transition-transform ${activeIndex === index ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>
          <div className="bg-slate-50 dark:bg-black/20 p-4 border-t border-gray-100 dark:border-slate-800 text-center">
            <button className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:underline">
              View All Results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
