// import { useState } from "react";
// import toast from "react-hot-toast";

// import SearchBar from "../SearchBar/SearchBar";
// import MovieGrid from "../MovieGrid/MovieGrid";
// import Loader from "../Loader/Loader";
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import MovieModal from "../MovieModal/MovieModal";
// import tmdb from "../../api/tmdb";

// import type { Movie } from "../../types/movie";

// import styles from "./App.module.css";

// function App() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

//   const fetchMovies = async (query: string) => {
//     setMovies([]);
//     setIsLoading(true);
//     setError(false);

//     try {
//       const { data } = await tmdb.get("/search/movie", {
//         params: { query },
//       });

//       if (!data.results || data.results.length === 0) {
//         toast.error("No movies found for your request.");
//         return;
//       }

//       setMovies(data.results);
//     } catch (err) {
//       console.error("TMDB request error:", err);
//       setError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.app}>
//       <SearchBar onSubmit={fetchMovies} />

//       {isLoading && <Loader />}
//       {error && <ErrorMessage />}

//       {!isLoading && !error && movies.length > 0 && (
//         <MovieGrid
//           movies={movies}
//           onSelect={(movie) => setSelectedMovie(movie)}
//         />
//       )}

//       {selectedMovie && (
//         <MovieModal
//           movie={selectedMovie}
//           onClose={() => setSelectedMovie(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import toast from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { searchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import styles from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = async (query: string) => {
    setMovies([]); //** */
    setIsLoading(true);
    setError(false);

    try {
      const response = await searchMovies(query);

      if (response.results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(response.results);
    } catch (err) {
      console.error("TMDB request error:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={fetchMovies} />

      {isLoading && <Loader />}
      {error && <ErrorMessage />}

      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => setSelectedMovie(movie)}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
