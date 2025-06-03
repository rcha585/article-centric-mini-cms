import { PUBLIC_API_BASE_URL } from '$env/static/public';


// src/routes/articles/[id]/+page.js
/** 
 * use the `load` function to fetch the article and its comments 
 * whenever someone navigates to /articles/[id]. 
 */
export async function load({ params, fetch }) {
  const { id } = params;

  // 1. Fetch the article data
  const articleRes = await fetch(`${PUBLIC_API_BASE_URL}/articles/${id}`);
  if (!articleRes.ok) {
    // If your backend returns a 404 or error, you can throw here:
    throw new Error(`Could not fetch article with id ${id}`);
  }
  const article = await articleRes.json();

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
