import { PUBLIC_API_BASE_URL } from '$env/static/public';


// src/routes/articles/[id]/+page.js
/** 
 * use the `load` function to fetch the article and its comments 
 * whenever someone navigates to /articles/[id]. 
 */
export async function load({ params, fetch }) {
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
  // At this point, `article` has an `author_id` field (but no username).
  

  // 2. Fetch the comments for that article
  const commentsRes = await fetch(`${PUBLIC_API_BASE_URL}/articles/${id}/comments`);
  if (!commentsRes.ok) {
    // You can choose to return an empty array or throw. Here we throw:
    throw new Error(`Could not fetch comments for article ${id}`);
  }
  const comments = await commentsRes.json();

  // 3. Return both pieces of data so that +page.svelte can access them via `data`
  return {
    article,
    comments
  };
}
