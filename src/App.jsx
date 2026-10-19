import { Route, Routes } from "react-router"
import Navbar from "./components/Navbar"
import MovieDetails from "./components/MovieDetails"
import Home from "./pages/Home"
import FooterPage from "./pages/FooterPage"
import CatalogPage from "./pages/CatalogPage"
import TVDetails from "./components/TVDetails"
import WatchPage from "./pages/WatchPage"

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-main-background text-main-text">
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/movie/:id" element={<MovieDetails/>}/>
        <Route path="/tv/:id" element={<TVDetails />} />
        <Route path="/movies"  element={<CatalogPage type="movie" />}/>
        <Route path="/tv-shows"  element={<CatalogPage type="tv" />}/>
        <Route path="/watch/movie/:id" element={<WatchPage type="movie" />}/>
        <Route path="/watch/tv/:id" element={<WatchPage type="tv" />}/>
        <Route path="/watch/tv/:id/:season/:episode" element={<WatchPage type="tv" />}/>
      </Routes>

      <FooterPage/>
    </div>
  )
}

export default App
