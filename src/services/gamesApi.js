import { API_URL, handleResponse } from './apiClient.js';

const normalizeRequirements = (requirements) => {
  if (!requirements) {
    return { os: 'N/A', ram: 'N/A', gpu: 'N/A' };
  }

  const parsedRequirements =
    typeof requirements === 'string' ? JSON.parse(requirements) : requirements;

  return {
    os: parsedRequirements.os || 'N/A',
    ram: parsedRequirements.ram || 'N/A',
    gpu: parsedRequirements.gpu || 'N/A',
  };
};

export const normalizeGame = (game) => ({
  id: game.id,
  title: game.title,
  genre: game.genre || 'Unknown',
  rating: Number(game.rating ?? 0),
  price: Number(game.price ?? 0),
  releaseDate: game.releaseDate || game.release_date || '',
  image: game.image || game.image_url || '/images/doom.svg',
  screenshots: [game.image || game.image_url || '/images/doom.svg'],
  description: game.description || 'Опис поки не додано.',
  developer: game.developer || 'Unknown developer',
  requirements: normalizeRequirements(game.requirements),
});

export const fetchGames = async () => {
  const response = await fetch(`${API_URL}/games`);
  const games = await handleResponse(response);
  return games.map(normalizeGame);
};

export const fetchGame = async (id) => {
  const response = await fetch(`${API_URL}/games/${id}`);
  const game = await handleResponse(response);
  return normalizeGame(game);
};

export const createGame = async (game) => {
  const response = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  });

  return handleResponse(response);
};

export const updateGame = async (id, game) => {
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  });

  return handleResponse(response);
};

export const deleteGame = async (id) => {
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};
