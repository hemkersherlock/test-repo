
export type Status = 'watchlist' | 'scheduled' | 'watching' | 'completed';

export interface CineItem {
  id: string; // Using string to accommodate TMDb IDs which can be large numbers
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
