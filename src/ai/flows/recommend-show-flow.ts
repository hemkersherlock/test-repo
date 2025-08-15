'use server';
/**
 * @fileOverview An AI flow for recommending movies or TV shows.
 *
 * - recommendShow - A function that suggests a new show or movie based on the user's existing schedule.
 * - RecommendShowInput - The input type for the recommendShow function.
 * - RecommendShowOutput - The return type for the recommendShow function.
 */

import { ai } from '@/ai/genkit';
import { searchTMDb, TMDbResult } from '@/lib/tmdb';
import { z } from 'genkit';

const RecommendShowInputSchema = z.object({
  existingTitles: z.array(z.string()).describe("A list of movie or TV show titles the user has already scheduled."),
});
export type RecommendShowInput = z.infer<typeof RecommendShowInputSchema>;

const RecommendShowOutputSchema = z.object({
  title: z.string().describe("The title of the recommended movie or TV show. It should be a real, existing title."),
  reason: z.string().describe("A short, creative, and compelling reason why the user might like this recommendation based on their existing list."),
  type: z.enum(['movie', 'show']).describe("Whether the recommendation is a 'movie' or a 'show'."),
});
export type RecommendShowOutput = z.infer<typeof RecommendShowOutputSchema>;

export interface Recommendation extends RecommendShowOutput {
  tmdbResult?: TMDbResult;
}

export async function recommendShow(input: RecommendShowInput): Promise<Recommendation> {
  const recommendation = await recommendShowFlow(input);
  
  // After getting the AI recommendation, search TMDb to get poster and other details.
  const searchResults = await searchTMDb(recommendation.title);
  
  // Find the best match from search results
  const bestMatch = searchResults.find(result => 
    (result.title?.toLowerCase() === recommendation.title.toLowerCase() || result.name?.toLowerCase() === recommendation.title.toLowerCase()) &&
    (result.media_type === (recommendation.type === 'show' ? 'tv' : 'movie'))
  );

  return {
    ...recommendation,
    tmdbResult: bestMatch,
  };
}

const prompt = ai.definePrompt({
  name: 'recommendShowPrompt',
  input: { schema: RecommendShowInputSchema },
  output: { schema: RecommendShowOutputSchema },
  prompt: `You are a movie and TV show recommendation expert.
Your goal is to suggest a new movie or TV show to a user based on their existing schedule.
Do not recommend a title that is already in their existing list.

Here are the titles they have scheduled:
{{#each existingTitles}}
- {{this}}
{{/each}}

Based on this list, recommend one new movie or TV show. Provide a short, creative reason for your recommendation.
Make sure the title you recommend is a real, well-known movie or show.
`,
});

const recommendShowFlow = ai.defineFlow(
  {
    name: 'recommendShowFlow',
    inputSchema: RecommendShowInputSchema,
    outputSchema: RecommendShowOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
