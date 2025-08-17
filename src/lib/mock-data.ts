
import { addDays } from "date-fns";
import type { CineItem } from "./types";

const today = new Date();

export const mockCineData: CineItem[] = [
  {
    id: "mock-1",
    tmdbId: "66732",
    title: "Stranger Things",
    type: "show",
    status: "scheduled",
    scheduleDate: addDays(today, 1).toISOString(),
    createdAt: today.toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    progress: { season: 4, episode: 1, current: 75 },
    notes: "Watch party with friends!",
  },
  {
    id: "mock-2",
    tmdbId: "872589",
    title: "Oppenheimer",
    type: "movie",
    status: "completed",
    createdAt: today.toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    progress: { season: 0, episode: 0, current: 100 },
  },
  {
    id: "mock-3",
    tmdbId: "1399",
    title: "Game of Thrones",
    type: "show",
    status: "watching",
    createdAt: today.toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    progress: { season: 8, episode: 1, current: 95 },
  },
  {
    id: "mock-4",
    tmdbId: "119051",
    title: "The Bear",
    type: "show",
    status: "watching",
    createdAt: today.toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/6eNqTkrSVaD63oYn4a8u_hedon.jpg",
    progress: { season: 2, episode: 5, current: 50 },
  },
  {
    id: "mock-5",
    tmdbId: "82856",
    title: "The Mandalorian",
    type: "show",
    status: "watchlist",
    createdAt: today.toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/pB82qt6gKzAqCDiBZoE6U1gdeU.jpg",
    progress: { season: 1, episode: 1, current: 0 },
  },
   {
    id: "mock-6",
    tmdbId: "94997",
    title: "House of the Dragon",
    type: "show",
    status: "scheduled",
    scheduleDate: addDays(today, 4).toISOString(),
    createdAt: today.toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    progress: { season: 2, episode: 1, current: 50 },
  },
];
