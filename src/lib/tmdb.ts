
export interface TMDbResult {
  id: number;
  title: string;
  name: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  overview: string;
  release_date: string;
  first_air_date: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3";

export async function searchTMDb(query: string): Promise<TMDbResult[]> {
  if (!API_KEY) {
    console.warn("TMDb API key is not configured in .env.local. Please add NEXT_PUBLIC_TMDB_API_KEY.");
    // Return mock data if API key is not available
    return [
      { id: 1, title: 'Blade Runner 2049 (Add API Key to see real data)', name: '', poster_path: '/gajva2L0rPYkEWjzgFlBgrSA6E.jpg', media_type: 'movie', overview: 'A young blade runner\'s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who\'s been missing for thirty years.', release_date: '2017-10-04', first_air_date: '' },
      { id: 2, title: '', name: 'Stranger Things (Add API Key to see real data)', poster_path: '/56v2KjBlU4KZQl6seS8S8erBsBI.jpg', media_type: 'tv', overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.', release_date: '', first_air_date: '2016-07-15' }
    ];
  }

  try {
    const response = await fetch(
      `${API_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter out results that are not movies or TV shows and don't have a poster
    const filteredResults = data.results.filter(
      (result: any) => (result.media_type === 'movie' || result.media_type === 'tv') && result.poster_path
    );

    return filteredResults.slice(0, 5); // Return top 5 relevant results
  } catch (error) {
    console.error("Failed to fetch from TMDb API:", error);
    return [];
  }
}
