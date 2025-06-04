/**
 * SvelteKit page load function to fetch articles from backend API.
 * Runs on the server (or client, for client-side navigation).
 * 
 * @param {object} context - The SvelteKit load context.
 * @param {function} context.fetch - The fetch function to make HTTP requests.
 * @returns {Promise<object>} - Returns an object with articles for the page.
 */
export async function load({ fetch }) {
  // Attempt to fetch articles from the API endpoint.
  const res = await fetch("http://localhost:3000/api/articles");

  // If the response is not OK (status not 2xx), throw an error with details.
  if (!res.ok) {
    // Optional: include status and statusText for easier debugging.
    throw new Error(
      `Failed to load articles (status ${res.status}: ${res.statusText})`
    );
  }

  // Parse the response JSON body as an array of article objects.
  const articles = await res.json();

  // Return articles for use in the Svelte page.
  return { articles };
}
