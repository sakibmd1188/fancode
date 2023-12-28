import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Genre.css";
import MovieList from "../Movies";

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [activeGenres, setActiveGenres] = useState([]);
  const [genreIds, setGenreId] = useState([]);
  // console.log(activeGenres);
  useEffect(() => {
    const fetchMovieGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list",
          {
            params: {
              language: "en",
            },
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDA5YmRlZDcxNWJlNzI1NTMxZjE1ZGJhNjNkNWI1NSIsInN1YiI6IjY1N2Q0NWFjNjBjNzUxMDcxODc3NDFlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZZtPBogfB1cT_G5fHKneqQHispahdCTFhN_D8AvRA5k",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setGenres(response.data.genres);
      } catch (error) {
        setError("Error fetching movie genres.");
        console.error("Error fetching movie genres:", error);
      }
    };

    fetchMovieGenres();
  }, []);

  const handleGenreClick = (genreId, genreName) => {
    const updatedGenres = [...activeGenres];
    const updatedGenreIds = [...genreIds];

    if (updatedGenres.includes(genreName)) {
      const index = updatedGenres.indexOf(genreName);
      updatedGenres.splice(index, 1); // Remove Active genre if already exists
      updatedGenreIds.splice(updatedGenreIds.indexOf(genreId), 1); // Remove genreId if already exists
    } else {
      updatedGenres.push(genreName); // Add genre if not exists
      updatedGenreIds.push(genreId); // Add genreId if not exists
    }

    setActiveGenres(updatedGenres);
    setGenreId(updatedGenreIds);
    console.log("Clicked:", updatedGenres);
    console.log("Genre IDs:", updatedGenreIds);
  };

  const handleGenreDoubleClick = () => {
    setActiveGenres([]); // Clear the clicked genres array on double-click
    console.log("All genres unclicked");
  };

  return (
    <div className="genre-container">
      <h1 style={{ color: "white" }}>Movie Genres</h1>
      {error && <p>{error}</p>}
      <div className="genre-list">
        {genres.length > 0 &&
          genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-button ${activeGenres.includes(genre.name) ? "active" : ""
                }`}
              onClick={() => handleGenreClick(genre.id, genre.name)}
              onDoubleClick={handleGenreDoubleClick}
            >
              {genre.name}
            </button>
          ))}
      </div>
      <MovieList active={activeGenres} genreId={genreIds} />
    </div>
  );
};

export default Genre;
