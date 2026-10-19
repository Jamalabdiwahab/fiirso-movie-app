import MovieCard from "./MovieCard"

const TopTenRow = ({ movies }) => {
  return (
    <section className="py-8">
        <h2 className="mb-5 border-l-4 border-primary-accent pl-3 text-xl font-bold">
            Top 10 This Week
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {
                movies.slice(0, 5).map((movie, index) => (
                    <div 
                      id={movie.id} 
                      className="flex min-w-0 items-center gap-3"
                    >
                        <span className="text-4xl font-black italic text-primary-accent">
                            { index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                            <MovieCard movie={movie}/>
                        </div>

                    </div>
                ))
            }
        </div>
    </section>
  )
}

export default TopTenRow