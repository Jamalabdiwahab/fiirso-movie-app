
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Search, X, LoaderCircle, Star, Menu } from "lucide-react";
import { searchMoviesAndTV } from "../services/tmdb";

const IMAGE = "https://image.tmdb.org/t/p/w185";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Movies", to: "/movies" },
    { label: "TV Shows", to: "/tv-shows" },
    { label: "Trending", to: "/#trending-movies" },
  ];

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

    {/* Desktop links */}
    <div className="hidden items-center gap-6 text-sm tracking-wider text-secondary-text md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          className="transition hover:text-primary-accent"
        >
          {link.label}
        </Link>
      ))}
    </div>

    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Search movies and TV shows"
        onClick={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
        className="rounded-full p-2 text-main-text transition hover:bg-white/10 hover:text-primary-accent"
      >
        <Search size={23} />
      </button>

      {/* Mobile menu button */}
      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="rounded-full p-2 text-main-text transition hover:bg-white/10 hover:text-primary-accent md:hidden"
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>
    </div>
  </nav>

{/* Mobile menu panel */}
<div
  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
    menuOpen
      ? "grid-rows-[1fr] opacity-100"
      : "pointer-events-none grid-rows-[0fr] opacity-0"
  }`}
  aria-hidden={!menuOpen}
>
  <div className="overflow-hidden">
    <div className="mx-4 mt-1 rounded-2xl border border-borders bg-main-background/90 px-5 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <div className="flex flex-col">
        {navLinks.map((link, index) => (
          <Link
            key={link.label}
            to={link.to}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            style={{ transitionDelay: menuOpen ? `${index * 50 + 100}ms` : "0ms" }}
            className={`border-b border-borders/60 py-3.5 text-base font-medium text-main-text transition-all duration-300 last:border-b-0 hover:pl-2 hover:text-primary-accent ${
              menuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
</div>
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
