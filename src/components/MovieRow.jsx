
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies = [], id }) => {
  const rowRef = useRef(null);
  const movieList = Array.isArray(movies) ? movies : [];

  const scrollRow = (direction) => {
    if (!rowRef.current) return;

    rowRef.current.scrollBy({
      left: direction * rowRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section
      id={id}
      className="relative mb-10 w-full min-w-0 bg-main-background"
    >
        {
            title && (

                <div className="mb-4 flex items-center justify-between px-4 sm:px-6">
                    <h2 className="border-l-2 border-primary-accent pl-3 text-lg font-bold text-main-text sm:text-xl">
                      {title}
                    </h2>
                </div>
            )
        }

      <div className="group/row relative">
        {/* Left arrow */}
        <button
          type="button"
          aria-label={`Scroll ${title} left`}
          onClick={() => scrollRow(-1)}
          className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/70 p-3 text-white shadow-lg backdrop-blur transition hover:bg-primary-accent group-hover/row:sm:block"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Movie cards */}
        <div
          ref={rowRef}
          className="flex w-full min-w-0 snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 scroll-px-4 scrollbar-none [&::-webkit-scrollbar]:hidden sm:scroll-px-6 sm:px-6"
        >
          {movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        
          ))}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          aria-label={`Scroll ${title} right`}
          onClick={() => scrollRow(1)}
          className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/70 p-3 text-white shadow-lg backdrop-blur transition hover:bg-primary-accent group-hover/row:sm:block"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dark fade at the right edge */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-main-background to-transparent" />
      </div>
    </section>
  );
};

export default MovieRow;
