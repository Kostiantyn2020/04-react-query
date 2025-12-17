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

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import type { MoviesResponse } from "../../services/movieService";
import css from "./App.module.css";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (!isLoading && query.trim() && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading, query]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      <main className={css.main}>
        {isLoading && <Loader />}

        {!isLoading && isError && <ErrorMessage />}

        {!isLoading && !isError && movies.length > 0 && (
          <>
            {/*  */}
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
            <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          </>
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
