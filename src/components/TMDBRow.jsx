
import { useEffect, useState } from "react";
import { Link } from "react-router";
import MovieRow from "./MovieRow";

const TMDBRow = ({ title, fetcher, type = "movie", id }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetcher(1)
      .then((data) => {
        if (!cancelled) {
          setItems(
            data.results
              .filter((item) => item.poster_path)
              .slice(0, 20)
          );
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Could not load this section.");
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  const normalizedItems = items.map((item) => ({
    ...item,
    title: item.title || item.name,
    release_date: item.release_date || item.first_air_date,
    media_type: item.media_type || type,
  }));

  if (error) {
    return (
      <p className="px-6 py-4 text-sm text-red-400">{error}</p>
    );
  }

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between px-5 md:px-10">
        <h2 className="border-l-2 border-primary-accent pl-3 text-lg font-bold text-main-text">
          {title}
        </h2>

        <Link
          to={type === "tv" ? "/tv-shows" : "/movies"}
          className="text-sm text-secondary-text transition hover:text-primary-accent"
        >
          View all
        </Link>
      </div>

      <MovieRow
        id={id}
        title=""
        movies={normalizedItems}
      />
    </section>
  );
};

export default TMDBRow;
