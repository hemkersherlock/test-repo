
export interface WatchingItem {
  id: number;
  title: string;
  progress: string; // e.g., "S02E05" or "Watched 50%"
  posterUrl: string;
  type: 'movie' | 'show';
}
