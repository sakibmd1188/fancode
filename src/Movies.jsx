import React, { useState, useEffect } from 'react';

const MovieList = ({ active, genreId }) => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (year) => {
        try {
            setIsLoading(true);
            const apiKey = '2dca580c2a14b55200e784d157207b4d';
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch movies for year ${year}`);
            }

            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchMoviesByYearRange = async () => {
            try {
                setIsLoading(true);
                const initialYear = 2012;
                const finalYear = 2024;
                const yearsRange = Array.from(
                    { length: finalYear - initialYear + 1 },
                    (_, index) => initialYear + index
                );

                const fetchedMovies = [];
                for (let i = 0; i < yearsRange.length; i++) {
                    const moviesData = await fetchData(yearsRange[i]);
                    fetchedMovies.push({ year: yearsRange[i], movies: moviesData });
                }

                setMovies(fetchedMovies);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoviesByYearRange();
    }, []);

    return (
        <div className='centered-container'>
            <div className="movies-container">
                {movies.map(({ year, movies }) => (
                    <div key={year}>
                        <h2 style={{ color: 'red' }}>Movies from {year}</h2>
                        <div className="movies-list">
                            {movies.map((movie, index) => {
                                const includesGenreId = movie.genre_ids.some(id => genreId.includes(id));

                                if (includesGenreId || genreId.length === 0) {
                                    return (
                                        <div className="movie-card" key={movie.id}>
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                                alt={movie.title}
                                            />
                                            <div className="movie-info">
                                                <h3>Movie: {movie.title}</h3>
                                                <p>Rating: {movie.vote_average}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                ))}
                {isLoading && <p>Loading...</p>}
            </div>
        </div>
    );
};

export default MovieList;
