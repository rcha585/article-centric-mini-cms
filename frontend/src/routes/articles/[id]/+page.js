// const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// export async function load({ params, fetch }) {
//   const res = await fetch(`${BASE_URL}/articles/${params.id}`, {
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
//   if (!res.ok) throw new Error(await res.text());
//   const article = await res.json();
//   return { article };
// }
