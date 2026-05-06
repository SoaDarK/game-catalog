import { API_URL, handleResponse } from './apiClient.js';

export const normalizeUser = (user) => ({
  id: user.id,
  username: user.username,
  firstName: user.username?.split(' ')[0] || user.username || user.email,
  lastName: user.username?.split(' ').slice(1).join(' ') || '',
  email: user.email,
  createdAt: user.created_at,
});

export const registerUser = async (user) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  return normalizeUser(await handleResponse(response));
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  return normalizeUser(await handleResponse(response));
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};
