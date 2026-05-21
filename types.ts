
export interface Assignment {
  id: string;
  title: string;
  discipline: string;
  description: string;
  totalPoints: number;
  format: string;
  dueDate: string;
}

export interface Student {
  id: number;
  name: string;
  attendance: { [date: string]: 'P' | 'F' | null };
}

export interface ClassData {
  id: string;
  name: string;
  grade: string; 
  school: string; // New field for school grouping
  students: Student[];
  assignments?: Assignment[];
  schedule?: string;
  days?: string[];
}

export interface ClassDataMap {
  [classId: string]: ClassData;
}

export interface ClassificationStudent {
  position: string;
  name: string;
  points: string;
  wins: number;
  losses: number;
  draws: number;
}

export interface ClassificationData {
  name: string;
  students: ClassificationStudent[];
}

export interface ClassificationDataMap {
  [classId: string]: ClassificationData;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface GameRecord {
  id: string;
  date: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  moves: number;
  accuracy?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  elo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  joinedAt: string;
  recentGames: GameRecord[];
  achievements: Achievement[];
}

export interface DashboardCardData {
  id: string;
  title: string;
  value: string | number;
  type: 'number' | 'currency' | 'text' | 'status';
  trend?: string;
  icon?: string;
  lastUpdated: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export type ViewState = 'home' | 'statistics' | 'classes' | 'tournaments' | 'play' | 'profile' | 'ementa' | 'plano' | 'lesson-content' | 'central-aulas' | 'exercises' | 'notation' | 'schedule' | 'gallery' | 'assignments' | 'biblioteca' | 'register-activities' | 'decolonial' | 'calendar';

// --- TOURNAMENT TYPES ---
export interface Player {
  id: string;
  name: string;
  class: string;
  // Stats
  points: number;
  wins: number;
  draws: number;
  losses: number;
  gamesPlayed: number;
}

export interface Match {
  id: string;
  p1Id: string;
  p2Id: string;
  result: '1-0' | '0-1' | '0.5-0.5' | null;
  groupIndex: number; // -1 for Finals
}

export interface Group {
  id: number;
  name: string;
  players: string[]; // Player IDs
}

export interface TournamentState {
  stage: 'setup' | 'groups' | 'finals' | 'finished';
  players: Player[];
  groups: Group[];
  matches: Match[];
  finalMatches: Match[];
  finalPlayers: string[];
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  description: string;
  createdAt: number;
}

export interface GalleryData {
  images: GalleryImage[];
}
