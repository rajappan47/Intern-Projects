import React from 'react';

export const MovieCard = React.memo(({ movie, isFavorite, onToggleFavorite, onSelectMovie }) => {
  
  // Handhandle broken image URLs dynamically
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=300&auto=format&fit=crop';
  };

  // Determine if poster exists or needs fallback
  const posterSrc = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=300&auto=format&fit=crop';

  return (
    <div className="movie-card">
      <div className="clickable-area" onClick={() => onSelectMovie(movie.imdbID)}>
        <img 
          src={posterSrc} 
          alt={movie.Title} 
          className="movie-poster"
          onError={handleImageError} // Automatically catches and updates broken URLs
        />
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.Title}</h3>
          <p className="movie-card-year">{movie.Year}</p>
        </div>
      </div>
      <div style={{ padding: '0 16px 16px 16px' }}>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Stops the card click from opening details
            onToggleFavorite(movie);
          }}
          className={`fav-btn ${isFavorite ? 'favorited' : ''}`}
          style={{ width: '100%' }}
        >
          {isFavorite ? '❤️ Favorited' : '🤍 Add Favorite'}
        </button>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';