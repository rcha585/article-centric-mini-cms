import { PUBLIC_API_BASE_URL } from "$env/static/public";

export async function load({ fetch }) {
  // get all articles
  const res = await fetch(`${PUBLIC_API_BASE_URL}/articles`);
  const articlesRaw = await res.json();

  // search tags for all articles
  const articles = await Promise.all(
    articlesRaw.map(async (a) => {
      // find tags
      let tags = [];
      try {
        const tagRes = await fetch(`${PUBLIC_API_BASE_URL}/articles/${a.id}/tags`);
        if (tagRes.ok) {
          tags = await tagRes.json();
        }
      } catch (e) {
        tags = []; // fails just show nothing
      }

      return {
        id: a.id,
        title: a.title,
        excerpt: a.content.slice(0, 100),
        coverUrl: a.image_path,
        createdAt: a.created_at,
        author: {
          name: a.username,
          avatarUrl: "/default-avatar.png"
        },
        // tags array, direct to ArticleCard component
        tags: tags.length > 0 ? tags.map(t => t.content) : [],
      };
    })
  );

  return { articles };
}
