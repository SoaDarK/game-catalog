export const filterByGenre = (games, genre) => {
  if (!genre || genre === 'All') {
    return games;
  }

  return games.filter((game) => game.genre === genre);
};

export const sortGames = (games, sortBy) => {
  const sortedGames = [...games];

  switch (sortBy) {
    case 'rating':
      return sortedGames.sort((a, b) => b.rating - a.rating);
    case 'price':
      return sortedGames.sort((a, b) => a.price - b.price);
    case 'date':
      return sortedGames.sort(
        (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      );
    default:
      return sortedGames;
  }
};

export const searchGames = (games, query) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return games;
  }

  return games.filter((game) => game.title.toLowerCase().includes(normalizedQuery));
};
