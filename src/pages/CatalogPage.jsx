import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import GameCard from '../components/GameCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { fetchGames } from '../services/gamesApi.js';
import { filterByGenre, searchGames, sortGames } from '../utils/gameUtils.js';

function CatalogPage() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      setApiError('');

      try {
        const loadedGames = await fetchGames();
        setGames(loadedGames);
      } catch (error) {
        setApiError(`Не вдалося завантажити ігри з API: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  const genres = useMemo(() => [...new Set(games.map((game) => game.genre))].sort(), [games]);
  const hasActiveFilters = Boolean(query || selectedGenre !== 'All' || sortBy);

  const visibleGames = useMemo(() => {
    const foundGames = searchGames(games, query);
    const filteredGames = filterByGenre(foundGames, selectedGenre);
    return sortGames(filteredGames, sortBy);
  }, [games, query, selectedGenre, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setSortBy('');
  };

  return (
    <section className="page">
      <div className="hero">
        <p className="eyebrow">Play to your heart's content</p>
        <h1>Каталог відеоігор</h1>
        <p>
          Переглядай ігри, фільтруй за жанром, сортуй за рейтингом, ціною або датою
          виходу та зберігай цікаві тайтли у Wishlist.
        </p>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar
          genres={genres}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          hasActiveFilters={hasActiveFilters}
          onGenreChange={setSelectedGenre}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
        />
      </div>

      <div className="catalog-summary">
        <span>
          {isLoading ? 'Завантаження з БД...' : `Показано ${visibleGames.length} з ${games.length} ігор`}
        </span>
        {hasActiveFilters && <strong>Список відфільтровано</strong>}
      </div>

      {apiError && <div className="form-message">{apiError}</div>}

      {isLoading ? (
        <div className="empty-state">Завантаження ігор з бази даних...</div>
      ) : visibleGames.length > 0 ? (
        <div className="game-grid">
          {visibleGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="empty-state">Ігор за такими критеріями не знайдено.</div>
      )}
    </section>
  );
}

export default CatalogPage;
