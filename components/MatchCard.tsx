
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Match } from '../types';
import { LanguageContext } from '../App';
import { Clock, Shield, Activity } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  isUpdated?: boolean;
  variant?: 'strip' | 'grid' | 'detailed';
}

const getFlagCode = (team: string) => {
  const codes: Record<string, string> = {
    'Brazil': 'br',
    'France': 'fr',
    'Argentina': 'ar',
    'Germany': 'de',
    'Spain': 'es',
    'Italy': 'it',
    'England': 'gb-eng',
    'Portugal': 'pt',
    'Netherlands': 'nl',
    'Belgium': 'be',
    'Turkey': 'tr',
    'Croatia': 'hr',
    'Japan': 'jp',
    'South Korea': 'kr',
    'USA': 'us',
    'Mexico': 'mx'
  };
  return codes[team] || null;
};

const TeamBadge: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, size = 'sm' }) => {
  const flagCode = getFlagCode(name);
  const sizeClasses = {
    sm: 'w-6 h-4',
    md: 'w-10 h-6',
    lg: 'w-16 h-10'
  };

  return (
    <Link 
      to={`/team/${encodeURIComponent(name)}`} 
      className="flex items-center gap-2 group/team shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      {flagCode ? (
        <img 
          src={`https://flagcdn.com/w160/${flagCode}.png`} 
          alt={name} 
          className={`${sizeClasses[size]} object-cover shadow-sm rounded-sm border border-gray-200 dark:border-slate-700 transition-transform group-hover/team:scale-110`} 
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-gray-200 dark:bg-slate-800 flex items-center justify-center rounded-sm`}>
          <Shield size={12} className="text-slate-400" />
        </div>
      )}
    </Link>
  );
};

const MatchCard: React.FC<MatchCardProps> = ({ match, isUpdated, variant = 'grid' }) => {
  const { lang } = useContext(LanguageContext);

  if (variant === 'strip') {
    return (
      <div className={`flex items-center gap-4 min-w-[340px] bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 p-3 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-gray-200 dark:hover:border-slate-700 ${isUpdated ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : ''}`}>
        <div className="flex items-center gap-3 text-right flex-1 justify-end">
          <div className="flex flex-col">
            <Link to={`/team/${encodeURIComponent(match.homeTeam)}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-orange-600 transition-colors">{match.homeTeam}</Link>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-tighter">{match.competition}</span>
          </div>
          <TeamBadge name={match.homeTeam} />
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-700 ${match.status === 'live' ? 'bg-slate-950 text-white' : 'bg-gray-100 dark:bg-slate-800 text-slate-500'}`}>
          <span className={`text-xl font-black tracking-tighter transition-all duration-500 ${isUpdated ? 'scale-125 text-orange-400 animate-pulse' : ''}`}>
            {match.status === 'upcoming' ? '--' : match.homeScore}
          </span>
          <span className="text-slate-600 font-bold opacity-50">:</span>
          <span className={`text-xl font-black tracking-tighter transition-all duration-500 ${isUpdated ? 'scale-125 text-orange-400 animate-pulse' : ''}`}>
            {match.status === 'upcoming' ? '--' : match.awayScore}
          </span>
        </div>

        <div className="flex items-center gap-3 text-left flex-1">
          <TeamBadge name={match.awayTeam} />
          <div className="flex flex-col">
            <Link to={`/team/${encodeURIComponent(match.awayTeam)}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-orange-600 transition-colors">{match.awayTeam}</Link>
            <div className="flex items-center gap-1.5">
              {match.status === 'live' && <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />}
              <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${match.status === 'live' ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                {match.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all group cursor-pointer ${isUpdated ? 'ring-2 ring-orange-600 shadow-2xl shadow-orange-600/20' : 'shadow-sm'}`}>
      <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={12} className={match.status === 'live' ? 'text-red-600 animate-pulse' : 'text-slate-400'} />
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{match.competition}</span>
        </div>
        {match.status === 'live' ? (
          <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full shadow-lg shadow-red-900/20">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live</span>
          </div>
        ) : (
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{match.status === 'finished' ? 'Final Score' : match.date}</span>
        )}
      </div>
      
      <div className="p-8 flex flex-col items-center gap-6">
        <div className="flex justify-between items-center w-full gap-2">
          <div className="flex-1 text-center flex flex-col items-center">
            <TeamBadge name={match.homeTeam} size="md" />
            <Link to={`/team/${encodeURIComponent(match.homeTeam)}`} className="mt-4 font-black uppercase tracking-tighter text-slate-900 dark:text-white text-base hover:text-orange-600 transition-all leading-tight">
              {match.homeTeam}
            </Link>
          </div>
          
          <div className="flex flex-col items-center px-4">
             <div className={`text-4xl font-black italic tracking-tighter flex gap-4 transition-all duration-500 ${isUpdated ? 'scale-110 text-orange-600' : 'text-slate-950 dark:text-white'}`}>
                <span className={isUpdated ? 'animate-bounce' : ''}>{match.status === 'upcoming' ? '-' : match.homeScore}</span>
                <span className="text-slate-200 dark:text-slate-800 text-3xl">:</span>
                <span className={isUpdated ? 'animate-bounce' : ''}>{match.status === 'upcoming' ? '-' : match.awayScore}</span>
             </div>
             {match.status === 'upcoming' && (
               <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mt-4 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                 <Clock size={12} className="text-orange-600" /> {match.time}
               </div>
             )}
             {match.status === 'live' && (
               <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-4 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" /> MATCH UPDATING
               </div>
             )}
          </div>
          
          <div className="flex-1 text-center flex flex-col items-center">
            <TeamBadge name={match.awayTeam} size="md" />
            <Link to={`/team/${encodeURIComponent(match.awayTeam)}`} className="mt-4 font-black uppercase tracking-tighter text-slate-900 dark:text-white text-base hover:text-orange-600 transition-all leading-tight">
              {match.awayTeam}
            </Link>
          </div>
        </div>
      </div>
      
      <Link 
        to="/matches" 
        className="block w-full py-4 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-inner"
      >
        View Match Centre
      </Link>
    </div>
  );
};

export default MatchCard;
