// Disable server-side rendering
export const ssr = false;

import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { unviewedCount } from "../lib/js/notifications.js"

export async function load({ fetch }) {
    
    let myNotifications = [];

    // check whether the user is logged in or not. 
    try {
        const meRes = await fetch(`${PUBLIC_API_BASE_URL}/auth/me`, {
        credentials: 'include'
        });
        if (meRes.ok) {
            // if user can log in, the notifications will catch.
            const notiRes = await fetch(`${PUBLIC_API_BASE_URL}/notifications`, {
                credentials: 'include'});
            if (notiRes.ok) {
                // if we got notifications, we package it to json.
                myNotifications = await notiRes.json();
                // refresh the viewed data.
                const unviewedNoti = myNotifications.filter(n => n.is_viewed === 0);
                unviewedCount.set(unviewedNoti.length);
                // sort by date.
                myNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            else {
                // else no notifications
                myNotifications = [];
                unviewedCount.set(0);
            }
        } else {
        // if cannot log in, also treat as no notification
            myNotifications = [];
            unviewedCount.set(0);
        }
    } catch (e) {
    // if it is a login error, don't notify.      
        myNotifications = [];
        unviewedCount.set(0);
    }
        return {myNotifications}
}