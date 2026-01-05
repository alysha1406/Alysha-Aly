
export type Language = 'en' | 'tr';

export interface NavItem {
  id: string;
  label: Record<Language, string>;
  path: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'live' | 'upcoming' | 'finished';
  competition: string;
  date: string;
  time: string;
  venue?: string;
  location?: string;
  referee?: string;
  attendance?: string;
}

export interface NewsItem {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  content: Record<Language, string>;
  category: Record<Language, string>;
  image: string;
  date: string;
}

export interface Honour {
  id: string;
  idPlayer: string;
  strHonour: string;
  strSeason: string;
  strTeam: string;
}

export interface Player {
  id: string;
  name: string;
  gender: 'men' | 'women' | string;
  dob: string;
  squadNumber: string;
  position: Record<Language, string>;
  nationality: Record<Language, string>;
  nationalityCode: string;
  team: string;
  teamLogo?: string;
  image: string;
  banner?: string;
  awards?: Record<Language, string>[];
  honours?: Honour[];
  clubHistory?: {
    club: string;
    years: string;
    logo: string;
  }[];
  stats?: {
    matches: number;
    goals: number;
    assists: number;
  };
  seasonStats?: {
    season: string;
    apps: number;
    goals: number;
    assists: number;
  }[];
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  bio: Record<Language, string>;
  height?: string;
  weight?: string;
  goalsVsYears?: { year: string; val: number }[];
  perfVsYears?: { year: string; val: number }[];
}

export interface TournamentMedia {
  images: { url: string; caption: Record<Language, string> }[];
  videos: { url: string; title: Record<Language, string>; thumbnail: string }[];
}

export interface Tournament {
  id: string;
  name: Record<Language, string>;
  year: string;
  category: 'men' | 'women' | 'youth' | 'club';
  status: 'upcoming' | 'past' | 'ongoing';
  host: Record<Language, string>;
  hostFlag: string; // ISO code
  image: string;
  logo: string;
  description: Record<Language, string>;
  groups?: {
    name: string;
    teams: { name: string; played: number; points: number; flag: string }[];
  }[];
  awards?: {
    title: Record<Language, string>;
    winner: string;
  }[];
  media?: TournamentMedia;
}

export interface RankingItem {
  rank: number;
  prevRank: number;
  team: string;
  points: number;
  prevPoints: number;
  change: number;
  confederation: 'UEFA' | 'CONMEBOL' | 'AFC' | 'CAF' | 'CONCACAF' | 'OFC';
  history: number[]; // Last 6 months points
}
