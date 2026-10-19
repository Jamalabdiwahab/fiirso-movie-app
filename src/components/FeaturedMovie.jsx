import { Play, Plus } from "lucide-react"

const FeaturedMovie = () => {
  return (
    <section className="relative my-8 overflow-hidden rounded-2xl border border-borders bg-cards-panels">
        <img 
          src="https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg" 
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-linear-to-r from-main-background via-main-background/85 to-transparent "/>

        <div className="relative z-10 max-w-2xl p-6 sm:p-10 md:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-accent">
                Editor's pick
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Your Next Movie Night
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-secondary-text">
                Discover unforgettable stories, explore new worlds,
                and find something worth watching tonight.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-lg bg-primary-accent px-5 py-3 font-semibold transition hover:bg-hover-accent">
                    <Play size={17} fill="currentColor"/>
                    Explore movies
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-borders bg-cards-panels/80 px-5 py-3 font-semibold transition hover:bg-cards-panels">
                    <Plus size={18}/>
                    My watchlist
                </button>
            </div>
        </div>
    </section>
  )
}

export default FeaturedMovie