
import React, { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Info, 
  Shield, 
  Search, 
  Filter, 
  ChevronRight, 
  TrendingUp, 
  ArrowUpDown,
  BarChart3,
  Calendar,
  ChevronLeft,
  X,
  History
} from 'lucide-react';
import { RANKINGS, RANKINGS_2023, RANKINGS_2022 } from '../data/content';
import { LanguageContext } from '../App';
import { RankingItem } from '../types';

const getFlagCode = (team: string) => {
  const codes: Record<string, string> = {
    'Argentina': 'ar', 'France': 'fr', 'Belgium': 'be', 'Brazil': 'br', 'England': 'gb-eng',
    'Portugal': 'pt', 'Netherlands': 'nl', 'Spain': 'es', 'Italy': 'it', 'Croatia': 'hr',
    'USA': 'us', 'Morocco': 'ma', 'Colombia': 'co', 'Mexico': 'mx', 'Uruguay': 'uy',
    'Japan': 'jp', 'Germany': 'de', 'Senegal': 'sn', 'Switzerland': 'ch', 'Iran': 'ir',
    'Denmark': 'dk'
  };
  return codes[team] || null;
};

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="#FF4B1F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const HistoricalRankingsModal: React.FC<{ year: number; data: RankingItem[]; onClose: () => void }> = ({ year, data, onClose }) => {
  const { lang } = useContext(LanguageContext);
  
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-orange-600/20">
        <button onClick={onClose} className="absolute top-8 right-8 z-50 p-4 bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white rounded-full transition-all text-slate-500 shadow-xl">
          <X size={24} />
        </button>

        <div className="p-12 md:p-16 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-black/20">
           <div className="flex items-center gap-4 text-orange-600 font-black uppercase tracking-[0.4em] text-xs mb-4">
              <History size={16} /> Historical Records
           </div>
           <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter dark:text-white">
              World Rankings {year}
           </h2>
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
              Retrospective performance analysis and official standings from the {year} season. 
              Data verified by Nova Historical Committee.
           </p>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-12">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-4">Rank</th>
                <th className="px-8 py-4">Team</th>
                <th className="px-8 py-4 text-center">Change</th>
                <th className="px-8 py-4 text-center">Confed</th>
                <th className="px-8 py-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.team} className="border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-3xl font-black italic tracking-tighter dark:text-white">{item.rank}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-6 overflow-hidden flex items-center justify-center shadow border border-gray-200 dark:border-slate-700 rounded-sm">
                        {getFlagCode(item.team) ? (
                          <img src={`https://flagcdn.com/w160/${getFlagCode(item.team)}.png`} alt={item.team} className="w-full h-full object-cover" />
                        ) : (
                          <Shield size={12} className="text-slate-400" />
                        )}
                      </div>
                      <span className="font-black uppercase tracking-tight text-slate-900 dark:text-white text-lg">{item.team}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {item.change > 0 ? (
                        <div className="text-green-500 flex items-center gap-1 font-bold">
                          <ArrowUp size={14} /> {item.change}
                        </div>
                      ) : item.change < 0 ? (
                        <div className="text-red-500 flex items-center gap-1 font-bold">
                          <ArrowDown size={14} /> {Math.abs(item.change)}
                        </div>
                      ) : (
                        <Minus size={14} className="text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">{item.confederation}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <span className="text-xl font-black tracking-tighter dark:text-white italic">{item.points.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Rankings: React.FC = () => {
  const { lang, t } = useContext(LanguageContext);
  const [search, setSearch] = useState('');
  const [activeConfed, setActiveConfed] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof RankingItem; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });
  const [selectedHistoricalYear, setSelectedHistoricalYear] = useState<number | null>(null);

  const confederations = ['All', 'UEFA', 'CONMEBOL', 'AFC', 'CAF', 'CONCACAF', 'OFC'];

  const handleSort = (key: keyof RankingItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedRankings = useMemo(() => {
    let result = RANKINGS.filter(item => {
      const matchSearch = item.team.toLowerCase().includes(search.toLowerCase());
      const matchConfed = activeConfed === 'All' || item.confederation === activeConfed;
      return matchSearch && matchConfed;
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [search, activeConfed, sortConfig]);

  const topTeam = RANKINGS[0];

  const historicalData = {
    2023: RANKINGS_2023,
    2022: RANKINGS_2022,
  };

  const handleHistoryClick = (year: number) => {
    if (year === 2023 || year === 2022) {
      setSelectedHistoricalYear(year);
    } else {
      alert(`The rankings archive for ${year} is currently being digitized. Please check back soon.`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-slate-950 py-32 md:py-48 text-center relative overflow-hidden border-b border-orange-600/30">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center animate-image-zoom opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] opacity-80" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-orange-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-1000">
             <BarChart3 size={16} /> OFFICIAL PERFORMANCE INDEX
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-8 leading-[0.8] drop-shadow-2xl">
            {t.rankings}
          </h1>
          <p className="text-slate-300 text-xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300">
            "The definitive status of world football excellence measured by technical score."
          </p>
        </div>
      </header>

      {/* Analytics & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-20 relative z-30">
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] p-12 md:p-14 border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Search & Confederation Filter */}
            <div className="lg:col-span-8 space-y-10">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search for a national team..." 
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] outline-none focus:ring-4 ring-orange-500/10 transition-all font-bold dark:text-white shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-2 rounded-[1.5rem] overflow-x-auto scrollbar-hide no-scrollbar border border-gray-100 dark:border-slate-700 shadow-inner">
                {confederations.map((conf) => (
                  <button
                    key={conf}
                    onClick={() => setActiveConfed(conf)}
                    className={`flex-1 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeConfed === conf ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {conf}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Team Focus Analytics */}
            <div className="lg:col-span-4 bg-slate-950 dark:bg-black p-10 rounded-[3rem] text-white flex flex-col justify-between h-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 p-10 opacity-5 transform group-hover:scale-125 transition-transform duration-1000">
                  <TrendingUp size={150} />
               </div>
               <div className="relative z-10">
                 <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                   <span className="w-8 h-1 bg-orange-500" /> WORLD LEADERS
                 </div>
                 <div className="flex items-center gap-6 mb-8">
                    <img src={`https://flagcdn.com/w80/${getFlagCode(topTeam.team)}.png`} className="w-12 h-8 object-cover rounded shadow-2xl border border-white/10" alt="" />
                    <h4 className="text-3xl font-black uppercase tracking-tighter">{topTeam.team}</h4>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                      <div className="text-5xl font-black tracking-tighter italic text-orange-400">{topTeam.points.toFixed(2)}</div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">TECHNICAL INDEX</div>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/5 p-4 rounded-2xl shadow-inner mb-2"><Sparkline data={topTeam.history} /></div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">6-MO TREND</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-32">
        
        <div className="md:hidden flex items-center justify-between mb-8 bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl">
           <span className="text-xs font-black uppercase tracking-widest text-slate-500">Sorted by: {sortConfig.key.toUpperCase()}</span>
           <button onClick={() => handleSort(sortConfig.key === 'rank' ? 'points' : 'rank')} className="text-orange-600 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-md">
              <ArrowUpDown size={18} />
           </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden shadow-[0_60px_120px_-40px_rgba(0,0,0,0.1)] dark:shadow-[0_60px_120px_-40px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 animate-in fade-in duration-1000">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-gray-100 dark:border-slate-800">
                  <th className="px-12 py-10 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('rank')}>
                    <div className="flex items-center gap-3">
                       Rank <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-12 py-10 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => handleSort('team')}>
                    <div className="flex items-center gap-3">
                       Team <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-12 py-10 text-center">Evolution</th>
                  <th className="px-12 py-10 text-center">Association</th>
                  <th className="px-12 py-10 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-right" onClick={() => handleSort('points')}>
                    <div className="flex items-center gap-3 justify-end">
                       Technical Score <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-12 py-10 text-right">Registry</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRankings.map((item) => (
                  <tr key={item.team} className={`group hover:bg-orange-50 dark:hover:bg-slate-800/30 transition-all border-b border-gray-50 dark:border-slate-800 last:border-0 ${item.rank <= 5 ? 'bg-orange-50/10 dark:bg-orange-600/5' : ''}`}>
                    <td className="px-12 py-10">
                       <div className="flex items-center gap-6">
                          <span className={`text-5xl font-black italic tracking-tighter ${item.rank <= 3 ? 'text-orange-600' : 'text-slate-900 dark:text-white'} transition-colors`}>
                            {item.rank}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                             PV {item.prevRank}
                          </span>
                       </div>
                    </td>
                    <td className="px-12 py-10">
                      <Link to={`/team/${encodeURIComponent(item.team)}`} className="flex items-center gap-8 group/team">
                        <div className="w-16 h-10 overflow-hidden flex items-center justify-center shadow-xl border border-gray-200 dark:border-slate-700 rounded-lg transform group-hover/team:scale-110 transition-transform duration-500">
                          {getFlagCode(item.team) ? (
                            <img src={`https://flagcdn.com/w160/${getFlagCode(item.team)}.png`} alt={item.team} className="w-full h-full object-cover" />
                          ) : (
                            <Shield size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-black uppercase tracking-tight text-slate-900 dark:text-white text-2xl group-hover/team:text-orange-600 transition-colors block leading-none mb-1">
                            {item.team}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">MEMBER ASSOCIATION</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex items-center justify-center">
                        {item.change > 0 ? (
                          <div className="flex flex-col items-center gap-1 text-green-500 font-black bg-green-500/10 px-5 py-2.5 rounded-2xl border border-green-500/20 animate-in slide-in-from-bottom-2">
                            <ArrowUp size={18} /> <span className="text-[10px] uppercase">{Math.abs(item.change)} UP</span>
                          </div>
                        ) : item.change < 0 ? (
                          <div className="flex flex-col items-center gap-1 text-red-500 font-black bg-red-500/10 px-5 py-2.5 rounded-2xl border border-red-500/20 animate-in slide-in-from-top-2">
                            <ArrowDown size={18} /> <span className="text-[10px] uppercase">{Math.abs(item.change)} DWN</span>
                          </div>
                        ) : (
                          <div className="bg-slate-100 dark:bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <Minus size={18} className="text-slate-300 dark:text-slate-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-12 py-10 text-center">
                       <span className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                          {item.confederation}
                       </span>
                    </td>
                    <td className="px-12 py-10 text-right">
                       <div className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none">{item.points.toFixed(2)}</div>
                       <div className={`text-[10px] font-black ${item.points >= item.prevPoints ? 'text-green-500' : 'text-red-500'} uppercase tracking-[0.2em] mt-2`}>
                          {(item.points - item.prevPoints).toFixed(2)} PTS VAR
                       </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                       <div className="inline-block p-5 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] shadow-inner border border-slate-100 dark:border-slate-800 transition-all group-hover:border-orange-500/30">
                          <Sparkline data={item.history} />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAndSortedRankings.length === 0 && (
            <div className="py-48 text-center bg-slate-50/50 dark:bg-slate-950 shadow-inner">
               <Shield size={100} className="mx-auto text-slate-200 mb-10" />
               <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6">No matching records.</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium text-xl max-w-lg mx-auto leading-relaxed">Adjust your confederation filter or searching for a different national association.</p>
               <button 
                 onClick={() => { setSearch(''); setActiveConfed('All'); }}
                 className="mt-12 bg-orange-600 text-white px-16 py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-950 transition-all shadow-2xl"
               >
                 Reset Index
               </button>
            </div>
          )}

          <div className="p-16 bg-slate-50 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-start gap-8 max-w-2xl">
              <div className="bg-orange-600 p-4 rounded-2xl shrink-0 shadow-2xl shadow-orange-900/40">
                <Info size={28} className="text-white" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest leading-loose">
                Points are calculated based on all full international matches played over the previous four-year cycle.
                The official ranking is governed by the Football Nova Technical Committee and verified weekly.
              </p>
            </div>
            <div className="flex items-center gap-12 shrink-0">
               <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">LAST VERIFICATION</div>
                  <div className="text-lg font-black dark:text-white uppercase tracking-tighter">20 MAY 2024</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">NEXT CALCULATION</div>
                  <div className="text-lg font-black dark:text-white uppercase tracking-tighter">27 MAY 2024</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes image-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-image-zoom {
          animation: image-zoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Rankings;
