
export interface TMDbResult {
  id: number;
  title: string;
  name: string;
  poster_path: string;
  backdrop_path: string;
  media_type: 'movie' | 'tv';
  overview: string;
  release_date: string;
  first_air_date: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDb(endpoint: string): Promise<any> {
  if (!API_KEY) {
    console.warn("TMDb API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables.");
    return { results: [] };
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch from TMDb API endpoint "${endpoint}":`, error);
    return { results: [] };
  }
}

export async function searchTMDb(query: string): Promise<TMDbResult[]> {
  const data = await fetchFromTMDb(`search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
  
  // Filter out results that are not movies or TV shows and don't have a poster
  const filteredResults = data.results.filter(
    (result: any) => (result.media_type === 'movie' || result.media_type === 'tv') && result.poster_path
  );

  return filteredResults.slice(0, 5); // Return top 5 relevant results
}

export async function getTrending(): Promise<TMDbResult[]> {
  const data = await fetchFromTMDb(`trending/all/week?api_key=${API_KEY}`);
  return data.results
    .filter((result: any) => (result.media_type === 'movie' || result.media_type === 'tv') && result.poster_path)
    .slice(0, 10); // Return top 10 trending items
}
