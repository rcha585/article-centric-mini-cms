const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  // if fail request, just throw error.
  if (!res.ok) throw new Error(await res.text());
  
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/** get all articles */
export async function fetchArticles() {
  return request('/articles');
}

/** create an article */
export async function createArticle({ title, content, created_at, image_path }) {
  return request('/articles', {
    method: 'POST',
    body: JSON.stringify({ title, content, created_at, image_path })
  });
}

/** get one article, backend not ready */
export async function fetchArticleById(id) {
  return request(`/articles/${id}`);
}

export async function updateArticle(id, { title, content, image_path }) {
  return request(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content, image_path })
  });
}