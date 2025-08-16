
import { addDays } from "date-fns";
import type { CineItem } from "./types";

const today = new Date();

export const mockCineData: CineItem[] = [
  {
    id: "66732",
    title: "Stranger Things",
    type: "show",
    status: "scheduled",
    scheduleDate: addDays(today, 1).toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    progress: { season: 4, episode: 1, current: 75 },
    notes: "Watch party with friends!",
  },
  {
    id: "872589",
    title: "Oppenheimer",
    type: "movie",
    status: "completed",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    progress: { season: 0, episode: 0, current: 100 },
  },
  {
    id: "1399",
    title: "Game of Thrones",
    type: "show",
    status: "watching",
    posterUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    progress: { season: 8, episode: 1, current: 95 },
  },
  {
    id: "119051",
    title: "The Bear",
    type: "show",
    status: "watching",
    posterUrl: "https://image.tmdb.org/t/p/w500/6eNqTkrSVaD63oYn4a8u_hedon.jpg",
    progress: { season: 2, episode: 5, current: 50 },
  },
  {
    id: "82856",
    title: "The Mandalorian",
    type: "show",
    status: "watchlist",
    posterUrl: "https://image.tmdb.org/t/p/w500/pB82qt6gKzAqCDiBZoE6U1gdeU.jpg",
    progress: { season: 1, episode: 1, current: 0 },
  },
   {
    id: "94997",
    title: "House of the Dragon",
    type: "show",
    status: "scheduled",
    scheduleDate: addDays(today, 4).toISOString(),
    posterUrl: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    progress: { season: 2, episode: 1, current: 50 },
  },
];
