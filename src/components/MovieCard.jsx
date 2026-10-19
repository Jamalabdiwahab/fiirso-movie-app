
import { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const title = movie.title || movie.name || "Untitled";

  const detailsPath =
  movie.media_type === "tv" || movie.first_air_date
    ? `/tv/${movie.id}`
    : `/movie/${movie.id}`;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "N/A";

  if (!posterUrl || imageFailed) {
    return null;
  }

  return (
    <Link
      to={detailsPath}
      draggable={false}
      className="group block w-36 shrink-0 snap-start sm:w-44 md:w-47"
    >
      <article>
        <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-cards-panels">
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            draggable={false}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />

          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-yellow-400">
            <Star size={12} fill="currentColor" />
            {Number(movie.vote_average ?? 0).toFixed(1)}
          </div>
        </div>

        <h3 className="mt-3 truncate text-sm text-main-text transition group-hover:text-primary-accent">
          {title}
        </h3>

        <p className="mt-1 text-xs text-secondary-text">
          {year}
        </p>
      </article>
    </Link>
  );
};

export default MovieCard;
