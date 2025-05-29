import { PUBLIC_API_BASE_URL } from "$env/static/public";

export const BASE_URL = PUBLIC_API_BASE_URL;

// Used for getting / updating info about the currently authenticated user
export const USER_URL = `${BASE_URL}/users/me`;

// Used for logging in and out
export const AUTH_URL = `${BASE_URL}/auth`;
