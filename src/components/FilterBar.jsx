function FilterBar({
  genres,
  selectedGenre,
  sortBy,
  hasActiveFilters,
  onGenreChange,
  onSortChange,
  onReset,
}) {
  return (
    <div className="filters">
      <label className="control-group">
        <span>Жанр</span>
        <select
          className="input"
          value={selectedGenre}
          onChange={(event) => onGenreChange(event.target.value)}
        >
          <option value="All">Усі жанри</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>

      <label className="control-group">
        <span>Сортування</span>
        <select
          className="input"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="">Без сортування</option>
          <option value="rating">За рейтингом</option>
          <option value="price">За ціною</option>
          <option value="date">За датою виходу</option>
        </select>
      </label>

      <button
        className="button button--secondary filter-reset"
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilters}
      >
        Скинути
      </button>
    </div>
  );
}

export default FilterBar;
