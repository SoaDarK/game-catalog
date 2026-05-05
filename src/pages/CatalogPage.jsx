import { useMemo, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import GameCard from '../components/GameCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { games } from '../data/games.js';
import { filterByGenre, searchGames, sortGames } from '../utils/gameUtils.js';

function CatalogPage() {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('');

  const genres = useMemo(() => [...new Set(games.map((game) => game.genre))].sort(), []);
  const hasActiveFilters = Boolean(query || selectedGenre !== 'All' || sortBy);

  const visibleGames = useMemo(() => {
    const foundGames = searchGames(games, query);
    const filteredGames = filterByGenre(foundGames, selectedGenre);
    return sortGames(filteredGames, sortBy);
  }, [query, selectedGenre, sortBy]);

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

      {visibleGames.length > 0 ? (
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
