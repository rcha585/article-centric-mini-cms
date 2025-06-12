import { writable } from "svelte/store";    
// Create a writable store to hold the current user object (or null if not logged in)
export const currentUser = writable(null);