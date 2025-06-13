<script>
  import { PUBLIC_API_BASE_URL, PUBLIC_BASE_URL } from "$env/static/public";
  export let data;
  import { onMount } from 'svelte';

  const {
    author_id,
    tag_id,
    query,
    query_matchtype
  } = data;

  let articles = [];

  console.log("TAG ID", tag_id);
  
  async function returnSearchResults() {
    if (author_id) {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/users/${author_id}/articles`, { credentials: 'include' });
    const rawArticles = await res.json();
    articles = rawArticles.map(article => ({
      article_id: article.id,
      article_title: article.title,
      article_content: article.content,
      article_created_at: article.created_at,
      image_path: article.image_path,
      username: article.username,
      author_subscriber_count: article.author_subscriber_count
    }));
  }

    else if (tag_id) {
      const articlesRes = await fetch(`${PUBLIC_API_BASE_URL}/tags/${tag_id}/articles`, { credentials: 'include' });
      console.log(`${PUBLIC_API_BASE_URL}/tags/${tag_id}/articles`);

      articles = await articlesRes.json();
      
    } else if (query) {
      const articlesRes = await fetch(`${PUBLIC_API_BASE_URL}/articles/?key=${encodeURIComponent(query)}&match=${encodeURIComponent(query_matchtype)}`, { credentials: 'include' });

      const rawArticles = await articlesRes.json();
      articles = rawArticles.map(article => ({
        article_id: article.id,
        article_title: article.title,
        article_content: article.content,
        article_created_at: article.created_at,    
        image_path: article.image_path,
        username: article.username,
        author_subscriber_count: article.author_subscriber_count
      }));
    } 
  }

  onMount(() => {
    returnSearchResults(); // call the async function
  });

  $: if (articles.length) {
  console.log("Articles changed:", articles);
  }


  // remove tag/html entity and select first few words from the article content/comment to appear on the notification box
  function truncateChars(text, charLimit) {
    // Create a temporary div to decode HTML entities
    const temp = document.createElement('div');
    temp.innerHTML = text;
    const decodedText = temp.textContent || temp.innerText || '';

    // Remove extra spaces and trim
    const strippedText = decodedText.replace(/\s+/g, ' ').trim();

    return strippedText.length > charLimit
      ? strippedText.slice(0, charLimit) + '...'
      : strippedText;
  }

</script>

<div class="search-background">
  <div class="content-wrapper">
    <h2 class="all-articles-title">All Articles</h2>

    {#if articles.length === 0}
      <p class="no-results">
        No articles found{query ? ` for "${query}"` : ""}.<br/>
        Try adjusting your search or check back later.
      </p>
    {:else}
      <!-- ARTICLE LIST -->
      <ul class="article-list">

        {#each articles as article}
        <li class="article-card">
          <img
                class="thumbnail"
                src={`${PUBLIC_BASE_URL}/${article.image_path}`|| '/default-image.jpg'}
                alt={"Thumbnail for " + article.article_title}
                on:error={(e) => (e.target.src = '/default-image.jpg')}
              />

              <div class="info">
                <h3>
                  <a href={`/articles/${article.article_id}`} class="article-link">
                    {article.article_title}
                  </a>
                </h3>

                <p class="desc">
                  {truncateChars(article.article_content,150)}
                </p>

                <div class="meta">
                  By <span class="author">{article.username}</span>
                  {#if article.author_subscriber_count > 0}
                  , <span class="author">{article.author_subscriber_count}</span> subscribers 
                  {/if}
                  | Published @ <span class="author">{article.article_created_at}</span>
                </div>

              </div>
        </li>
        {/each}
      </ul>
    {/if}

  </div>
</div>

<style>
  /* ============================================ */
  /*  BACKGROUND + CONTENT WRAPPER (card style)    */
  /* ============================================ */
  .search-background {
    min-height: 100vh;
    /* Reuse your blue gradient background */
    /* background: linear-gradient(110deg, #214a80 0%, #ffffff 100%); */
    padding: 0;               /* we'll push the card down with margin */
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }

  .content-wrapper {
    /* Make it a frosted‐glass card */
    /* background: #214a80; */
    background: linear-gradient(110deg, #214a80 0%, #ffffff 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    /* Rounded corners, subtle drop‐shadow */
    border-radius: 32px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

    /* Center on the page */
    max-width: 840px;
    margin: 40px auto 80px auto;
    padding: 32px 48px;
  }

  /* ============================================ */
  /*  PAGE TITLE (“All Articles”) in LIGHT COLOR  */
  /* ============================================ */
  .all-articles-title {
    font-size: 2.4rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.5px;
    margin-bottom: 24px;
  }

  .no-results {
    color: #f0f0f5;
    font-size: 1.1rem;
    margin-top: 2rem;
  }

  /* ============================================ */
  /*   ARTICLE LIST & “FULL CARD” (transparent)   */
  /* ============================================ */
  .article-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .article-card {
    display: flex;
    align-items: flex-start;
    padding: 16px 0;
    /* Instead of a white border, use a semi‐transparent white line */
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    min-height: 96px;
    gap: 20px;
  }

  .article-card:last-child {
    border-bottom: none;
  }

  .thumbnail {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 12px;
    margin-top: 4px;
    /* If image is missing, fallback to a darker gray */
    background: #555;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .info {
    flex: 1;
  }

  .info h3 {
    margin: 0 0 4px 0;
    font-size: 1.35rem;
    font-weight: 600;
    color: #ffffff;
  }

  /* Style the link so it’s bright */
  .article-link {
    color: #2b2b3c;
    text-decoration: none;
    transition: color 0.2s;
  }

  .article-link:hover {
    color: #2563eb;
  }

  .desc {
    margin: 0 0 6px 0;
    color: #334155;
    font-size: 1rem;
    line-height: 1.4;
    max-width: 620px;
  }

  .meta {
    font-size: 0.95rem;
    color: #475569;
    margin-top: 2px;
  }

  .author {
    font-weight: 600;
  }

  @media (max-width: 600px) {
    .content-wrapper {
      padding: 24px 16px;
      border-radius: 24px;
      margin: 48px 16px 60px;
    }
    .article-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .thumbnail {
      width: 100%;
      max-width: 240px;
      height: auto;
      margin-bottom: 12px;
    }
    .info h3 {
      font-size: 1.4rem;
    }
    .desc {
      max-width: 100%;
    }
  }

</style>
