
import { useCallback } from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import PopularMovies from "../components/PopularMovies";
import TMDBRow from "../components/TMDBRow";
import {
  getPopularTV,
  getTrending,
  getFeaturedMovies,
  getFeaturedTV,
  getRecommendedMovies,
  getRecommendedTV,
} from "../services/tmdb";

const Home = () => {
    const trendingMovies = useCallback(
      (page) => getTrending("movie", page),
      []
    );

    const trendingTV = useCallback(
      (page) => getTrending("tv", page),
      []
    );
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-main-background text-main-text">
      <HeroSection />
      <PopularMovies />

      <TMDBRow
        id="tv-shows"
        title="Popular TV Shows"
        type="tv"
        fetcher={getPopularTV}
      />

      <TMDBRow
        id="trending-movies"
        title="Trending Movies"
        type="movie"
        fetcher={trendingMovies}
      />

      <TMDBRow
        id="trending-tv"
        title="Trending TV Shows"
        type="tv"
        fetcher={trendingTV}
      />

      <TMDBRow
        id="recommended-movies"
        title="Recommended Movies"
        type="movie"
        fetcher={getRecommendedMovies}
      />

      <TMDBRow
        id="recommended-tv"
        title="Recommended TV Shows"
        type="tv"
        fetcher={getRecommendedTV}
      />

      <TMDBRow
        id="featured-movies"
        title="Featured Movies · Top Rated"
        type="movie"
        fetcher={getFeaturedMovies}
      />

      <TMDBRow
        id="featured-tv"
        title="Featured TV Shows · Top Rated"
        type="tv"
        fetcher={getFeaturedTV}
      />
    </main>
  );
};

export default Home;
