# FiirsoApp

A movie and TV show discovery site built with React. Browse what's popular and trending, search across movies and series, and open a detail page for any title. Data comes from the TMDB API.

<!-- Add a screenshot or two here once you have them:
![Home page](./screenshots/home.png)
-->

## Features

- Hero carousel on the home page with the featured titles
- Horizontal rows for popular movies, popular TV shows and trending titles, swipeable on mobile
- Separate Movies and TV Shows pages
- Detail pages for every movie and series (`/movie/:id`, `/tv/:id`)
- Live search that queries movies and TV shows together, with a short debounce so it doesn't fire on every keystroke
- Responsive layout with a mobile menu
- Cards without a poster are skipped instead of showing broken images

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Icons | lucide-react |
| Data | TMDB API |

## Getting started

You'll need Node.js 18 or newer and a free TMDB API key from [themoviedb.org](https://www.themoviedb.org/settings/api).

```bash
git clone https://github.com/Jamalabdiwahab/fiirso-web.git
cd fiirso-web
npm install
```

Create a `.env` file in the project root:

```env
VITE_TMDB_API_KEY=your_key_here
```

Then start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Project structure

```
src/
  components/    Navbar, hero, movie rows, cards, footer
  pages/         Home, Movies, TV Shows, detail pages
  services/      TMDB API calls
public/          Logo and static files
```

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB. All movie and TV data and images belong to their respective owners.

## Author

Jamal, [@Jamalabdiwahab](https://github.com/Jamalabdiwahab)
