export const API_URL = '/api';

export const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const details = data?.error ? `: ${data.error}` : '';
    throw new Error(`${data?.message || 'API request failed'}${details}`);
  }

  return data;
};
