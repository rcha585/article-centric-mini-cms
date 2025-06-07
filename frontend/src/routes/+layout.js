// Disable server-side rendering
export const ssr = false;

import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { unviewedCount, newNotificationIds } from "../lib/js/notifications.js";
// import { unviewedCount, newNotificationIds } from "../js/notifications.js";

export async function load({ fetch, url }) {
    const path = url.pathname;
    if (path.startsWith('/login') || path.startsWith('/register')) {
        unviewedCount.set(0);
        newNotificationIds.set([]);
        return { myNotifications: [] };
    }
    
    let myNotifications = [];

    // check whether the user is logged in or not. 
    try {
        const meRes = await fetch(`${PUBLIC_API_BASE_URL}/auth/me`, {
        credentials: 'include'
        });
        if (meRes.ok) {
            // if user can log in, the notifications will catch.
            const [notiResArticles, notiResComments] = await Promise.all([
                fetch(`${PUBLIC_API_BASE_URL}/notifications/articles`, {credentials: 'include'}),
                fetch(`${PUBLIC_API_BASE_URL}/notifications/comments`, {credentials: 'include'}),
            ]);

            if (notiResArticles.ok && notiResComments.ok) {
                // if we got notifications, we package it to json.
                const [myArticlesNotifications, myCommentsNotifications] = await Promise.all([
                    notiResArticles.json(),
                    notiResComments.json()
                ]);
                // refresh the viewed data.
                const unviewedArticlesNoti = myArticlesNotifications.filter(n => n.is_viewed === 0);
                const unviewedCommentsNoti = myCommentsNotifications.filter(n => n.is_viewed === 0);
                unviewedCount.set(unviewedArticlesNoti.length + unviewedCommentsNoti.length);
                
                // sort by date.
                // Flatten + merge + sort
                myNotifications = [...myArticlesNotifications, ...myCommentsNotifications];
                // const unviewed = [...unviewedArticlesNoti, ...unviewedCommentsNoti];
                // const ids = unviewed.map(n=>n.id);

                // newNotificationIds.set(ids); // Used to store notification_id

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
        return { myNotifications }
}
