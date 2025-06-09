import { writable } from 'svelte/store';

export const unviewedCount = writable(0);
export const newNotificationIds = writable([]);
export const myNotifications = writable([]);