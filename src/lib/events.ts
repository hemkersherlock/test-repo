
export interface Event {
  id: number;
  title: string;
  episode?: string;
  dateTime: string;
  notes?: string;
  posterUrl: string;
  aiHint: string;
  dayOffset: number; // For client-side date calculation
}

// Storing day offsets instead of full ISO strings to avoid server/client mismatch
export const mockEvents: Omit<Event, 'dateTime'>[] = [
  {
    id: 1,
    title: "Stranger Things",
    episode: "S04E01: The Hellfire Club",
    dayOffset: 1,
    notes: "Watch party with friends!",
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    aiHint: "sci-fi series"
  },
  {
    id: 2,
    title: "Dune: Part Two",
    dayOffset: 3,
    notes: "Finally watching this in IMAX.",
    posterUrl: "https://image.tmdb.org/t/p/w500/1jsA3za0pOn8sD1m8p3b3a2l0aM.jpg",
    aiHint: "desert planet"
  },
  {
    id: 3,
    title: "The Bear",
    episode: "S02E05: Pop",
    dayOffset: 4,
    posterUrl: "https://image.tmdb.org/t/p/w500/6eNqTkrSVaD63oYn4a8u_hedon.jpg",
    aiHint: "chef kitchen"
  },
  {
    id: 4,
    title: "Oppenheimer",
    dayOffset: 7,
    notes: "3-hour movie, prepare snacks.",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    aiHint: "historical drama"
  },
   {
    id: 5,
    title: "Shōgun",
    episode: "S01E09: Crimson Sky",
    dayOffset: 10,
    posterUrl: "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCS2MCRpU3d2g2CUN.jpg",
    aiHint: "samurai epic"
  },
  {
    id: 6,
    title: "Blade Runner 2049",
    dayOffset: 12,
    notes: "A modern sci-fi masterpiece.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBgrSA6E.jpg",
    aiHint: "futuristic cityscape"
  },
  {
    id: 7,
    title: "Severance",
    episode: "S01E01: Good News About Hell",
    dayOffset: 14,
    posterUrl: "https://image.tmdb.org/t/p/w500/lFf6LLr96dH09RHeBvo9sYx23s.jpg",
    aiHint: "corporate thriller"
  },
  {
    id: 8,
    title: "Parasite",
    dayOffset: 15,
    notes: "Movie night with family.",
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    aiHint: "modern architecture"
  },
  {
    id: 9,
    title: "Breaking Bad",
    episode: "S05E14: Ozymandias",
    dayOffset: -2,
    notes: "Rewatching the greatest TV episode ever.",
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    aiHint: "desert landscape"
  },
  {
    id: 10,
    title: "The Godfather",
    dayOffset: -1,
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    aiHint: "classic gangster"
  },
  {
    id: 11,
    title: "Attack on Titan",
    episode: "S04P02E05: From You, 2000 Years Ago",
    dayOffset: 6,
    posterUrl: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQ511jc4.jpg",
    aiHint: "anime battle"
  },
  {
    id: 12,
    title: "Interstellar",
    dayOffset: 20,
    notes: "Prepare for mind-bending space travel.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    aiHint: "space galaxy"
  }
];
