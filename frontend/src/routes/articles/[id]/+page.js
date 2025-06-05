export async function load({ params, fetch }) {
  const id = params.id;

  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

  // fetch article information
  const articleRes = await fetch(`${BASE_URL}/articles/${id}`);
  if (!articleRes.ok) {
    return { error: true, status: articleRes.status };
  }
  const article = await articleRes.json();

  // fetch author information
  let user = null;
  if (article.author_id) {
    const userRes = await fetch(`${BASE_URL}/users/${article.author_id}`);
    if (userRes.ok) user = await userRes.json();
  }

  // fetch tags
  const tagsRes = await fetch(`${BASE_URL}/articles/${id}/tags`);
  const tags = tagsRes.ok ? await tagsRes.json() : [];

  // fetch likes
  const likesRes = await fetch(`${BASE_URL}/articles/${id}/likes`);
  const likes = likesRes.ok ? (await likesRes.json()).length : 0;

  // fetch comments
  const commentsRes = await fetch(`${BASE_URL}/articles/${id}/comments`);
  const comments = commentsRes.ok ? await commentsRes.json() : [];

  return {
    article,
    user,
    tags,
    likes,
    comments,
    error: false
  };
}
