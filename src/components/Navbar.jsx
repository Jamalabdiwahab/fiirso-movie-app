
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Search, X, LoaderCircle, Star } from "lucide-react";
import { searchMoviesAndTV } from "../services/tmdb";

const IMAGE = "https://image.tmdb.org/t/p/w185";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!searchOpen || trimmedQuery.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    const timer = setTimeout(async () => {
      try {
        const data = await searchMoviesAndTV(trimmedQuery, 1);

        if (!cancelled) {
          setResults(
            (data.results || [])
              .filter(
                (item) =>
                  (item.media_type === "movie" ||
                    item.media_type === "tv") &&
                  item.poster_path
              )
              .slice(0, 12)
          );
        }
      } catch (err) {
        console.error("Search failed:", err);
        if (!cancelled) {
          setResults([]);
          setError("Search failed. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setError("");
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex max-w-350 items-center justify-between gap-4 px-5 py-5 md:px-10">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src="/logo.svg" alt="FiirsoApp" className="h-10 w-10" />
            <h1 className="text-xl font-extrabold tracking-tight text-main-text">
              Fiirso<span className="text-primary-accent">App</span>
            </h1>
          </Link>

          <div className="hidden items-center gap-6 text-sm tracking-wider text-secondary-text md:flex">
            <Link to="/" className="transition hover:text-primary-accent">
              Home
            </Link>
            <Link to="/movies" className="transition hover:text-primary-accent">
              Movies
            </Link>
            <Link to="/tv-shows" className="transition hover:text-primary-accent">
              TV Shows
            </Link>
            <Link to="/#trending-movies" className="transition hover:text-primary-accent">
              Trending
            </Link>
          </div>

          <button
            type="button"
            aria-label="Search movies and TV shows"
            onClick={() => setSearchOpen(true)}
            className="rounded-full p-2 text-main-text transition hover:bg-white/10 hover:text-primary-accent"
          >
            <Search size={23} />
          </button>
        </nav>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 px-4 pb-10 pt-6 backdrop-blur-md sm:px-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 border-b border-borders pb-4">
              <Search className="shrink-0 text-primary-accent" size={24} />

              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch();
                }}
                placeholder="Search movies and TV shows..."
                aria-label="Search movies and TV shows"
                className="min-w-0 flex-1 bg-transparent py-3 text-lg text-main-text outline-none placeholder:text-secondary-text sm:text-2xl"
              />

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="rounded-full p-2 text-secondary-text hover:bg-white/10 hover:text-white"
              >
                <X size={23} />
              </button>
            </div>

            <p className="mt-4 text-xs text-secondary-text">
              Search movies and television series
            </p>

            {query.trim().length < 2 && (
              <p className="py-12 text-center text-secondary-text">
                Type at least 2 characters to search.
              </p>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-2 py-12 text-secondary-text">
                <LoaderCircle size={20} className="animate-spin" />
                Searching...
              </div>
            )}

            {!loading && error && (
              <p className="py-10 text-center text-red-400">{error}</p>
            )}

            {!loading &&
              !error &&
              query.trim().length >= 2 &&
              results.length === 0 && (
                <p className="py-12 text-center text-secondary-text">
                  No matching movies or shows found.
                </p>
              )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {results.map((item) => {
                const isTV = item.media_type === "tv";
                const title = item.title || item.name;
                const year = (
                  item.release_date || item.first_air_date || ""
                ).slice(0, 4);

                return (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    to={isTV ? `/tv/${item.id}` : `/movie/${item.id}`}
                    onClick={closeSearch}
                    className="group min-w-0 overflow-hidden rounded-xl border border-borders bg-secondary-background transition hover:-translate-y-1 hover:border-primary-accent"
                  >
                    <img
                      src={`${IMAGE}${item.poster_path}`}
                      alt={`${title} poster`}
                      loading="lazy"
                      className="aspect-2/3 w-full object-cover"
                    />

                    <div className="p-3">
                      <h3 className="truncate text-sm font-semibold text-main-text group-hover:text-primary-accent">
                        {title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-secondary-text">
                        <span>{year || "Year unavailable"}</span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star size={12} fill="currentColor" />
                          {Number(item.vote_average || 0).toFixed(1)}
                        </span>
                      </div>

                      <span className="mt-2 inline-block rounded bg-cards-panels px-2 py-1 text-[10px] uppercase tracking-wider text-secondary-text">
                        {isTV ? "TV Show" : "Movie"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
