import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, CalendarDays, Play, Star, Tv } from "lucide-react";
import Navbar from "./Navbar";
import { getTVDetails } from "../services/tmdb";

const IMAGE = "https://image.tmdb.org/t/p/";

const TVDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadShow() {
      setLoading(true);
      setError("");
      setShow(null);

      try {
        const data = await getTVDetails(id);
        if (!cancelled) setShow(data);
      } catch (err) {
        console.error("TV details loading failed:", err);
        if (!cancelled) {
          setError("Could not load this TV show. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadShow();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-main-background text-main-text">

      {loading && (
        <p className="px-6 py-12 text-secondary-text">
          Loading TV-show details...
        </p>
      )}

      {error && (
        <div className="px-6 py-12">
          <p className="text-red-400">{error}</p>
          <Link
            to="/tv-shows"
            className="mt-4 inline-flex items-center gap-2 text-primary-accent hover:text-hover-accent"
          >
            <ArrowLeft size={18} />
            Back to TV Shows
          </Link>
        </div>
      )}

      {show && (
        <>
          <section className="relative min-h-[65vh] overflow-hidden">
            {show.backdrop_path && (
              <img
                src={`${IMAGE}original${show.backdrop_path}`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-linear-to-r from-main-background via-main-background/80 to-main-background/20" />
            <div className="absolute inset-0 bg-linear-to-t from-main-background via-transparent to-black/20" />

            <div className="relative mx-auto flex min-h-[65vh] max-w-350 items-end gap-8 px-5 pb-12 pt-32 md:px-10">
              {show.poster_path && (
                <img
                  src={`${IMAGE}w500${show.poster_path}`}
                  alt={`${show.name} poster`}
                  className="hidden w-48 shrink-0 rounded-xl shadow-2xl sm:block md:w-60"
                />
              )}

              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-accent">
                  <Tv size={14} />
                  TV Series
                </span>

                <h1 className="mt-4 text-4xl font-black sm:text-5xl md:text-6xl">
                  {show.name}
                </h1>

                {show.tagline && (
                  <p className="mt-3 italic text-secondary-text">
                    {show.tagline}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-secondary-text">
                  {show.first_air_date && (
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {show.first_air_date.slice(0, 4)}
                    </span>
                  )}

                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    {Number(show.vote_average || 0).toFixed(1)}
                  </span>

                  <span>
                    {show.number_of_seasons ?? 0}{" "}
                    {show.number_of_seasons === 1 ? "season" : "seasons"}
                  </span>

                  <span>
                    {show.number_of_episodes ?? 0} episodes
                  </span>
                </div>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-200 sm:text-base">
                  {show.overview || "No overview is available for this show."}
                </p>

                {show.genres?.length > 0 && (
                  <div className="mt-5 mb-4 flex flex-wrap gap-2">
                    {show.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                   to={`/watch/tv/${id}/${show.seasons?.find((season) => season.season_number > 0)?.season_number ?? 1}/1`}
                   className="inline-flex items-center gap-2 rounded-lg bg-primary-accent px-6 py-3 font-semibold text-white transition hover:bg-hover-accent"
                >
                    <Play size={19} fill="currentColor" />
                    Watch Now
                </Link>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-350 px-5 py-10 md:px-10">
            {show.created_by?.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-bold">Created by</h2>
                <p className="text-secondary-text">
                  {show.created_by.map((person) => person.name).join(", ")}
                </p>
              </div>
            )}

            {show.credits?.cast?.length > 0 && (
              <div>
                <h2 className="mb-5 border-l-2 border-primary-accent pl-3 text-xl font-bold">
                  Top Cast
                </h2>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {show.credits.cast.slice(0, 12).map((person) => (
                    <article
                      key={person.id}
                      className="overflow-hidden rounded-xl border border-borders bg-secondary-background"
                    >
                      {person.profile_path ? (
                        <img
                          src={`${IMAGE}w185${person.profile_path}`}
                          alt={person.name}
                          loading="lazy"
                          className="aspect-2/3 w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-2/3 items-center justify-center bg-cards-panels text-secondary-text">
                          No photo
                        </div>
                      )}

                      <div className="p-3">
                        <h3 className="truncate text-sm font-semibold">
                          {person.name}
                        </h3>
                        <p className="mt-1 truncate text-xs text-secondary-text">
                          {person.character || "Cast member"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/tv-shows"
              className="mt-10 inline-flex items-center gap-2 text-primary-accent transition hover:text-hover-accent"
            >
              <ArrowLeft size={18} />
              Back to TV Shows
            </Link>
          </section>
        </>
      )}
    </main>
  );
};

export default TVDetails;