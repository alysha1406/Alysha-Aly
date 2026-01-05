
import React, { useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, TrendingUp, Calendar, Shield } from 'lucide-react';
import { LanguageContext } from '../App';
import { MATCHES, PLAYERS } from '../data/content';
import MatchCard from '../components/MatchCard';

const getFlagCode = (team: string) => {
  const codes: Record<string, string> = {
    'Brazil': 'br', 'France': 'fr', 'Argentina': 'ar', 'Germany': 'de', 'Spain': 'es',
    'Italy': 'it', 'England': 'gb-eng', 'Portugal': 'pt', 'Netherlands': 'nl',
    'Belgium': 'be', 'Turkey': 'tr', 'Croatia': 'hr', 'Japan': 'jp', 'South Korea': 'kr',
    'USA': 'us', 'Mexico': 'mx'
  };
  return codes[team] || null;
};

const TeamDetail: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const { lang, t } = useContext(LanguageContext);
  
  const decodedTeamName = decodeURIComponent(teamName || '');
  const flagCode = getFlagCode(decodedTeamName);

  const teamMatches = useMemo(() => 
    MATCHES.filter(m => m.homeTeam === decodedTeamName || m.awayTeam === decodedTeamName),
    [decodedTeamName]
  );

  const teamPlayers = useMemo(() => 
    PLAYERS.filter(p => p.team === decodedTeamName || p.nationality[lang] === decodedTeamName),
    [decodedTeamName, lang]
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="relative h-[40vh] bg-slate-900 flex items-end overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full pb-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-20 md:w-48 md:h-32 bg-white rounded-lg shadow-2xl border-4 border-white overflow-hidden shrink-0">
            {flagCode ? (
              <img src={`https://flagcdn.com/w160/${flagCode}.png`} alt={decodedTeamName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <Shield size={48} className="text-slate-400" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-4">{decodedTeamName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 font-bold uppercase tracking-widest text-xs">
              <span className="flex items-center gap-2"><Trophy size={16} className="text-orange-500" /> 3x World Champions</span>
              <span className="flex items-center gap-2"><TrendingUp size={16} className="text-orange-500" /> Rank #4 Global</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <Link to="/matches" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600 hover:gap-4 transition-all mb-12">
          <ArrowLeft size={16} /> Back to Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-8">
                <Calendar className="text-orange-600" />
                <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Recent & Upcoming Fixtures</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMatches.length > 0 ? (
                  teamMatches.map(m => <MatchCard key={m.id} match={m} />)
                ) : (
                  <div className="col-span-full py-12 bg-white dark:bg-slate-900 rounded-2xl text-center border border-gray-100 dark:border-slate-800">
                    <p className="text-slate-500 uppercase font-black text-xs tracking-widest">No scheduled matches available.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <Users className="text-orange-600" />
                <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Squad & Key Figures</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {teamPlayers.length > 0 ? (
                  teamPlayers.map(p => (
                    <Link key={p.id} to="/players" className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all">
                      <div className="aspect-square rounded-lg overflow-hidden mb-3">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                      </div>
                      <h4 className="font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{p.position[lang]}</p>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 bg-white dark:bg-slate-900 rounded-2xl text-center border border-gray-100 dark:border-slate-800">
                    <p className="text-slate-500 uppercase font-black text-xs tracking-widest">Squad information is currently being updated.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 dark:text-white">Organization Hub</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Governing Body</span>
                  <span className="text-xs font-black dark:text-white">NOVA FEDERATION</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Founded</span>
                  <span className="text-xs font-black dark:text-white">1904</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Home Stadium</span>
                  <span className="text-xs font-black dark:text-white">NOVA CENTRALE</span>
                </div>
              </div>
              <button className="w-full mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-colors">Official Association Site</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
