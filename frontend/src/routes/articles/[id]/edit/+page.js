// use SvelteKkit throw error and redirect
import { redirect, error } from '@sveltejs/kit';

const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  // Must login first, 
  const meRes = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });
  if (!meRes.ok) throw redirect(302, '/login');

  // fetch the article/id, then transfer to json.
  const artRes = await fetch(`${BASE_URL}/articles/${params.id}`, { credentials: 'include' });
  if (!artRes.ok) throw error(artRes.status, 'Article not found');
  const article = await artRes.json();

  // create tagStr to save tags.
  let tagStr = '';
  // fetch article/id/tags
  try {
    const tagRes = await fetch(`${BASE_URL}/articles/${params.id}/tags`);
    console.log('tagRes.ok:', tagRes.ok);
    if (tagRes.ok) {
        const t = await tagRes.json();
        console.log('tags:', t);
        // assemble tags
        tagStr = t.map(x => `#${x.content}`).join(' ');
        console.log('tagStr:', tagStr);
    }
  } catch {}

  return { article, tagStr };
}
