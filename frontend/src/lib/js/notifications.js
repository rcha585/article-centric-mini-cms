import { writable } from 'svelte/store';
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { get } from 'svelte/store';
export const unviewedCount = writable(0);
export const newNotificationIds = writable([]);
export const myNotifications = writable([]);

export async function fetchNotifications({ fetch }) {
    try {
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
                
                // store all Notifications for later use for component file: Header.svelte
                myNotifications.set([...myArticlesNotifications, ...myCommentsNotifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
                
                // store all Notifications for later use for component file: Header.svelte
                const unviewedArticlesNoti = myArticlesNotifications.filter(n => n.is_viewed === 0);
                const unviewedCommentsNoti = myCommentsNotifications.filter(n => n.is_viewed === 0);
                const unviewed = [...unviewedArticlesNoti, ...unviewedCommentsNoti];
                unviewedCount.set(unviewed.length);
                console.log("unviewedCount1:",get(unviewedCount));
                
            }
            else {
                // else no notifications
                myNotifications.set([]);
                unviewedCount.set(0);
        }
    } catch (e) {
    // if it is a login error, don't notify.     
        myNotifications.set([]);
        unviewedCount.set(0);
    }

} 