import React, { useState, useMemo } from 'react';
import { useMovieSearch } from './hooks/useMovieSearch';
import { useFavorites } from './hooks/useFavorites';
import { MovieCard } from './components/MovieCard';
import './index.css';

export default function App() {
  // 1. Default view established by assigning a baseline keyword
  const [searchTerm, setSearchTerm] = useState('Marvel'); 
  const [page, setPage] = useState(1);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { 
    movies, 
    loading, 
    error, 
    totalResults, 
    selectedMovie, 
    detailLoading, 
    fetchMovieDetails, 
    closeDetails 
  } = useMovieSearch(searchTerm, page);

  const { favorites, toggleFavorite } = useFavorites();
  const favoriteIds = useMemo(() => new Set(favorites.map(m => m.imdbID)), [favorites]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value || 'Marvel'); // Fallback to Marvel if empty
    setPage(1); 
  };

  const totalPages = Math.ceil(totalResults/10);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title" onClick={() => { closeDetails(); setShowFavoritesOnly(false); }} style={{cursor:'pointer'}}>
          🎬 FlickFinder
        </h1>
        <div className="controls">
          { <input
            type="text"
            placeholder="Search movies (e.g., Avengers, Batman)..."
           // value={searchTerm}
            onChange={handleSearchChange}
            disabled={showFavoritesOnly || selectedMovie}
            //className="search-input"
          /> } 

          <button 
            onClick={() => { closeDetails(); setShowFavoritesOnly(!showFavoritesOnly); }}
            className="toggle-btn"
          >
            {showFavoritesOnly ? "⬅ Back to Feed" : `❤️ Favorites (${favorites.length})`}
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* CONDITIONAL RENDERING BRANCH 1: Detailed Single Movie view */}
        {detailLoading && <div className="message">🌀 Loading Profile Specs...</div>}
        
        {selectedMovie && !detailLoading ? (
          <div className="detail-view">
            <button className="back-feed-btn" onClick={closeDetails}>⬅ Back to Grid List</button>
            <div className="detail-layout">
              <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
              <div className="detail-info">
                <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
                <p className="meta-row"><strong>Rated:</strong> {selectedMovie.Rated} | <strong>Runtime:</strong> {selectedMovie.Runtime} | <strong>Genre:</strong> {selectedMovie.Genre}</p>
                <p><strong>Director:</strong> {selectedMovie.Director}</p>
                <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
                <p className="plot-box"><strong>Plot:</strong> {selectedMovie.Plot}</p>
                <div className="ratings-box">
                  <h3>Ratings:</h3>
                  {selectedMovie.Ratings?.map((r, i) => (
                    <span key={i} className="rating-badge"><strong>{r.Source}:</strong> {r.Value}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : showFavoritesOnly ? (
          /* CONDITIONAL RENDERING BRANCH 2: Favorites Dashboard */
          <div>
            <h2 className="section-title">Your Favorites Collection</h2>
            {favorites.length === 0 ? (
              <p className="message">No entries saved.</p>
            ) : (
              <div className="movie-grid">
                {favorites?.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    onSelectMovie={fetchMovieDetails}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CONDITIONAL RENDERING BRANCH 3: Default/Search Grid Feed Layout */
          <div>
            {loading && <div className="message">🌀 Syncing Movies...</div>}
            {error && <div className="error-message">❌ {error}</div>}

            {!loading && !error && movies.length > 0 && (
              <>
                <div className="movie-grid">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      isFavorite={favoriteIds.has(movie.imdbID)}
                      onToggleFavorite={toggleFavorite}
                      onSelectMovie={fetchMovieDetails}
                    />
                  ))}
                </div>

                <div className="pagination">
                  <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="page-btn">Previous</button>
                  <span className="page-text">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="page-btn">Next</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}