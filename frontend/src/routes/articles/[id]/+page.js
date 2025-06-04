// src/routes/articles/[id]/+page.js
import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
  const { id } = params;

  // 1) Fetch the article itself
  const articleRes = await fetch(`http://localhost:3000/api/articles/${id}`);
  if (articleRes.status === 404) {
    throw error(404, 'Article not found');
  }
  if (!articleRes.ok) {
    throw error(articleRes.status, `Could not fetch article (${articleRes.status})`);
  }
  const article = await articleRes.json();

  // 2) Fetch the comments for that article
  const commentsRes = await fetch(`http://localhost:3000/api/articles/${id}/comments`);
  if (!commentsRes.ok) {
    // You could return an empty array instead of error if you prefer:
    // const comments = [];
    // Or, throw if you really want to fail:
    throw error(commentsRes.status, `Could not fetch comments (${commentsRes.status})`);
  }
  const comments = await commentsRes.json();
  // Each comment object already has a `username` property:
  //    e.g. { id: 2, content: "Very informative.", created_at: "...", username: "janedoe" }

  // 3) Fetch the user row for article.author_id
  const userRes = await fetch(`http://localhost:3000/api/users/${article.author_id}`);
  if (userRes.status === 404) {
    article.username = 'Unknown';
  } else if (!userRes.ok) {
    throw error(userRes.status, `Could not fetch author (${userRes.status})`);
  } else {
    const user = await userRes.json();
    article.username = user.username; 
  }

  // 4) Return BOTH the article and the comments array
  return {
    article,
    comments
  };
}
