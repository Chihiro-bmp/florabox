const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export const createCard = (payload) =>
  request('/api/cards', { method: 'POST', body: JSON.stringify(payload) });

export const getCard = (id) => request(`/api/cards/${encodeURIComponent(id)}`);
