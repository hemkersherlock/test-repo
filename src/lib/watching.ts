
export interface WatchingItem {
  id: number;
  title: string;
  progress: number; // 0-100 for progress bar
  progressText?: string; // e.g., "S02E05" or "Watched"
  posterUrl: string;
  type: 'movie' | 'show';
  status: 'watching' | 'seen' | 'watchlist';
}

export const mockWatchingData: WatchingItem[] = [
  {
    id: 278,
    title: "The Shawshank Redemption",
    progress: 100,
    posterUrl: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    type: "movie",
    status: "seen",
  },
  {
    id: 1396,
    title: "Breaking Bad",
    progress: 100,
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    type: "show",
    progressText: "Finished",
    status: "seen",
  },
  {
    id: 1399,
    title: "Game of Thrones",
    progress: 80,
    posterUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    type: "show",
    progressText: "S08E01",
    status: "watching",
  },
  {
    id: 46648,
    title: "The Bear",
    progress: 50,
    posterUrl: "https://image.tmdb.org/t/p/w500/6eNqTkrSVaD63oYn4a8u_hedon.jpg",
    type: "show",
    progressText: "S02E05",
    status: "watching",
  },
  {
    id: 76479,
    title: "The Boys",
    progress: 75,
    posterUrl: "https://image.tmdb.org/t/p/w500/2zmTngn1tJycAZB2aB6bI7EBQ5J.jpg",
    type: "show",
    progressText: "S04E06",
    status: "watching",
  },
  {
    id: 82856,
    title: "The Mandalorian",
    progress: 0,
    posterUrl: "https://image.tmdb.org/t/p/w500/pB82qt6gKzAqCDiBZoE6U1gdeU.jpg",
    type: "show",
    progressText: "S01E01",
    status: "watchlist",
  },
  {
    id: 66732,
    title: "Stranger Things",
    progress: 0,
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    type: "show",
    progressText: "S01E01",
    status: "watchlist",
  },
];
