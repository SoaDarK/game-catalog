import { filterByGenre, searchGames, sortGames } from '../utils/gameUtils.js';

const games = [
  { id: 1, title: 'Cyberpunk 2077', genre: 'RPG', rating: 8.5, price: 599, releaseDate: '2020-12-10' },
  { id: 2, title: 'Doom Eternal', genre: 'Shooter', rating: 9.1, price: 499, releaseDate: '2020-03-20' },
  { id: 3, title: 'Hades', genre: 'Indie', rating: 9.3, price: 299, releaseDate: '2020-09-17' },
];

describe('gameUtils', () => {
  test('filters games by genre', () => {
    expect(filterByGenre(games, 'Shooter')).toEqual([games[1]]);
    expect(filterByGenre(games, 'All')).toBe(games);
  });

  test('searches games by title ignoring case', () => {
    expect(searchGames(games, 'doom')).toEqual([games[1]]);
    expect(searchGames(games, '  CYBER  ')).toEqual([games[0]]);
  });

  test('sorts games without mutating original list', () => {
    const sortedByRating = sortGames(games, 'rating');
    const sortedByPrice = sortGames(games, 'price');

    expect(sortedByRating.map((game) => game.title)).toEqual(['Hades', 'Doom Eternal', 'Cyberpunk 2077']);
    expect(sortedByPrice.map((game) => game.title)).toEqual(['Hades', 'Doom Eternal', 'Cyberpunk 2077']);
    expect(games.map((game) => game.id)).toEqual([1, 2, 3]);
  });
});
