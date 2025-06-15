import { useState, useEffect } from "react";

const KEY = "3f1b15e2";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([1]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    callback?.();
    // NOTE THE USE OF CLEAN UP FUNCTION TO REMOVE FETCHED DATA WHEN NOT  with the use of abort controller with effect
    const controller = new AbortController();
    async function fetchMovie() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("something went wrong with fetch movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("movie not found!");

        setMovies(data.Search);
        setError("");
        console.log(data);
      } catch (err) {
        console.error(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovie();

    // below is the code for cleanup function after the abortcontroller is connected to the effect above
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
