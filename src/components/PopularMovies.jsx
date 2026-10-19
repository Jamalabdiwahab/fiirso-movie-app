import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { getPopularMovies } from "../services/tmdb";
import MovieRow from "./MovieRow";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      try {
        const data = await getPopularMovies(1);

        if (!cancelled) {
          setMovies(
            (data.results || [])
              .filter((movie) => movie.poster_path)
              .slice(0, 20)
          );
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Could not load movies. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="px-6 py-8 text-secondary-text">
        Loading popular movies...
      </p>
    );
  }

  if (error) {
    return <p className="px-6 py-8 text-red-400">{error}</p>;
  }

  return (
    <section className="min-w-0 bg-main-background py-6">
      <div className="mb-4 flex items-center justify-between px-4 sm:px-6">
        <h2 className="border-l-2 border-primary-accent pl-3 text-lg font-bold text-main-text sm:text-xl">
          Popular Movies
        </h2>

        <Link
          to="/movies"
          className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-text transition hover:text-primary-accent"
        >
          View All
          <ChevronRight size={17} />
        </Link>
      </div>

      <MovieRow movies={movies} />
    </section>
  );
};

export default PopularMovies;