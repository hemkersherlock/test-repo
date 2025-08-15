export interface Event {
  id: number;
  title: string;
  episode?: string;
  dateTime: string;
  notes?: string;
  posterUrl: string;
  aiHint: string;
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Stranger Things",
    episode: "S04E01: The Hellfire Club",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    notes: "Watch party with friends!",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "sci-fi series"
  },
  {
    id: 2,
    title: "Dune: Part Two",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    notes: "Finally watching this in IMAX.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "desert planet"
  },
  {
    id: 3,
    title: "The Bear",
    episode: "S02E05: Pop",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "chef kitchen"
  },
  {
    id: 4,
    title: "Oppenheimer",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    notes: "3-hour movie, prepare snacks.",
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "historical drama"
  },
   {
    id: 5,
    title: "Shōgun",
    episode: "S01E09: Crimson Sky",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    posterUrl: "https://placehold.co/200x300.png",
    aiHint: "samurai epic"
  }
];
