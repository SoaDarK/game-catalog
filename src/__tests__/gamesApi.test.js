import { createGame, fetchGames } from '../services/gamesApi.js';

describe('gamesApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches and normalizes games from REST API', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Portal 2',
          genre: 'Puzzle',
          rating: '9.5',
          price: 199,
          release_date: '2011-04-19',
          image_url: '/images/portal.svg',
        },
      ],
    });

    const games = await fetchGames();

    expect(fetch).toHaveBeenCalledWith('/api/games');
    expect(games[0]).toMatchObject({
      id: 1,
      title: 'Portal 2',
      rating: 9.5,
      releaseDate: '2011-04-19',
      image: '/images/portal.svg',
    });
  });

  test('sends create request with JSON body', async () => {
    const payload = { title: 'New Game', genre: 'Indie' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 10, ...payload }),
    });

    await createGame(payload);

    expect(fetch).toHaveBeenCalledWith('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  test('throws readable API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to create game', error: 'Validation error' }),
    });

    await expect(createGame({ title: '' })).rejects.toThrow(
      'Failed to create game: Validation error',
    );
  });
});
