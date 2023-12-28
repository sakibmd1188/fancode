import React, { useState, useEffect, useRef } from 'react';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [years, setYears] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const page = useRef(1);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const apiKey = '5409bded715be725531f15dba63d5b55'; // Replace with your actual API key
            const initialYear = 2012;
            const finalYear = 2024; // Limit the range to 2024
            const yearsRange = Array.from({ length: finalYear - initialYear + 1 }, (_, index) => initialYear + index);
            setYears(yearsRange);

            const fetchMoviesByYear = async (year, pageNum) => {
                try {
                    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=${pageNum}&vote_count.gte=10`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch movies for year ${year}`);
                    }
                    const data = await response.json();
                    return data.results;
                } catch (error) {
                    throw new Error(error.message);
                }
            };

            const delayTime = 2000; // 2 seconds delay (adjust as needed)
            await new Promise(resolve => setTimeout(resolve, delayTime)); // Simulate a delay

            const fetchedMovies = [];
            for (let i = 0; i < yearsRange.length; i++) {
                const moviesData = await fetchMoviesByYear(yearsRange[i], page.current);
                fetchedMovies.push({ year: yearsRange[i], movies: moviesData });
            }
            setMovies(prevMovies => [...prevMovies, ...fetchedMovies]);
            setIsLoading(false);
        } catch (error) {
            setError('There was a problem fetching data');
            setIsLoading(false);
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight ||
            isLoading
        ) {
            return;
        }

        setTimeout(() => {
            page.current++;
            fetchData();
        }, 1000); // Adjust the delay as needed
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                // Fetch initial data
                await fetchData();
                setIsLoading(false);
            } catch (error) {
                setError('There was a problem fetching data');
                setIsLoading(false);
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [movies]);

    return (
        <div>
            {movies.map(({ year, movies }) => (
                <div key={year}>
                    <h2>Movies from {year}</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {movies.map(movie => (
                            <div key={movie.id} style={{ width: '200px' }}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '5px' }}
                                />
                                <p style={{ textAlign: 'center', fontSize: '14px' }}>{movie.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {error && <p>{error}</p>}
            {isLoading && <p>Loading...</p>}
        </div>
    );
};

export default MovieList;
