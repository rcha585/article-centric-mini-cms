import { PUBLIC_API_BASE_URL } from "$env/static/public";

export async function load({ fetch }) {
  const url = PUBLIC_API_BASE_URL ? `${PUBLIC_API_BASE_URL}/tags` : "/tags";

  const res = await fetch(url);

  console.log("check tags", res);

  if (!res.ok) throw new Error("Failed to fetch tags: ${res.status}");

  const tags = await res.json();
  return { tags };
}
