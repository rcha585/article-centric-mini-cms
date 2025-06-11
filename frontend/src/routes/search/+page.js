
/**
 * SvelteKit page load function to fetch articles from backend API.
 * Runs on the server (or client, for client-side navigation).
 * 
 * @param {object} context - The SvelteKit load context.
 * @param {function} context.fetch - The fetch function to make HTTP requests.
 * @returns {Promise<object>} - Returns an object with articles for the page.
 */
export async function load({url}) {
  const author_id = url.searchParams.get('author_id');
  const tag_id = url.searchParams.get('id');   // e.g. "123"
  const query = url.searchParams.get('q'); // e.g. "science"
  const query_matchtype = url.searchParams.get('match'); 

  return {author_id, tag_id, query, query_matchtype};
}
