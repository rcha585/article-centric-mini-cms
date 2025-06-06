// Import the API base URL from SvelteKit's environment variables.
// This allows you to easily switch between dev/staging/production backends.
import { PUBLIC_API_BASE_URL } from "$env/static/public";

/**
 * SvelteKit load function to fetch all tags from the backend API.
 * Returns an object { tags } for use in your +page.svelte.
 *
 * @param {object} context - The SvelteKit load context.
 * @param {function} context.fetch - Fetch API provided by SvelteKit.
 * @returns {Promise<object>} Object containing the tags array.
 */
export async function load({ fetch }) {
  // Build the API endpoint URL.
  // Uses environment variable if set, otherwise defaults to "/tags" (for local dev/mock).
  const url = PUBLIC_API_BASE_URL ? `${PUBLIC_API_BASE_URL}/tags` : "/tags";

  // Fetch the tags from the API.
  const res = await fetch(url);

  // Log the response for debugging (remove or comment out in production).
  console.log("Tags fetch response:", res);

  // If the request failed, throw an error with details.
  if (!res.ok) {
    throw new Error(`Failed to fetch tags: ${res.status} ${res.statusText}`);
  }

  // Parse the JSON body as an array of tag objects.
  const tags = await res.json();

  // Return the tags for use in the Svelte page.
  return { tags };
}

