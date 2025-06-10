// Disable server-side rendering
export const ssr = false;
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { fetchNotifications } from "../lib/js/notifications.js";
import { currentUser } from "$lib/stores/currentUser.js";
import { get } from "svelte/store";
export async function load({ fetch, url }) {

console.log("start load", url.pathname); // must not delete this, to reload the page once user sign in

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
// const path = url.pathname; // hỏi Đức
//   if (path.startsWith('/login')) {
//     return { myNotifications: [] };
//   }
  const allNotifications = await fetchNotifications({fetch});
  return { myNotifications: allNotifications };
}

