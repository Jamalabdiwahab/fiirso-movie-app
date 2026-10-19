
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Info, Play, Star, ChevronRight } from "lucide-react";
import { getTrending } from "../services/tmdb";

const IMAGE = "https://image.tmdb.org/t/p/";
const FALLBACK = "https://placehold.co/600x900/141419/FFFFFF?text=No+Poster";

export default function HeroSection() {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getTrending("all", 1)
      .then((data) => {
        const results = data.results
          .filter((item) => item.backdrop_path && item.poster_path)
          .filter((item) => item.media_type === "movie" || item.media_type === "tv")
          .slice(0, 10);

        if (!cancelled) setItems(results);
      })
      .catch((error) => console.error("Hero loading failed:", error));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [items]);

  if (!items.length) {
    return (
      <section className="flex min-h-[65vh] items-end bg-main-background px-6 pb-16 text-main-text">
        Loading featured titles...
      </section>
    );
  }

  const current = items[activeIndex];
  const next = items[(activeIndex + 1) % items.length];
  const currentTitle = current.title || current.name;
  const currentYear = (current.release_date || current.first_air_date || "").slice(0, 4);
  const currentPath = current.media_type === "tv" ? `/tv/${current.id}` : `/movie/${current.id}`;
  const nextPath = next.media_type === "tv" ? `/tv/${next.id}` : `/movie/${next.id}`;

  return (
    <section className="relative flex min-h-[75vh] items-end overflow-hidden bg-main-background text-main-text md:min-h-[85vh]">
      <img
        key={current.id}
        src={`${IMAGE}original${current.backdrop_path}`}
        alt=""
        className="animate-hero-image absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-linear-to-r from-main-background via-main-background/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-main-background via-main-background/20 to-black/10" />

      <div className="relative z-10 mx-auto w-full max-w-350 px-5 pb-24 pt-36 md:px-10 md:pb-28">
        <div
           key={`${current.media_type}-${current.id}`} 
           className="animate-hero-content max-w-2xl">
          <span className="inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-accent">
            Trending {current.media_type === "tv" ? "TV Show" : "Movie"}
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl md:text-7xl">
            {currentTitle}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-secondary-text">
            {currentYear && <span>{currentYear}</span>}
            <span className="flex items-center gap-1 text-yellow-400">
              <Star size={15} fill="currentColor" />
              {Number(current.vote_average || 0).toFixed(1)}
            </span>
            <span>{current.media_type === "tv" ? "TV Series" : "Movie"}</span>
          </div>

          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-gray-200 sm:text-base">
            {current.overview || "Discover more about this title."}
          </p>

            <Link
              to={currentPath}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary-accent px-6 py-3 font-semibold text-white hover:bg-hover-accent"
            >
              <Play size={18} fill="currentColor" />
              Explore title
            </Link>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-20 flex items-end gap-3 md:bottom-8 md:right-10">
        <div className="hidden text-right sm:block">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/70">
            Up next
          </p>
          <p className="max-w-32 truncate text-sm font-semibold">
            {next.title || next.name}
          </p>
        </div>

        <Link
          key={`${next.media_type}-${next.id}`}
          to={nextPath}
          aria-label={`View ${next.title || next.name} next`}
          className="group relative block w-20 overflow-hidden rounded-lg border-2 border-white/70 shadow-xl transition hover:scale-105 sm:w-24"
        >
          <img
            src={`${IMAGE}w342${next.poster_path}`}
            alt={next.title || next.name}
            className="aspect-2/3 w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/50">
            <ChevronRight size={25} />
          </span>
        </Link>
      </div>

      <div className="absolute bottom-8 left-5 z-20 flex gap-2 md:left-10">
        {items.map((item, index) => (
          <button
            key={`${item.media_type}-${item.id}`}
            type="button"
            aria-label={`Show ${item.title || item.name}`}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-8 bg-primary-accent"
                : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
