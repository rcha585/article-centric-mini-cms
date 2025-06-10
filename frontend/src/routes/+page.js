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
          tags = tags.map( t =>  ({
            id: t.id,    
            content: t.content.replace(/^#/, "")
          }));
          // tags array is now ["tag"] instead of ["#tag"].
        }
      } catch (e) {
        tags = []; // fails just show nothing
      }

      // Create a excerpt and remove all HTML tags from `a.content`
      const strippedText = a.content.replace(/<[^>]+>/g, "");
      const excerpt = strippedText.length > 100
        ? strippedText.slice(0, 100) + "…"
        : strippedText;


      let avatarUrl = "/default-avatar.png";
      let authorName = a.username || "Unknown";
      let subsCount   = 0;

      try {
        const userRes = await fetch(`${PUBLIC_API_BASE_URL}/users/${a.author_id}`);
        if (userRes.ok) {
          const userJson = await userRes.json();
          authorName = `${userJson.first_name} ${userJson.last_name}`; // prefer full name
          if (userJson.avatar_id) {
            avatarUrl = `/avatars/avatar${userJson.avatar_id}.png`;
          }

          const sRes = await fetch(`${PUBLIC_API_BASE_URL}/subscriptions/${a.author_id}/subscriptions`);
          if (sRes.ok) {
            const subs = await sRes.json();
            subsCount = Array.isArray(subs) ? subs.length : (subs.count ?? 0);
          }
        }
      } catch {
      }

      const backendRoot = PUBLIC_API_BASE_URL.replace(/\/api$/, "");
      const coverUrl = a.image_path
        ? `${backendRoot}/${a.image_path}`
        : "/default-image.jpg";


      return {
        id: a.id,
        title: a.title,
        excerpt,
        coverUrl,
        createdAt: a.created_at,
        author: {
          name: a.username,
          avatarUrl}, 
        subsCount,
        tags,
      };
    })
  );

  return { articles };
}
