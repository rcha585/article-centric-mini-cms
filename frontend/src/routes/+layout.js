// Disable server-side rendering
export const ssr = false;
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { fetchNotifications } from "../lib/stores/notifications.js";
import { currentUser } from "$lib/stores/currentUser.js";
import { get } from "svelte/store";
export async function load({ fetch, url }) {

let meData = null;
try {
    const meRes = await fetch(`${PUBLIC_API_BASE_URL}/auth/me`, {
        credentials: 'include'
    });
    if (meRes.ok) {
        // if user can log in, the data will catch.
        meData = await meRes.json();
    }
} catch {
    meData = null;
}

currentUser.set(meData);

// call fetchNotifications right after user finishes log in 
// so the number of unviewed Notification can appear above the notiication bell
const path = url.pathname;
console.log("start load", path); // must not delete this, to reload the page once user sign in
const user = get(currentUser);

  // Only fetch notifications if user is logged in
  if (!user) {
    return { myNotifications: [] };
  }

  try {
    const allNotifications = await fetchNotifications({ fetch });
    return { myNotifications: allNotifications };
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return { myNotifications: [] };
  }
}

