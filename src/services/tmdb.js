
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

async function tmdbRequest(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", "en-US");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

export const getPopularMovies = (page = 1) =>
  tmdbRequest("/movie/popular", { page });

export const getPopularTV = (page = 1) =>
  tmdbRequest("/tv/popular", { page });

export const getTrending = (type = "all", page = 1) =>
  tmdbRequest(`/trending/${type}/week`, { page });

export const getFeaturedMovies = (page = 1) =>
  tmdbRequest("/movie/top_rated", { page });

export const getFeaturedTV = (page = 1) =>
  tmdbRequest("/tv/top_rated", { page });

export const getRecommendedMovies = (page = 1) =>
  tmdbRequest("/movie/popular", { page });

export const getRecommendedTV = (page = 1) =>
  tmdbRequest("/tv/popular", { page });

export const getMovieDetails = (id) =>
  tmdbRequest(`/movie/${id}`, { append_to_response: "credits" });

export const getTVDetails = (id) =>
  tmdbRequest(`/tv/${id}`, { append_to_response: "credits" });

export const getTVSeasonDetails = (id, seasonNumber) =>
  tmdbRequest(`/tv/${id}/season/${seasonNumber}`);
export const getMovieVideos = (id) =>
  tmdbRequest(`/movie/${id}/videos`);

export const getTVVideos = (id) =>
  tmdbRequest(`/tv/${id}/videos`);

export const getTVEpisodeVideos = (id, season, episode) =>
  tmdbRequest(`/tv/${id}/season/${season}/episode/${episode}/videos`);

export const searchMoviesAndTV = (query, page = 1) =>
  tmdbRequest("/search/multi", {
    query,
    page,
    include_adult: false,
  });