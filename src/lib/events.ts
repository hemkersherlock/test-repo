export interface Event {
  id: number;
  title: string;
  episode?: string;
  dateTime: string;
  notes?: string;
  posterUrl: string;
  aiHint: string;
}

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};


export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Stranger Things",
    episode: "S04E01: The Hellfire Club",
    dateTime: addDays(today, 1).toISOString(),
    notes: "Watch party with friends!",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "sci-fi series"
  },
  {
    id: 2,
    title: "Dune: Part Two",
    dateTime: addDays(today, 3).toISOString(),
    notes: "Finally watching this in IMAX.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "desert planet"
  },
  {
    id: 3,
    title: "The Bear",
    episode: "S02E05: Pop",
    dateTime: addDays(today, 4).toISOString(),
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "chef kitchen"
  },
  {
    id: 4,
    title: "Oppenheimer",
    dateTime: addDays(today, 7).toISOString(),
    notes: "3-hour movie, prepare snacks.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "historical drama"
  },
   {
    id: 5,
    title: "Shōgun",
    episode: "S01E09: Crimson Sky",
    dateTime: addDays(today, 10).toISOString(),
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "samurai epic"
  },
  {
    id: 6,
    title: "Blade Runner 2049",
    dateTime: addDays(today, 12).toISOString(),
    notes: "A modern sci-fi masterpiece.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "futuristic cityscape"
  },
  {
    id: 7,
    title: "Severance",
    episode: "S01E01: Good News About Hell",
    dateTime: addDays(today, 14).toISOString(),
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "corporate thriller"
  },
  {
    id: 8,
    title: "Parasite",
    dateTime: addDays(today, 15).toISOString(),
    notes: "Movie night with family.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "modern architecture"
  },
  {
    id: 9,
    title: "Breaking Bad",
    episode: "S05E14: Ozymandias",
    dateTime: addDays(today, -2).toISOString(),
    notes: "Rewatching the greatest TV episode ever.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "desert landscape"
  },
  {
    id: 10,
    title: "The Godfather",
    dateTime: addDays(today, -1).toISOString(),
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "classic gangster"
  },
  {
    id: 11,
    title: "Attack on Titan",
    episode: "S04P02E05: From You, 2000 Years Ago",
    dateTime: addDays(today, 6).toISOString(),
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "anime battle"
  },
  {
    id: 12,
    title: "Interstellar",
    dateTime: addDays(today, 20).toISOString(),
    notes: "Prepare for mind-bending space travel.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "space galaxy"
  }
];
