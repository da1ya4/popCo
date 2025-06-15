import { useEffect, useState, useRef } from "react";
import "./App.css";
import StarRating from "./starRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorage";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt137",
    title: "inception",
    year: "2010",
    poster: "./img/otem.jpg",
  },
  {
    imdbID: "tt138",
    title: "the matrix",
    year: "1999",
    poster: "./img/otem.jpg",
  },
  {
    imdbID: "tt139",
    title: "the parasite",
    year: "2019",
    poster: "./img/omolola1.jpg",
  },
];

const tempMatchedDate = [
  {
    imdbID: "tt137",
    title: "inception",
    year: "2010",
    poster: "./img/otem1.jpg",
    runtime: 148,
    imDbRating: 8.8,
    userRating: 10,
  },

  {
    imdbID: "tt140",
    title: "back to the future",
    year: "1985",
    poster: "./img/otem2.jpg",
    runtime: 116,
    imDbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "3f1b15e2";
//const QUERY = "interstellar";

function App() {
  const [paste, setPaste] = useState([]);
  return (
    <div className="App">
      <Test paste={paste} setPaste={setPaste} />

      <Usepopcorn />
    </div>
  );
}

function Test({ paste, setPaste }) {
  const [queri, setQueri] = useState("");

  useEffect(() => {
    async function fetchMovi() {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata`
      );

      const data = await res.json();
      //   setPaste(data.results);
      console.log(data.results);
    }
    fetchMovi();
  }, [queri]);
}

function Usepopcorn() {
  const [query, setQuery] = useState("");

  const [selectId, setSelectedId] = useState(null);

  //BELOW IS A CUSTOME HOOKE
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [tmdd, setTmdd] = useLocalStorageState([], "watchedTmdd");

  //const [tmdd, setTmdd] = useState([]);

  // CODE BELOW GET/QUERY THE STORED DATA IN LOCALSTORAGE
  // AND NOTE THAT FUNCTION CAN ONLY BE PASSED INTO A STATE
  //  BUT NOT BE CALLED IN STATE

  /*const [tmdd, setTmdd] = useState(() => {
    const storedValue = localStorage.getItem("watchedtmdd");
    return JSON.parse(storedValue);
  }); */

  // CODE BELOW ALLOW THE DATA FETECHED TO STORE IN LOCALSTORAGE OF THE BROWSER

  /*  useEffect(() => {
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
    handleCloseMovie();
    // below is the code for cleanup function after the abortcontroller is connected to the effect above
    return function () {
      controller.abort();
    };
  }, [query]); */

  /*
  EXPERIMENT ON DEPENDENCIES ARRAY IN USE EFFECT
  useEffect(function(){
    console.log(' after every rendering')
  })


  useEffect(function(){
    console.log('after initial rendering')
  }, [])

  console.log('during rendering')

  useEffect(function(){
    console.log('D')
  }, [query])
  */

  function handleSelectedMovie(id) {
    setSelectedId((selectId) => (id === selectId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(wmovieli) {
    setTmdd((tmdd) => [...tmdd, wmovieli]);

    //localStorage.setItem(tmdd, JSON.stringify([...tmdd,wmovieli]))
  }

  function handleDeleteWatchedMovie(id) {
    setTmdd((tmdd) => tmdd.filter((movie) => movie.imdbID !== id));
  }

  /*useEffect(() => {
    localStorage.setItem("watchedtmdd", JSON.stringify(tmdd));
  }, [tmdd]); */

  return (
    <div>
      <Navba>
        <Logos />
        <Searchh query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </Navba>

      <Main>
        <div className="main">
          <div className="box1">
            <Box1>
              {isLoading && <Loader />}
              {!isLoading && !error && (
                <MovieUl
                  tmd={movies}
                  onSelectMovie={handleSelectedMovie}
                  key={movies.imdbID}
                />
              )}
              {error && <ErrorMessage message={error} />}
            </Box1>
          </div>

          <div className="box2">
            <Box1>
              {selectId ? (
                <MovieDetails
                  selectId={selectId}
                  onWatchedMovie={handleAddWatchedMovie}
                  onCloseMovie={handleCloseMovie}
                  watched={tmdd}
                />
              ) : (
                <div className="summary">
                  <MovieSummary tmdd={tmdd} />
                  <WatchedMovieUl
                    tmdd={tmdd}
                    key={tmdd.imdbID}
                    onDeleteWatched={handleDeleteWatchedMovie}
                  />
                </div>
              )}
            </Box1>
          </div>
        </div>
      </Main>
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p class className=" error">
      <pan>📩</pan> {message}
    </p>
  );
}
function Navba({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Result({ movies }) {
  return (
    <p>
      Found <strong>{movies.length}</strong> result
    </p>
  );
}
function Logos() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Usepopcorn</h1>
    </div>
  );
}

function Searchh({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  /* useEffect(() => {
    function callback(e) {
      //if (document.activeElement === inputEl.current) return;

      if (e.code === "Enter") {
        if (document.activeElement === inputEl.current) return;
        inputEl.current.focus();
        setQuery("");
      }
    }
    const focus = document.addEventListener("keydown", callback);
    return () => focus;
  }, [setQuery]); */

  // useEffect(()=>{
  // const el= document.querySelector(".search")
  // console.log(el)
  // el.focus()
  // }, [])

  return (
    <input
      className="search"
      type="text"
      value={query}
      placeholder="Search movies..."
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function MovieDetails({ selectId, watched, onCloseMovie, onWatchedMovie }) {
  const [movie, setMovies] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectId
  )?.userRating;

  // THE USEEFFECT LINES OF CODE BELOW IS TO ACCESS NUMBER OF TIMES THE USER SELECTED RATING
  // BUT HAS NOT MADE FINAL DECISION
  const countRef = useRef(0);
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // THE COMMENT BELOW IS EXPERIMENT ON VIOLATION OF HOOKS RULE,
  // SO DO NOT CALL HOOKS IN CONDITIONAL AND THERE SHOULD NOT BE EARLY RETURN
  /*eslink-disable */
  //if(imdbRating>8) [isTop, setIsTop]=useState(true)
  // if (imdbRating>8) return <p>violation of hooks rule</p>

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`
        );

        if (!res.ok) throw new Error("something went wrong with fetch movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("movie not found!");

        setMovies(data);
        console.log(data);
      } catch (err) {
        console.error(err.message);
      }
      setIsLoading(false);
    }
    fetchMovieDetails();
  }, [selectId]);

  //KEYPRESS EVENT LISTENER IN USEEFFECT IS AS BELOW,this can be use as shortcut key in app
  useKey("Escape", onCloseMovie);

  /* useEffect(() => {
    document.addEventListener("keydown", function (e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    });

    // CLEANUP FUNCTION IS BELOW
    return function () {
      document.removeEventListener("keydown", function (e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      });
    };
  }, [onCloseMovie]); */

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    // CLEAN UP FUNCTION BELOW RETUREN THE EFFECT BACK TO INITIAL STATE
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  const isTop = imdbRating > 8;
  console.log(isTop);

  //const [avgR, setAvgR]=useState(0)

  function handleAdd() {
    const newWatchMovie = {
      imdbID: selectId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRefDecision: countRef.current,
    };
    onWatchedMovie(newWatchMovie);

    onCloseMovie();

    // THE BELOW CODE UPDATE THE STATE IF NOT THE STATE WILL WILL BE STALE
    //  AND NOT BE UPDATED
    //ANOTHER EXPERIMENT ON HOW TO UPDATE STATE
    //setAvgR(Number(imdbRating))
    //setAvgR((avgR)=>Number((avgR+userRating))/2)
    //alert(avgR)
  }
  console.log(userRating);
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => onCloseMovie()}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />

            <div className="overview-detail">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          {/* <p>{avgR}</p> */}
          <section>
            <div>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onsetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button onClick={handleAdd}>Add to list</button>
                  )}
                </>
              ) : (
                <p style={{ color: "#aaaa" }}>
                  {" "}
                  You have already rated this movie {watchedUserRating}⭐,
                  please check another movie
                </p>
              )}
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by the {director}</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
function Main({ children }) {
  console.log(children);
  return <div>{children}</div>;
}

function Box1({ children, element, key }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button className="btn1" onClick={() => setIsOpen((open) => !open)}>
        {isOpen === false ? "-" : "+"}
      </button>
      {isOpen === false ? element : ""}
      {isOpen === false ? children : ""}
    </div>
  );
}

/*function Box2({children}){
  const[isOpen, setIsOpen]=useState(false)
  return <div>
    <button className="btn1" onClick={()=>setIsOpen((open)=>!open)}  >
       {isOpen===false?"-":"+"}</button>
    {isOpen===false ? children :""}
    
   </div>
} */

function MovieUl({ tmd, onSelectMovie }) {
  return (
    <ul>
      {tmd.map((movieli) => (
        <MovieList
          movieli={movieli}
          onSelectMovie={onSelectMovie}
          key={movieli.imdbID}
        />
      ))}
    </ul>
  );
}

function MovieList({ movieli, onSelectMovie }) {
  console.log({ movieli });

  return (
    <li onClick={() => onSelectMovie(movieli.imdbID)}>
      <img src={movieli.Poster} alt={movieli.Title} />
      <p>{movieli.Title}</p>
      <p>{movieli.Year}</p>
    </li>
  );
}

function WatchedMovieUl({ tmdd, onDeleteWatched }) {
  return (
    <ul>
      {tmdd.map((wmovieli) => (
        <WatchedMovieList
          wmovieli={wmovieli}
          key={wmovieli.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovieList({ wmovieli, onDeleteWatched }) {
  return (
    <li>
      <img src={wmovieli.poster} alt={wmovieli.title} />
      <p>{wmovieli.title}</p>
      <p>{wmovieli.year}</p>

      <p>{wmovieli.runtime}</p>
      <p>{wmovieli.imDbRating}</p>
      <p>{wmovieli.userRating}</p>

      <button
        className="delete-btn"
        onClick={() => onDeleteWatched(wmovieli.imdbID)}
      >
        X
      </button>
    </li>
  );
}

function MovieSummary({ tmdd }) {
  const matchLength = tmdd.length;
  const matchAvgRating = average(tmdd.map((tmdd) => Number(tmdd.imdbRating)));
  const matchUserRating = average(tmdd.map((tmdd) => Number(tmdd.userRating)));
  const matchruntime = average(tmdd.map((tmdd) => tmdd.runtime));
  return (
    <div className="summary">
      <h2> Movies You Watched</h2>
      <p>
        <span>🎦</span>
        <span>{matchLength} Movies</span>
      </p>
      <p>
        <span>⭐</span>
        <span>{matchAvgRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🤩</span>
        <span>{matchUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌠</span>
        <span>{matchruntime}</span>
      </p>
    </div>
  );
}

function Btn({ children, onclick }) {
  return (
    <button className="btn1" onClick={onclick}>
      {children}
    </button>
  );
}

export default App;
