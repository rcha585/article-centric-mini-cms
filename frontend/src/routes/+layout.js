// Disable server-side rendering
export const ssr = false;

import { redirect, error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { unviewedCount } from "../lib/js/notifications.js"

export async function load({ fetch }) {

    const notiRes = await fetch(`${PUBLIC_API_BASE_URL}/notifications`, { credentials: 'include' });
    const myNotifications = await notiRes.json();

    const unviewedNoti = myNotifications.filter(n=>n.is_viewed === 0);
    unviewedCount.set(unviewedNoti.length);

    myNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {myNotifications}
}