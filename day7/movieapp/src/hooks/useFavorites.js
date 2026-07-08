import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('movie_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('movie_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prevFavs) => {
      const isFav = prevFavs.some((fav) => fav.imdbID === movie.imdbID);
      if (isFav) {
        return prevFavs.filter((fav) => fav.imdbID !== movie.imdbID);
      } else {
        return [...prevFavs, movie];
      }
    });
  }, []);

  return { favorites, toggleFavorite };
};