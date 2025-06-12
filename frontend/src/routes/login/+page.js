import { goto } from "$app/navigation";
import { browser } from "$app/environment";

export async function load({ parent }) {
  // If we're rendering on the server, bail out early
  if (!browser) return;
  // Call the parent load function to get shared data

  // If the user is already logged in, redirect them to the home page
  // `replaceState: true` prevents adding a new history entry
  const { isLoggedIn } = await parent();
  if (isLoggedIn) goto("/", { replaceState: true });
}
