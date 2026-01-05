
import { Match, NewsItem, Player, Tournament, RankingItem } from '../types';

export interface RichNewsItem extends NewsItem {
  facts: string[];
  analyticsData: number[];
  analyticsLabel: string;
}

const generateMatches = (): Match[] => {
  const matches: Match[] = [];
  const competitions = [
    { name: 'World Cup Qualifiers', type: 'intl' },
    { name: 'UEFA Champions League', type: 'club' },
    { name: 'Premier League', type: 'club' },
    { name: 'La Liga', type: 'club' },
    { name: 'Bundesliga', type: 'club' },
    { name: 'International Friendly', type: 'intl' },
    { name: 'Copa Libertadores', type: 'club' }
  ];

  const venues = [
    { name: 'Wembley Stadium', loc: 'London, UK' },
    { name: 'Santiago Bernabéu', loc: 'Madrid, Spain' },
    { name: 'Maracanã', loc: 'Rio de Janeiro, Brazil' },
    { name: 'Allianz Arena', loc: 'Munich, Germany' },
    { name: 'Lusail Stadium', loc: 'Lusail, Qatar' },
    { name: 'Camp Nou', loc: 'Barcelona, Spain' },
    { name: 'Etihad Stadium', loc: 'Manchester, UK' }
  ];

  const referees = ['Pierluigi Collina II', 'Howard Webb', 'Cüneyt Çakır', 'Stephanie Frappart', 'Mark Clattenburg'];
  const intlTeams = ['Brazil', 'France', 'Argentina', 'Germany', 'Spain', 'Italy', 'England', 'Portugal', 'Netherlands', 'Belgium', 'Turkey', 'Croatia', 'Japan', 'USA', 'Mexico', 'Morocco'];
  const clubTeams = ['Real Madrid', 'Man City', 'Liverpool', 'Barcelona', 'Bayern Munich', 'Arsenal', 'Inter Milan', 'PSG', 'Bayer Leverkusen', 'AC Milan', 'Dortmund', 'Juventus'];

  const today = new Date();
  
  for (let i = 0; i < 210; i++) {
    const comp = competitions[i % competitions.length];
    const venue = venues[i % venues.length];
    const teams = comp.type === 'intl' ? intlTeams : clubTeams;
    let t1Idx = Math.floor(Math.random() * teams.length);
    let t2Idx = (t1Idx + 1 + Math.floor(Math.random() * (teams.length - 1))) % teams.length;
    const team1 = teams[t1Idx];
    const team2 = teams[t2Idx];
    const dateOffset = Math.floor(i / 15) - 7;
    const matchDate = new Date(today);
    matchDate.setDate(today.getDate() + dateOffset);
    const dateStr = matchDate.toISOString().split('T')[0];

    let status: 'live' | 'upcoming' | 'finished' = 'upcoming';
    let homeScore: number | undefined = undefined;
    let awayScore: number | undefined = undefined;

    if (dateOffset < 0) {
      status = 'finished';
      homeScore = Math.floor(Math.random() * 4);
      awayScore = Math.floor(Math.random() * 4);
    } else if (dateOffset === 0) {
      status = i % 3 === 0 ? 'live' : 'upcoming';
      if (status === 'live') {
        homeScore = Math.floor(Math.random() * 3);
        awayScore = Math.floor(Math.random() * 2);
      }
    }

    matches.push({
      id: `match-${i}`,
      homeTeam: team1,
      awayTeam: team2,
      homeScore,
      awayScore,
      status,
      competition: comp.name,
      date: dateStr,
      time: `${12 + (i % 10)}:${(i % 4) * 15 || '00'}`,
      venue: venue.name,
      location: venue.loc,
      referee: referees[i % referees.length],
      attendance: status === 'finished' ? (45000 + Math.floor(Math.random() * 40000)).toLocaleString() : undefined
    });
  }
  return matches;
};

export const MATCHES: Match[] = generateMatches();

const generateNews = (): RichNewsItem[] => {
  const news: RichNewsItem[] = [];
  const footballImages = [
    '1508098682722-e99c43a406b2', '1522778119026-d647f0596c20', '1431324155629-1a6eda1eed2e',
    '1574629810360-7efbbe195018', '1518091043644-c1d4457512c6', '1510566337590-2fc1f21d0faa',
    '1540747913346-19e3adbd17c3', '1551958219-acbc608c6d77', '1551244072-5d12893278ab',
    '1517466787929-bc90951d0974', '1541534741688-6078c64b5913', '1529900664467-f96306208221',
    '1524015364751-85bc977a2a0d', '1511886929837-399a18606518', '1564661720-31e620742218',
    '1518604666860-9ed391f76460', '1504450758481-7338eba7524a', '1510051675070-b53b6414f85e',
    '1556056504-517cf015aefc', '1459865264687-595d652de67e', '1519861531473-9200262188bf',
    '1521733331922-79340b03d973', '1526232359175-e3569263ee94', '1536122985607-4fe00b283652',
    '1553127744-433fbbc2b235', '1493711662062-fa541adb3fc8', '1516733725897-1aa73b87c8e8',
    '1524413840807-0c3cb6fa808d', '1525207934114-de81a282802d', '1517927033932-b3d18e61fb3a'
  ];

  const stories = [
    { title: 'The 2026 Expansion: 48 Teams', cat: 'FIFA', desc: 'Registry updates for the first 48-team global tournament cycle.', stats: [40, 55, 72, 88, 95], label: 'Participation Index' },
    { title: 'Technical Scouting: AI Analysis', cat: 'Analysis', desc: 'Elite recruiting protocols now utilize longitudinal player data.', stats: [10, 30, 65, 80, 99], label: 'Adoption Rate %' },
    { title: 'Stadium Tech: 5G Integration', cat: 'Infrastructure', desc: 'Modern venues transition to high-bandwidth matchday systems.', stats: [15, 35, 55, 75, 92], label: 'Connectivity Density' },
    { title: 'Golden Ball 2024 Candidates', cat: 'Awards', desc: 'Individual performance metrics reveal the seasons top athletes.', stats: [80, 82, 85, 90, 94], label: 'Technical Score' },
    { title: 'VAR Standards: 24/25 Update', cat: 'Governance', desc: 'New AI-assisted officiating standards confirmed for next season.', stats: [94, 95, 96, 98, 99], label: 'Decision Accuracy' },
    { title: 'Youth Excellence: The U-17 Hub', cat: 'Development', desc: 'Tracking the next generation of football icons in the registry.', stats: [20, 30, 45, 60, 85], label: 'Prospect Value' },
    { title: 'Sustainable Pitch Maintenance', cat: 'Clubs', desc: 'Eco-friendly category-4 venues setting new benchmarks.', stats: [10, 25, 50, 70, 88], label: 'Efficiency Index' },
    { title: 'Medical Registry: Load Tracking', cat: 'Medical', desc: 'Reducing matchday injuries via professional workload data.', stats: [85, 80, 75, 70, 65], label: 'Injury Rate (Inv)' },
    { title: 'Broadcasting: The Digital Shift', cat: 'Media', desc: 'Immersive streaming platforms dominate viewership numbers.', stats: [5, 20, 45, 80, 96], label: 'Digital Market Share' },
    { title: 'Women\'s Game: Record Crowds', cat: 'Growth', desc: 'Market analysis shows unprecedented engagement in global finals.', stats: [25, 40, 55, 80, 110], label: 'Global Viewership (M)' },
    { title: 'Copa Libertadores: Passion Reborn', cat: 'Tournaments', desc: 'Longitudinal study of the Southern Cone football identity.', stats: [60, 65, 70, 85, 95], label: 'Fan Engagement' },
    { title: 'Centenary Hub: 100 Years of FIFA', cat: 'Historical', desc: 'Restoring archival match footage for the digital registry.', stats: [0, 10, 30, 70, 100], label: 'Archive Health' },
    { title: 'Tactical Analysis: High-Press', cat: 'Technical', desc: 'Why the Gegenpress remains the dominant elite strategy.', stats: [40, 55, 70, 85, 90], label: 'Pressing Intensity' },
    { title: 'Financial Fair Play: New Compliance', cat: 'Governance', desc: 'Club spending reports show increased registry synchronization.', stats: [70, 75, 72, 80, 85], label: 'Fiscal Balance' },
    { title: 'Para-Football Strategy 2026', cat: 'Inclusion', desc: 'Setting global benchmarks for accessible stadium design.', stats: [20, 40, 60, 85, 98], label: 'Compliance Level' },
    { title: 'Asian Infrastructure Boom', cat: 'Tournaments', desc: 'Five new category-4 venues completed for qualifiers.', stats: [10, 20, 40, 70, 95], label: 'Capacity Growth' },
    { title: 'Referees: Technical Hub Open', cat: 'Officials', desc: 'The next generation of elite officials begins registry training.', stats: [50, 60, 75, 88, 94], label: 'Pass Accuracy %' },
    { title: 'Grassroots Funding Protocol', cat: 'Registry', desc: 'Direct subsidies for local coaching academies worldwide.', stats: [15, 25, 40, 65, 85], label: 'Fund Distribution (M$)' },
    { title: 'The Physics of the New Ball', cat: 'Analysis', desc: 'Aerodynamic package report for the official 24/25 match ball.', stats: [88, 89, 92, 94, 96], label: 'Flight Stability' },
    { title: 'Digital Fan Engagement Hub', cat: 'Clubs', desc: 'How immersive tech connects global supporter bases.', stats: [5, 15, 40, 75, 98], label: 'Interaction Volume' },
    { title: 'Video Registry: Historical Prep', cat: 'FIFA', desc: 'Protecting the film record of 1966-1974 championships.', stats: [10, 25, 50, 75, 90], label: 'Restoration Progress' },
    { title: 'African Game Investment Plan', cat: 'Clubs', desc: 'Multi-sport complexes funded across CAF member nations.', stats: [10, 15, 35, 55, 80], label: 'Stadium Build Rate' },
    { title: 'Coaching: Data Integration', cat: 'Technical', desc: 'The role of the technical analyst in the modern dugout.', stats: [0, 20, 50, 85, 99], label: 'Staff Integration' },
    { title: 'Inclusive Stadium Standards', cat: 'Governance', desc: 'Official design requirements for all international venues.', stats: [30, 50, 65, 80, 95], label: 'Accessibility Score' },
    { title: 'Transfer Market Dynamics 2024', cat: 'Leagues', desc: 'Economic analysis of the winter window technical spend.', stats: [90, 85, 80, 75, 70], label: 'Relative Market Volatility' },
    { title: 'The 10: Playmaker Rebirth', cat: 'Analysis', desc: 'How creative midfielders adapted to the high-press meta.', stats: [70, 65, 60, 75, 85], label: 'Key Pass Delta' },
    { title: 'Para-Football Para-Inclusion', cat: 'Inclusion', desc: 'Massive budget increase for inclusive sports registries.', stats: [10, 30, 50, 70, 95], label: 'Funding Index' },
    { title: 'Archive: The World Cup Logo', cat: 'Media', desc: 'Design evolution of footballs most iconic tournament brand.', stats: [10, 30, 50, 80, 100], label: 'Brand Value index' },
    { title: 'Scouting Academies: US Hub', cat: 'Development', desc: 'New high-fidelity centers open for youth talent tracking.', stats: [5, 15, 40, 65, 90], label: 'Network Node Count' },
    { title: 'Global Football Index 2024', cat: 'Registry', desc: 'Our annual report on the technical health of the game.', stats: [82, 84, 85, 88, 90], label: 'Global Health Score' }
  ];

  stories.forEach((story, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const imgId = footballImages[i % footballImages.length];
    const img = `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=1200`;

    news.push({
      id: `news-${i}`,
      title: { en: story.title, tr: story.title },
      summary: { en: story.desc, tr: story.desc },
      content: { 
        en: `In-depth technical report regarding ${story.title}. The Football Nova governing body has released comprehensive longitudinal datasets analyzing the global impact of these strategic developments. Experts from the Technical Hub confirm that the findings indicate a significant shift in performance paradigms for the 2026 cycle. This technical briefing covers architectural innovations, market adjustments, and technical efficiency benchmarks calculated across all six global confederations.`, 
        tr: `${story.title} hakkında ayrıntılı teknik kayıt dokümantasyonu.` 
      },
      category: { en: story.cat, tr: story.cat },
      image: img,
      date: dateStr,
      facts: [
        `Technical efficiency delta measured at +${(3.1 + (i/10)).toFixed(1)}%.`,
        `Direct impact verified for ${40 + i} associations.`,
        `Longitudinal data synchronized across 12 servers.`,
        `Registry entry finalized on ${dateStr}.`
      ],
      analyticsData: story.stats,
      analyticsLabel: story.label
    });
  });

  return news;
};

export const NEWS: RichNewsItem[] = generateNews();

export const PLAYERS: Player[] = [
  {
    id: 'p1', name: 'Lionel Messi', dob: '1987-06-24', squadNumber: '10', gender: 'men',
    position: { en: 'Forward', tr: 'Forvet' }, nationality: { en: 'Argentina', tr: 'Arjantin' },
    nationalityCode: 'ar', team: 'Inter Miami', image: 'https://www.thesportsdb.com/images/media/player/cutout/8z7t5w1621614742.png',
    attributes: { pace: 81, shooting: 89, passing: 90, dribbling: 94, defending: 34, physical: 64 },
    bio: { en: 'The greatest technical talent in history.', tr: 'Tarihin en büyük teknik yeteneği.' }
  } as any,
  {
    id: 'p2', name: 'Kylian Mbappé', dob: '1998-12-20', squadNumber: '9', gender: 'men',
    position: { en: 'Forward', tr: 'Forvet' }, nationality: { en: 'France', tr: 'Fransa' },
    nationalityCode: 'fr', team: 'Real Madrid', image: 'https://www.thesportsdb.com/images/media/player/cutout/v5sqf51621614392.png',
    attributes: { pace: 97, shooting: 90, passing: 80, dribbling: 92, defending: 36, physical: 78 },
    bio: { en: 'Elite professional speed and precision.', tr: 'Seçkin profesyonel hız ve hassasiyet.' }
  } as any
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: { en: 'FIFA World Cup 2026', tr: 'FIFA Dünya Kupası 2026' },
    year: '2026',
    category: 'men',
    status: 'upcoming',
    host: { en: 'USA, Canada, Mexico', tr: 'ABD, Kanada, Meksika' },
    hostFlag: 'us',
    image: 'https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?auto=format&fit=crop&q=80&w=2000',
    logo: '2026',
    description: { en: 'The largest tournament in sporting history, featuring 48 national teams across North America.', tr: 'Kuzey Amerika genelinde 48 ulusal takımın katıldığı spor tarihindeki en büyük turnuva.' }
  },
  {
    id: 't2',
    name: { en: 'UEFA Champions League', tr: 'UEFA Şampiyonlar Ligi' },
    year: '24/25',
    category: 'club',
    status: 'ongoing',
    host: { en: 'Europe', tr: 'Avrupa' },
    hostFlag: 'eu',
    image: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=2000',
    logo: 'UCL',
    description: { en: 'The pinnacle of club football. Europe\'s elite battle for the ultimate crown.', tr: 'Kulüp futbolunun zirvesi. Avrupa\'nın seçkinleri en büyük taç için savaşıyor.' },
    groups: [
      { name: 'League Stage', teams: [
        { name: 'Real Madrid', played: 4, points: 12, flag: 'es' },
        { name: 'Man City', played: 4, points: 10, flag: 'gb-eng' },
        { name: 'Liverpool', played: 4, points: 12, flag: 'gb-eng' }
      ]}
    ]
  },
  {
    id: 't3',
    name: { en: 'Premier League', tr: 'Premier Lig' },
    year: '24/25',
    category: 'club',
    status: 'ongoing',
    host: { en: 'England', tr: 'İngiltere' },
    hostFlag: 'gb-eng',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000',
    logo: 'EPL',
    description: { en: 'Widely considered the fastest and most competitive league in the world.', tr: 'Dünyanın en hızlı ve en rekabetçi ligi olarak kabul edilmektedir.' }
  },
  {
    id: 't4',
    name: { en: 'La Liga EA Sports', tr: 'La Liga' },
    year: '24/25',
    category: 'club',
    status: 'ongoing',
    host: { en: 'Spain', tr: 'İspanya' },
    hostFlag: 'es',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=2000',
    logo: 'ESP',
    description: { en: 'The home of technical mastery and global icons like Mbappe and Lamine Yamal.', tr: 'Teknik ustalık ve Mbappe ile Lamine Yamal gibi küresel ikonların evi.' }
  },
  {
    id: 't5',
    name: { en: 'FIFA Club World Cup', tr: 'FIFA Kulüpler Dünya Kupası' },
    year: '2025',
    category: 'club',
    status: 'upcoming',
    host: { en: 'United States', tr: 'Amerika Birleşik Devletleri' },
    hostFlag: 'us',
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=2000',
    logo: 'CWC',
    description: { en: 'The revamped 32-team tournament to decide the world\'s best club.', tr: 'Dünyanın en iyi kulübünü belirlemek için yenilenen 32 takımlı turnuva.' }
  },
  {
    id: 't6',
    name: { en: 'Copa América 2024', tr: 'Copa América 2024' },
    year: '2024',
    category: 'men',
    status: 'past',
    host: { en: 'United States', tr: 'Amerika Birleşik Devletleri' },
    hostFlag: 'us',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6d77?auto=format&fit=crop&q=80&w=2000',
    logo: 'USA',
    description: { en: 'The oldest continental tournament, where South American giants clash.', tr: 'Güney Amerika devlerinin çatıştığı en eski kıtasal turnuva.' },
    awards: [
      { title: { en: 'Champion', tr: 'Şampiyon' }, winner: 'Argentina' }
    ]
  }
];

export const RANKINGS: RankingItem[] = [
  { rank: 1, prevRank: 1, team: 'Argentina', points: 1858.00, prevPoints: 1861.29, change: 0, confederation: 'CONMEBOL', history: [1840, 1845, 1850, 1855, 1858, 1858] }
];

export const RANKINGS_2023: RankingItem[] = [
  { rank: 1, prevRank: 1, team: 'Argentina', points: 1855.20, prevPoints: 1840.00, change: 0, confederation: 'CONMEBOL', history: [1830, 1835, 1840, 1845, 1850, 1855] }
];

export const RANKINGS_2022: RankingItem[] = [
  { rank: 1, prevRank: 1, team: 'Brazil', points: 1840.77, prevPoints: 1826.35, change: 0, confederation: 'CONMEBOL', history: [1810, 1815, 1820, 1830, 1835, 1840] }
];
