import { PUBLIC_API_BASE_URL } from "$env/static/public";


/** 
 * Fetches the array of tags from /api/tags.
 * Each tag should have: { id, content }
 */

export async function load({ fetch }) {
  // const res = await fetch('/api/tags');
  const res = await fetch('${PUBLIC_API_BASE_URL}/api/tags');
  const tagsRaw = await res.json();
  console.log("tagsRaw fetch: ", tagsRaw);

  if (!res.ok) {
    throw new Error('Failed to fetch tags');
  }
  const tags = await res.json();
  return { tags };
}
