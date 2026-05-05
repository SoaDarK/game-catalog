function SearchBar({ value, onChange }) {
  return (
    <label className="control-group">
      <span>Пошук гри</span>
      <input
        className="input"
        type="search"
        placeholder="Наприклад, Cyberpunk"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default SearchBar;
