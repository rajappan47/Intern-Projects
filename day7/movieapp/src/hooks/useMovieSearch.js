import { useState, useEffect, useCallback } from 'react';

const API_KEY = '14ee608d'; 
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const useMovieSearch = (query, page) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  // Selected single movie detail state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch list of movies (Used for Default and Search views)
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(query)}`);
      const data = await response.json();
      console.log(data);

      if (data.Response === 'True') {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults, 8));
      } else {
        setError(data.Error || 'No movies found.');
        setMovies([]);
        setTotalResults(0);
      }
    } catch (err) {
      setError('Something went wrong. Please check your network.');
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  
  const fetchMovieDetails = useCallback(async (imdbID) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`${BASE_URL}&i=${imdbID}&plot=full`);
      const data = await response.json();
      if (data.Response === 'True') {
        setSelectedMovie(data);
      }
    } catch (err) {
      console.error("Failed to load details", err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetails = () => setSelectedMovie(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchMovies]);

  return { 
    movies, 
    loading, 
    error, 
    totalResults, 
    selectedMovie, 
    detailLoading, 
    fetchMovieDetails, 
    closeDetails 
  };
};