import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  results: Movie[];
  total_results: number;
  page: number;
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>(BASE_URL, {
    params: {
      query,
      include_adult: false,
      page,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}
