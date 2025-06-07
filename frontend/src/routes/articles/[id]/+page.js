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
    if (userRes.ok) {
      const userJson = await userRes.json();
      const avatarId = userJson.avatar_id;
      let avatarUrl;
      if (avatarId && typeof avatarId === 'number') {
        avatarUrl = `/avatars/avatar${avatarId}.png`;
      } else {
        avatarUrl = `/avatars/avatar-1.png`; // the “no avatar” fallback
      }
      user = {
        id: userJson.id,
        username: userJson.username,
        first_name: userJson.first_name,
        last_name: userJson.last_name,
        avatarUrl
      };
    }
  }
  console.log("user:", user);

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
};
