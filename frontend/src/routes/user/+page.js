import { redirect, error } from "@sveltejs/kit";
import { PUBLIC_API_BASE_URL } from "$env/static/public";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  /* ---------- User login ---------- */
  const meRes = await fetch(`${PUBLIC_API_BASE_URL}/auth/me`, { credentials: "include" });

  if (meRes.status === 401) throw redirect(302, "/login");
  if (!meRes.ok) throw error(meRes.status, await meRes.text());

  const rawUser = await meRes.json();

  /* ---------- My articles and all articles ---------- */
  const [myArtsRes, allArtsRes] = await Promise.all([
    fetch(`${PUBLIC_API_BASE_URL}/users/${rawUser.id}/articles`, { credentials: "include" }),
    fetch(`${PUBLIC_API_BASE_URL}/articles`)
  ]);

  if (!allArtsRes.ok) throw error(allArtsRes.status, "cannot find the article");

  const myArticlesRaw = myArtsRes.ok ? await myArtsRes.json() : [];
  const allArticlesRaw = await allArtsRes.json();

	/* ---------- subscribers ---------- */
	const subsRes = await fetch(
   		`${PUBLIC_API_BASE_URL}/users/${rawUser.id}/subscriptions`,
   		{ credentials: 'include' }
 	);
  	let subscriberCount = 0;
  	if (subsRes.ok && subsRes.status !== 204) {
    	const subs = await subsRes.json();
    	subscriberCount = Array.isArray(subs) ? subs.length : (subs.count ?? 0);
  	}

  const mapArticle = (a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.content.length > 120 ? a.content.slice(0, 117) + "..." : a.content,
    createdAt: a.created_at,
    coverUrl: a.image_path
      ? a.image_path.startsWith("/")
        ? a.image_path
        : `/${a.image_path}`
      : "/placeholder-cover.png",
    likes: 0,
    favorites: 0,
    tags: []
  });

  const articleById = new Map();

  for (const raw of allArticlesRaw) {
    const obj = mapArticle(raw);
    articleById.set(obj.id, obj);
  }
  const allArticles = Array.from(articleById.values());

  const myArticles = myArticlesRaw.map((raw) => articleById.get(raw.id)).filter(Boolean);

  /* ----------  likes and comments ---------- */
  const likedArticles = [];
  const myComments = [];

  await Promise.all(
    allArticles.map(async (art) => {
      const [likesRes, commRes] = await Promise.all([
        fetch(`${PUBLIC_API_BASE_URL}/articles/${art.id}/likes`, {
          credentials: "include"
        }),
        fetch(`${PUBLIC_API_BASE_URL}/articles/${art.id}/comments`)
      ]);

      /* ---- likes ---- */
      const likes = likesRes.ok && likesRes.status !== 204 ? await likesRes.json() : [];
      art.likes = likes.length;
      if (likes.some((l) => l.username === rawUser.username)) {
        likedArticles.push(art);
      }

      /* ---- comments ---- */
      const comments = commRes.ok && commRes.status !== 204 ? await commRes.json() : [];
      art.comments = comments.length;
      comments
        .filter((c) => c.username === rawUser.username)
        .forEach((c) => myComments.push({ ...c, articleTitle: art.title }));
    })
  );

  console.log("== user ==", rawUser);
  console.log("== myArticles ==", myArticlesRaw);
  console.log("== allArticles ==", allArticlesRaw);
  console.log("== subscriberCount ==", subscriberCount);
  console.log("== likedArticles ==", likedArticles);
  console.log("== myComments ==", myComments);

  const user = {
    id: rawUser.id,
    username: rawUser.username,
    avatar: `/api/avatars/${rawUser.avatar_id}.png`,
    introduction: rawUser.description ?? "",
    likedPosts: likedArticles.length,
    subscribers: subscriberCount
  };

    	/* ---- comments ---- */
    	const comments =
      		commRes.ok && commRes.status !== 204 ? await commRes.json() : [];
    	art.comments = comments.length;
    	comments.filter((c) => c.username === rawUser.username).forEach((c) =>
     		myComments.push({ ...c, articleTitle: art.title })
      	);
  		};

	console.log('== user ==', rawUser);
	console.log('== myArticles ==', myArticlesRaw);
	console.log('== allArticles ==', allArticlesRaw);
	console.log('== subscriberCount ==', subscriberCount);
	console.log('== likedArticles ==', likedArticles);
	console.log('== myComments ==', myComments);

	const user = {
		id: rawUser.id,
		username: rawUser.username,
		firstName: rawUser.first_name,
		lastName: rawUser.last_name,
		avatar: `/api/avatars/${rawUser.avatar_id}.png`,
		introduction: rawUser.description ?? '',
		likedPosts: likedArticles.length,
		subscribers: subscriberCount 
	};

	return { user, myArticles, likedArticles, myComments };

