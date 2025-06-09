// Disable server-side rendering
export const ssr = false;
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { fetchNotifications } from "../lib/js/notifications.js";
import { currentUser } from "$lib/stores/currentUser.js";
import { get } from "svelte/store";
export async function load({ fetch }) {

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

}
