
export interface WatchingItem {
  id: number;
  title: string;
  progress: number; // 0-100 for progress bar
  progressText?: string; // e.g., "S02E05" or "Watched"
  posterUrl: string;
  type: 'movie' | 'show';
}
