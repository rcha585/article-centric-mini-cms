const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export async function load({ fetch }) {
  const res = await fetch(`${BASE_URL}/articles`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error(await res.text());
  const articles = await res.json();
  return { articles };
}
