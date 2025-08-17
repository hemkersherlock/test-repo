
export type Status = 'watchlist' | 'scheduled' | 'watching' | 'completed';

export interface CineItem {
  id: string; // Firestore document ID
  tmdbId: string; // The original ID from TMDb
  title: string;
  type: 'show' | 'movie';
  status: Status;
  scheduleDate?: string; // ISO string
  createdAt: string; // ISO string from Timestamp
  posterUrl: string;
  progress?: {
    season: number;
    episode: number;
    current: number; // 0-100 for progress bar
  };
  notes?: string;
}
