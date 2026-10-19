
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Maximize,
  Pause,
  Play,
  Settings2,
  Volume2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import {
  getMovieDetails,
  getTVDetails,
  getTVSeasonDetails,
  getMovieVideos,
  getTVVideos,
  getTVEpisodeVideos,
} from "../services/tmdb";

const IMAGE = "https://image.tmdb.org/t/p/";

const WatchPage = ({ type }) => {
  const { id, season: seasonParam, episode: episodeParam } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const isTV = type === "tv";

  const [details, setDetails] = useState(null);
  const [seasonNumber, setSeasonNumber] = useState(
    Number(seasonParam) || 1
  );
  const [episodeNumber, setEpisodeNumber] = useState(
    Number(episodeParam) || 1
  );
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);
  const [trailer, setTrailer] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(true);

  // Connect only a video URL you own or are authorized to use.
  const videoUrl = import.meta.env.VITE_AUTHORIZED_VIDEO_URL;
  const subtitleUrl = import.meta.env.VITE_AUTHORIZED_SUBTITLE_URL;

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError("");
      setDetails(null);

      try {
        const data = isTV
          ? await getTVDetails(id)
          : await getMovieDetails(id);

        if (!cancelled) {
          setDetails(data);

          if (isTV && !seasonParam) {
            const firstSeason =
              data.seasons?.find((season) => season.season_number > 0)
                ?.season_number ?? 1;

            setSeasonNumber(firstSeason);
            setEpisodeNumber(1);
          }
        }
      } catch (err) {
        console.error("Watch page details failed:", err);
        if (!cancelled) {
          setError("We couldn't load this title. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [id, isTV, seasonParam]);

  useEffect(() => {
    if (!isTV || !id) return;

    let cancelled = false;

    async function loadSeason() {
      setEpisodesLoading(true);
      setSeasonData(null);

      try {
        const data = await getTVSeasonDetails(id, seasonNumber);
        if (!cancelled) setSeasonData(data);
      } catch (err) {
        console.error("Season loading failed:", err);
        if (!cancelled) setSeasonData(null);
      } finally {
        if (!cancelled) setEpisodesLoading(false);
      }
    }

    loadSeason();

    return () => {
      cancelled = true;
    };
  }, [id, isTV, seasonNumber]);

  useEffect(() => {
    if (!isTV || !seasonParam || !episodeParam) return;

    setSeasonNumber(Number(seasonParam));
    setEpisodeNumber(Number(episodeParam));
  }, [isTV, seasonParam, episodeParam]);

  useEffect(() => {
    let cancelled = false;

    async function loadTrailer() {
      setTrailerLoading(true);
      setTrailer(null);

       try {
          let data;

            if (isTV && seasonParam && episodeParam) {
              data = await getTVEpisodeVideos(
                id,
                Number(seasonParam),
                Number(episodeParam)
              );
            }

            // If the selected episode has no trailer, use the show's trailer.
           if (!data?.results?.length) {
              data = isTV
              ? await getTVVideos(id)
              : await getMovieVideos(id);
            }

            const videos = data.results || [];

            const selected =
               videos.find(
                  (video) =>
                  video.site === "YouTube" &&
                  video.type === "Trailer" &&
                  video.official
                ) ||
                videos.find(
                   (video) =>
                   video.site === "YouTube" &&
                   video.type === "Trailer"
                ) ||
                videos.find(
                  (video) =>
                  video.site === "YouTube" &&
                  video.type === "Teaser"
                );

            if (!cancelled) setTrailer(selected || null);
        } catch (err) {
           console.error("Trailer loading failed:", err);
           if (!cancelled) setTrailer(null);
        } finally {
           if (!cancelled) setTrailerLoading(false);
        }
    }

    loadTrailer();

     return () => {
      cancelled = true;
     };
   }, [id, isTV, seasonParam, episodeParam]);

  const selectedEpisode = seasonData?.episodes?.find(
    (item) => item.episode_number === episodeNumber
  );

  const title = isTV
    ? details?.name
    : details?.title;

  const selectedSeason = details?.seasons?.find(
    (item) => item.season_number === seasonNumber
  );

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (err) {
      console.error("Video playback failed:", err);
    }
  };

  const handleFullscreen = async () => {
    const player = videoRef.current?.parentElement;

    if (!player) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (player.requestFullscreen) {
        await player.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  const chooseEpisode = (number) => {
    setEpisodeNumber(number);

    navigate(
      `/watch/tv/${id}/${seasonNumber}/${number}`
    );

    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const chooseSeason = (value) => {
    const nextSeason = Number(value);
    setSeasonNumber(nextSeason);
    setEpisodeNumber(1);

    navigate(`/watch/tv/${id}/${nextSeason}/1`);
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <main className="min-h-screen pt-10 bg-main-background text-main-text">

      {loading && (
        <div className="px-6 py-20 text-secondary-text">
          Loading your watch page...
        </div>
      )}

      {!loading && error && (
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="text-red-400">{error}</p>
          <Link
            to={isTV ? "/tv-shows" : "/movies"}
            className="mt-5 inline-flex items-center gap-2 text-primary-accent"
          >
            <ArrowLeft size={18} />
            Back to browsing
          </Link>
        </div>
      )}

      {!loading && details && (
        <>
          <div className="mx-auto max-w-350 px-4 pb-16 pt-8 sm:px-6 lg:px-10">
            <Link
              to={isTV ? `/tv/${id}` : `/movie/${id}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-secondary-text transition hover:text-main-text"
            >
              <ArrowLeft size={18} />
              Back to details
            </Link>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_350px]">
              <section className="min-w-0">
                
<div className="overflow-hidden rounded-xl flex items-center justify-center border border-white/10 bg-black shadow-2xl">
  <div className="relative aspect-video w-full bg-[#08080b]">
    {trailer ? (
      <iframe
        key={trailer.key}
        src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=0&controls=1&rel=0&cc_load_policy=1&modestbranding=1`}
        title={`${title || "Title"} trailer`}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center">
        {details.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 px-5 text-center">
          <Play size={40} className="mx-auto mb-4 text-white" />

          <h2 className="text-xl font-bold text-white sm:text-2xl">
            {trailerLoading ? "Finding trailer..." : "Trailer unavailable"}
          </h2>

          {!trailerLoading && (
            <p className="mt-2 text-sm text-gray-300">
              No trailer is available for this title.
            </p>
          )}
        </div>
      </div>
    )}
  </div>
</div>



                <div className="mt-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-accent">
                        Now watching
                      </p>

                      <h1 className="text-3xl font-black sm:text-4xl">
                        {title}
                      </h1>

                      {isTV && selectedEpisode && (
                        <p className="mt-2 text-secondary-text">
                          Season {seasonNumber}, Episode {episodeNumber}:{" "}
                          {selectedEpisode.name}
                        </p>
                      )}
                    </div>

                    {details.vote_average > 0 && (
                      <div className="rounded-lg border border-borders bg-secondary-background px-3 py-2 text-sm">
                        <span className="text-yellow-400">★ </span>
                        {Number(details.vote_average).toFixed(1)}
                        <span className="ml-1 text-secondary-text">/ 10</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 max-w-4xl text-sm leading-7 text-secondary-text">
                    {selectedEpisode?.overview ||
                      details.overview ||
                      "No description is available."}
                  </p>
                </div>
              </section>

              {isTV && (
                <aside className="min-w-0">
                  <div className="overflow-hidden rounded-2xl border border-borders bg-secondary-background">
                    <div className="border-b border-borders p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold">Episodes</h2>
                          <p className="mt-1 text-xs text-secondary-text">
                            Choose an episode to watch
                          </p>
                        </div>

                        <span className="text-xs text-secondary-text">
                          {selectedSeason?.episode_count ?? "—"} total
                        </span>
                      </div>

                      <div className="relative mt-4">
                        <select
                          value={seasonNumber}
                          onChange={(event) =>
                            chooseSeason(event.target.value)
                          }
                          className="w-full appearance-none rounded-lg border border-borders bg-cards-panels px-4 py-3 pr-10 text-sm text-main-text outline-none focus:border-primary-accent"
                        >
                          {details.seasons
                            ?.filter((season) => season.season_number >= 0)
                            .map((season) => (
                              <option
                                key={season.id}
                                value={season.season_number}
                              >
                                {season.name}
                              </option>
                            ))}
                        </select>

                        <ChevronDown
                          size={17}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text"
                        />
                      </div>
                    </div>

                    <div className="max-h-162 overflow-y-auto">
                      {episodesLoading && (
                        <p className="p-5 text-sm text-secondary-text">
                          Loading episodes...
                        </p>
                      )}

                      {!episodesLoading &&
                        seasonData?.episodes?.map((item) => {
                          const active = item.episode_number === episodeNumber;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                chooseEpisode(item.episode_number)
                              }
                              className={`flex w-full gap-3 border-b border-borders p-3 text-left transition ${
                                active
                                  ? "bg-primary-accent/10"
                                  : "hover:bg-cards-panels"
                              }`}
                            >
                              <div className="relative w-28 shrink-0 overflow-hidden rounded-lg bg-cards-panels">
                                {item.still_path ? (
                                  <img
                                    src={`${IMAGE}w300${item.still_path}`}
                                    alt=""
                                    loading="lazy"
                                    className="aspect-video h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex aspect-video items-center justify-center text-xs text-secondary-text">
                                    Episode {item.episode_number}
                                  </div>
                                )}

                                {active && (
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Play size={20} fill="currentColor" />
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-secondary-text">
                                    {String(item.episode_number).padStart(2, "0")}
                                  </span>
                                  {active && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-accent">
                                      Selected
                                    </span>
                                  )}
                                </div>

                                <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
                                  {item.name || `Episode ${item.episode_number}`}
                                </h3>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-secondary-text">
                                  {item.overview || "Episode description unavailable."}
                                </p>
                              </div>
                            </button>
                          );
                        })}

                      {!episodesLoading &&
                        !seasonData?.episodes?.length && (
                          <p className="p-5 text-sm text-secondary-text">
                            Episode information is unavailable for this season.
                          </p>
                        )}
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default WatchPage;
