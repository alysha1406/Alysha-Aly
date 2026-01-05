
import { useState, useEffect, useRef } from 'react';
import { Match } from '../types';
import { MATCHES as initialMatches } from '../data/content';

export const useLiveMatches = () => {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [lastUpdateId, setLastUpdateId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Cache to track score changes across polls
  const prevScores = useRef<Record<string, { home: number; away: number }>>({});

  useEffect(() => {
    // Initial cache population
    initialMatches.forEach(m => {
      prevScores.current[m.id] = { home: m.homeScore || 0, away: m.awayScore || 0 };
    });

    const simulateUpdate = () => {
      setIsSyncing(true);
      
      // Simulate network latency
      setTimeout(() => {
        setMatches(currentMatches => {
          return currentMatches.map(match => {
            let updatedMatch = { ...match };
            
            // 1. Randomly transition 'upcoming' to 'live' if the simulation has run long enough
            if (match.status === 'upcoming' && Math.random() > 0.95) {
              updatedMatch.status = 'live';
              updatedMatch.homeScore = 0;
              updatedMatch.awayScore = 0;
            }
            
            // 2. Randomly transition 'live' to 'finished'
            else if (match.status === 'live' && Math.random() > 0.98) {
              updatedMatch.status = 'finished';
            }
            
            // 3. Update scores for live matches
            else if (match.status === 'live' && Math.random() > 0.7) {
              const scoreHome = Math.random() > 0.5;
              updatedMatch.homeScore = (match.homeScore || 0) + (scoreHome ? 1 : 0);
              updatedMatch.awayScore = (match.awayScore || 0) + (!scoreHome ? 1 : 0);
            }

            // Check if score changed to trigger visual feedback
            const prev = prevScores.current[match.id];
            if (prev && (updatedMatch.homeScore !== prev.home || updatedMatch.awayScore !== prev.away)) {
              setLastUpdateId(match.id);
              prevScores.current[match.id] = { 
                home: updatedMatch.homeScore || 0, 
                away: updatedMatch.awayScore || 0 
              };
              
              // Clear highlight after 5 seconds
              setTimeout(() => setLastUpdateId(null), 5000);
            }

            return updatedMatch;
          });
        });
        setIsSyncing(false);
      }, 800);
    };

    // Poll every 8 seconds for a lively feel
    const interval = setInterval(simulateUpdate, 8000);

    return () => clearInterval(interval);
  }, []);

  return { matches, lastUpdateId, isSyncing };
};
