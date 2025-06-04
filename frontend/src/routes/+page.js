import { PUBLIC_API_BASE_URL } from "$env/static/public";

export async function load({ fetch }) {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/articles`);
  const articlesRaw = await res.json();

  console.log("articlesRaw fetch:", articlesRaw);

  // do not have taggings data, modify in future.
  // add a dummy tag to test first.

  const articles = articlesRaw.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.content.slice(0, 100),
    coverUrl: a.image_path,
    createdAt: a.created_at,
    author: {
      name: a.username,
      avatarUrl: "/default-avatar.png"
    },
    tags: a.tags ?? ["tags"]
  }));

  return { articles };
}
