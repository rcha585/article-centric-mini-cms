// // src/routes/search/+page.js
// export async function load({ fetch, url }) {
//   // Get search and pagination params from the URL
//   const search = url.searchParams.get('query') || '';
//   const page = Number(url.searchParams.get('page') || 1);
//   const perPage = 6;

//   // You only need to fetch once!
//   const res = await fetch(
//     `/api/articles?query=${encodeURIComponent(search)}&page=${page}&perPage=${perPage}`
//   );
//   if (!res.ok) throw new Error('Failed to load articles');
//   const { articles, totalCount } = await res.json();

//   return { articles, totalCount, page, perPage, search };
// }

// src/routes/search/+page.js
export async function load({ fetch }) {
  const res = await fetch('http://localhost:3000/api/articles');
  if (!res.ok) throw new Error('Failed to load articles');
  const articles = await res.json();
  return { articles };
}
