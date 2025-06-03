import { PUBLIC_API_BASE_URL } from "$env/static/public";


/** 
 * Fetches the array of tags from /api/tags.
 * Each tag should have: { id, content }
 */


const articlesRaw = await res.json();

export async function load({ fetch }) {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/tags`); 
  if (!res.ok) {
    throw new Error('Failed to fetch tags');
  }
  const tags = await res.json();
  return { tags };
}
