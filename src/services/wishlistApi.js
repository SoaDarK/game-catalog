import { API_URL, handleResponse } from './apiClient.js';
import { normalizeGame } from './gamesApi.js';

export const fetchWishlist = async (userId) => {
  const response = await fetch(`${API_URL}/wishlist/${userId}`);
  const games = await handleResponse(response);
  return games.map(normalizeGame);
};

export const addWishlistItem = async (userId, gameId) => {
  const response = await fetch(`${API_URL}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, game_id: gameId }),
  });

  return normalizeGame(await handleResponse(response));
};

export const deleteWishlistItem = async (userId, gameId) => {
  const response = await fetch(`${API_URL}/wishlist/${userId}/${gameId}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};
