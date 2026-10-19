
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Play,
  Star,
} from "lucide-react";
import { getMovieDetails } from "../services/tmdb";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError("");
      setMovie(null);

      try {
        const data = await getMovieDetails(id);

        if (!cancelled) {
          setMovie(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load this movie's details.");
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-main-background p-10 text-main-text">
        Loading movie details...
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-main-background p-10 text-main-text">
        <h1 className="text-2xl font-bold">
          {error || "Movie not found"}
        </h1>
        <Link to="/" className="mt-4 inline-block text-primary-accent">
          Return home
        </Link>
      </main>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : null;

  const director =
    movie.credits?.crew?.find((person) => person.job === "Director")?.name;

  const cast = movie.credits?.cast?.slice(0, 10) ?? [];

  return (
    <main className="min-h-screen bg-main-background text-main-text">
      <section className="relative min-h-162 overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-r from-main-background via-main-background/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-main-background via-transparent to-black/20" />

        <div className="relative z-10 p-6 md:p-12">
          <Link
            to="/"
            className="mt-20 inline-flex items-center gap-2 rounded-lg border border-borders px-5 py-2 text-sm text-secondary-text hover:text-main-text"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          <div className="mt-16 max-w-2xl">
            <h1 className="text-4xl font-extrabold md:text-6xl">
              {movie.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-secondary-text">
              <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>

              <span className="flex items-center gap-1 text-yellow-400">
                <Star size={15} fill="currentColor" />
                {movie.vote_average?.toFixed(1) ?? "N/A"}
              </span>

              {movie.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={15} />
                  {movie.runtime} min
                </span>
              )}

              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <CalendarDays size={15} />
                  {movie.release_date}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-borders px-3 py-1 text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mt-6 leading-7 text-secondary-text">
              {movie.overview || "No overview is available for this movie."}
            </p>

            <Link
              to={`/watch/movie/${id}`}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary-accent px-6 py-3 font-semibold transition hover:bg-hover-accent"
            >
              <Play size={18} fill="currentColor" />
              Watch now
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <h2 className="text-2xl font-bold">Cast and Crew</h2>

        <p className="mt-4 text-sm text-secondary-text">
          Director: {director || "Not available"}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {cast.map((actor) => (
            <span
              key={actor.cast_id ?? actor.credit_id}
              className="rounded-lg border border-borders bg-cards-panels px-4 py-3 text-sm"
            >
              {actor.name}
              {actor.character ? ` — ${actor.character}` : ""}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MovieDetails;
