<script>
  export let data;

  const {
    articles = [],
    totalCount = 0,
    page = 1,
    perPage = 6,
    search = ""
  } = data;

  const totalPages = Math.ceil(totalCount / perPage);

  // Track which tab is active.
  let selectedTab = "all";

  function goToPage(p) {
    window.location.href = `/search?query=${encodeURIComponent(search)}&page=${p}`;
  }
</script>

<div class="search-background">
  <div class="content-wrapper">
    <h2 class="all-articles-title">All Articles</h2>

    {#if articles.length === 0}
      <p class="no-results">
        No articles found{search ? ` for "${search}"` : ""}.<br/>
        Try adjusting your search or check back later.
      </p>
    {:else}

      <!-- TAB BAR -->
      <div class="tab-bar">
        <button
          class:selected={selectedTab === "all"}
          on:click={() => (selectedTab = "all")}
        >
          All
        </button>
        <button
          class:selected={selectedTab === "title"}
          on:click={() => (selectedTab = "title")}
        >
          Title
        </button>
        <button
          class:selected={selectedTab === "content"}
          on:click={() => (selectedTab = "content")}
        >
          Content
        </button>
        <button
          class:selected={selectedTab === "author"}
          on:click={() => (selectedTab = "author")}
        >
          Author
        </button>
      </div>

      <!-- ARTICLE LIST -->
      <ul class="article-list">
        {#each articles as article (article.id)}
          <li class="article-card">
            {#if selectedTab === "all"}
              <!-- FULL CARD: Thumbnail + Title + Snippet + Author -->
              <img
                class="thumbnail"
                src={article.image_path}
                alt={"Thumbnail for " + article.title}
                on:error="{(e) => (e.target.style.background = '#e0e0e0')}"
              />

              <div class="info">
                <h3>
                  <a href={`/articles/${article.id}`} class="article-link">
                    {article.title}
                  </a>
                </h3>
                <p class="desc">
                  {article.content.slice(0, 110)}
                  {article.content.length > 110 ? "..." : ""}
                </p>
                <div class="meta">
                  By <span class="author">{article.username}</span>
                </div>
              </div>

            {:else if selectedTab === "title"}
              <!-- TITLE ONLY (no image, no snippet, no author) -->
              <div class="info-only">
                <h3>
                  <a href={`/articles/${article.id}`} class="article-link">
                    {article.title}
                  </a>
                </h3>
              </div>

            {:else if selectedTab === "content"}
              <!-- CONTENT ONLY (no image, no title link, no author) -->
              <div class="info-only">
                <p class="desc-only">{article.content}</p>
              </div>

            {:else if selectedTab === "author"}
              <!-- AUTHOR ONLY (no image, no title, no snippet) -->
              <div class="info-only">
                <p class="author-only">{article.username}</p>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}

    <!-- PAGINATION (unchanged) -->
    {#if totalPages > 1}
      <div class="pagination">
        <span class="pagination-info">
          Showing {(page - 1) * perPage + 1} – 
          {Math.min(page * perPage, totalCount)} of {totalCount} results
        </span>
        <button
          class="page-button"
          disabled={page === 1}
          on:click={() => goToPage(page - 1)}
          title="Previous Page"
        >
          &lt;
        </button>
        <button
          class="page-button"
          disabled={page === totalPages}
          on:click={() => goToPage(page + 1)}
          title="Next Page"
        >
          &gt;
        </button>
      </div>
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
  /*  TAB BAR (white text, underline on selected) */
  /* ============================================ */
  .tab-bar {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 24px;
  }
  .tab-bar button {
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: border-bottom-color 0.2s, color 0.2s;
  }
  .tab-bar button:hover {
    color: #ffffff;
  }
  .tab-bar button.selected {
    color: #ffffff;
    border-bottom-color: #ffffff;
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
    text-decoration: none;
    color: #ffffff;
    transition: color 0.2s;
  }
  .article-link:hover {
    color: #ffeb3b; /* e.g. a bright accent on hover */
  }

  .desc {
    margin: 0 0 6px 0;
    color: #f0f0f5;
    font-size: 1rem;
    line-height: 1.4;
    max-width: 620px;
  }

  .meta {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 2px;
  }

  .author {
    font-weight: 600;
  }

  /* ============================================ */
  /*   “INFO‐ONLY” STYLES FOR TITLE/CONTENT/AUTHOR */
  /* ============================================ */
  .info-only {
    flex: 1;
    margin-left: 0;
  }
  .info-only h3 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 600;
    color: #ffffff;
  }
  .info-only h3 a {
    text-decoration: none;
    color: #ffffff;
  }
  .info-only h3 a:hover {
    text-decoration: underline;
    color: #ffeb3b;
  }

  .desc-only {
    margin: 0;
    color: #f0f0f5;
    font-size: 1rem;
    line-height: 1.5;
  }

  .author-only {
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
    font-weight: 600;
  }

  /* ============================================ */
  /*  PAGINATION (light on dark card)             */
  /* ============================================ */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 32px;
    color: #ffffff;
    font-size: 1.13rem;
  }
  .pagination-info {
    flex: 1;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
  .page-button {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    border: none;
    padding: 0.4em 1em;
    border-radius: 999px;
    font-size: 1.1em;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: background 0.2s;
  }
  .page-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
  }
  .page-button:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }

  
</style>
