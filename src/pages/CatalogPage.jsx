
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getPopularMovies, getPopularTV } from "../services/tmdb";
import MovieCard from "../components/MovieCard";

export default function CatalogPage({ type }) {
  const isTV = type === "tv";
  const fetcher = isTV ? getPopularTV : getPopularMovies;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetcher(1)
      .then((data) => {
        if (cancelled) return;

        setItems(data.results.filter((item) => item.poster_path));
        setTotalPages(data.total_pages);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Could not load titles.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  async function loadMore() {
    if (loadingMore || page >= totalPages) return;

    setLoadingMore(true);
    setError("");

    try {
      const nextPage = page + 1;
      const data = await fetcher(nextPage);

      setItems((current) => {
        const combined = [...current, ...data.results];
        return combined
          .filter((item) => item.poster_path)
          .filter(
            (item, index, array) =>
              array.findIndex((other) => other.id === item.id) === index
          );
      });

      setPage(nextPage);
    } catch (err) {
      console.error(err);
      setError("Could not load more titles.");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <main className="min-h-screen bg-main-background px-5 pb-12 pt-28 text-main-text md:px-10">
      <Link to="/" className="text-sm text-secondary-text hover:text-primary-accent">
        ← Back home
      </Link>

      <h1 className="mb-2 mt-6 text-3xl font-extrabold">
        {isTV ? "TV Shows" : "Movies"}
      </h1>
      <p className="mb-8 text-secondary-text">
        Browse titles from TMDB.
      </p>

      {loading && <p>Loading titles...</p>}
      {error && <p className="mb-4 text-red-400">{error}</p>}

      {!loading && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <MovieCard
              key={item.id}
              movie={{
                ...item,
                title: item.title || item.name,
                release_date: item.release_date || item.first_air_date,
                media_type: isTV ? "tv" : "movie",
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3">
        {page < totalPages && !loading && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-lg bg-primary-accent px-6 py-3 font-semibold text-white hover:bg-hover-accent disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        )}

        <p className="text-sm text-secondary-text">
          Page {page} of {totalPages}
        </p>
      </div>
    </main>
  );
}
