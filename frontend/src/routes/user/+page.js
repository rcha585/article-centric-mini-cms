export const ssr = false; // Disable server-side rendering
import { redirect, error } from "@sveltejs/kit";
import { PUBLIC_API_BASE_URL } from "$env/static/public";

function htmlToText(html) {
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || '';
  } else {
    return (html || '').replace(/<[^>]+>/g, "");
  }
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  /* ---------- User login ---------- */
  const meRes = await fetch(`${PUBLIC_API_BASE_URL}/auth/me`, {
    credentials: "include"
  });

  if (meRes.status === 401) throw redirect(302, "/login");
  if (!meRes.ok) throw error(meRes.status, await meRes.text());
  const rawUser = await meRes.json();

  // My articles and all articles
  const [myArtsRes, allArtsRes] = await Promise.all([
    fetch(`${PUBLIC_API_BASE_URL}/users/${rawUser.id}/articles`, {
      credentials: "include"
    }),
    fetch(`${PUBLIC_API_BASE_URL}/articles`)
  ]);
  if (!allArtsRes.ok) throw error(allArtsRes.status, "cannot find the article");

  const myArticlesRaw = myArtsRes.ok ? await myArtsRes.json() : [];
  const allArticlesRaw = await allArtsRes.json();

	/* ---------- subscribers ---------- */
	const subsRes = await fetch(
    `${PUBLIC_API_BASE_URL}/users/${rawUser.id}/subscriptions`,
    { credentials: "include" }
  );

  let subscriberCount = 0;
  	if (subsRes.ok && subsRes.status !== 204) {
    	const subs = await subsRes.json();
    	subscriberCount = Array.isArray(subs) ? subs.length : (subs.count ?? 0);
  	}

  const followingRes = await fetch(
    `${PUBLIC_API_BASE_URL}/subscriptions/${rawUser.id}/following`,
    { credentials: "include" }
  );

  let followingUsers = [];
  if (followingRes.ok && followingRes.status !== 204) {
    const subs = await followingRes.json();

    followingUsers = subs.map(u => ({
        id:       u.id,
        username: u.username,
        intro:    u.description ?? "",
        avatarUrl: `/avatars/avatar${u.avatar_id || 1}.png`,
        subscribers: u.subscribers
      }));
    followingUsers = followingUsers.filter(Boolean);
  }

  	
  // modify article list
  const mapArticle = (a) => {
    const plainText = htmlToText(a.content);
    return{
      id: a.id,
      title: a.title,
      excerpt:
        plainText.length > 160
        ? plainText.slice(0, 160) + "..."
        : plainText,
      createdAt: a.created_at,
      coverUrl: a.image_path
        ? (a.image_path.startsWith('/') ? a.image_path : `/${a.image_path}`)
        : '/placeholder-cover.png',
      likes: 0,
      tags: []
    }
  };


  const articleById = new Map();
  for (const raw of allArticlesRaw) {
    const obj = mapArticle(raw);
    articleById.set(obj.id, obj);
  }
  const allArticles = Array.from(articleById.values());
  const myArticles = myArticlesRaw.map((raw) => articleById.get(raw.id)).filter(Boolean);

  // If rawUser.avatar_id is null/0, use your fallback avatar “avatar-1.png”.
  let avatarFilename;
  if (rawUser.avatar_id) {
    // e.g. if avatar_id === 3, we want “avatar3.png”
    avatarFilename = `avatar${rawUser.avatar_id}.png`;
  } else {
    // fallback if no avatar_id in DB
    avatarFilename = `avatar-1.png`;
  }

  //  likes and comments
  const likedArticles = [];

  await Promise.all(
    allArticles.map(async (art) => {
      // get likes
      const likesRes = await fetch(`${PUBLIC_API_BASE_URL}/articles/${art.id}/likes`, { credentials: "include" });
      const likes = likesRes.ok && likesRes.status !== 204 ? await likesRes.json() : [];
      art.likes = likes.length;
      if (likes.some((l) => l.username === rawUser.username)) {
        likedArticles.push(art);
      }

      // get tags
      try {
        const tagRes = await fetch(`${PUBLIC_API_BASE_URL}/articles/${art.id}/tags`);
        if (tagRes.ok) {
          const tagJson = await tagRes.json(); 
          art.tags = tagJson.map(t =>  ({
            id: t.id,
            content: t.content.replace(/^#/, "")
           }));
        }
      } catch (err) {
        art.tags = [];
      }
    })
  );

  // +page.js
  const res = await fetch(`${PUBLIC_API_BASE_URL}/comments/user/${rawUser.id}`, {
    credentials: 'include'
  });
  const list = res.ok ? await res.json() : [];
  const myComments = list.map(c => ({
    id:          c.comment_id,
    content:     c.comment_content,
    createdAt:   c.comment_created_at,
    articleId:   c.article_id,
    articleTitle:c.article_title
  }));

  

  const user = {
    id: rawUser.id,
    username: rawUser.username,
    firstName: rawUser.first_name,
    lastName: rawUser.last_name,
    introduction: rawUser.description ?? '',
    avatar: `http://localhost:5173/avatars/${avatarFilename}`,
    avatar_id: rawUser.avatar_id,
    likedPosts: likedArticles.length,
    subscribers: subscriberCount,
    date_of_birth: rawUser.date_of_birth
  }


	return { user, myArticles, likedArticles, myComments, followingUsers };
}
