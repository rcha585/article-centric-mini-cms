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
  /*  BACKGROUND + CONTENT WRAPPER (unchanged)     */
  /* ============================================ */
  .search-background {
    min-height: 100vh;
    background: linear-gradient(110deg, #214a80 0%, #97a1b8 100%);
    padding-bottom: 48px;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }

  .content-wrapper {
    background: linear-gradient(90deg, #fff6 60%, #fff5 100%);
    margin: 0 auto;
    border-radius: 20px;
    width: 70vw;
    min-width: 340px;
    max-width: 820px;
    padding: 30px 36px;
    box-shadow: 0 4px 24px #0002;
  }

  .all-articles-title {
    font-size: 2rem;
    font-weight: 700;
    color: #214a80;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }

  .no-results {
    color: #223;
    font-size: 1.1em;
    margin-top: 1.5em;
  }

  /* ============================================ */
  /*  TAB BAR STYLES                              */
  /* ============================================ */
  .tab-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .tab-bar button {
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: #466bb8;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: border-bottom-color 0.2s, color 0.2s;
  }
  .tab-bar button:hover {
    color: #204488;
  }
  .tab-bar button.selected {
    color: #204488;
    border-bottom-color: #204488;
  }

  /* ============================================ */
  /*   ARTICLE LIST & “FULL CARD” (existing)       */
  /* ============================================ */
  .article-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .article-card {
    display: flex;
    align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid #dde1e9;
    min-height: 88px;
    gap: 22px;
  }
  .article-card:last-child {
    border-bottom: none;
  }

  .thumbnail {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 16px;
    margin-top: 3px;
    box-shadow: 0 2px 8px #0001;
    background: #ccc;
  }

  .info {
    flex: 1;
  }

  .info h3 {
    margin: 0 0 2px 0;
    font-size: 1.17rem;
    font-weight: 500;
    color: #122341;
  }

  .desc {
    margin: 0 0 4px 0;
    color: #33416d;
    font-size: 0.98rem;
    line-height: 1.4;
    max-width: 520px;
  }

  .meta {
    font-size: 0.93rem;
    color: #466bb8;
    margin-top: 2px;
  }

  .author {
    font-weight: 600;
  }

  /* ============================================ */
  /*   “INFO‐ONLY” STYLES FOR TITLE/CONTENT/AUTHOR */
  /* ============================================ */
  .info-only {
    /* When we’re not in “all,” we don’t show the thumbnail */
    flex: 1;
    margin-left: 0;
  }
  .info-only h3 {
    margin: 0;
    font-size: 1.17rem;
    font-weight: 500;
    color: #122341;
  }
  .info-only h3 a {
    text-decoration: none;
    color: #204488;
  }
  .info-only h3 a:hover {
    text-decoration: underline;
  }

  .desc-only {
    margin: 0;
    color: #33416d;
    font-size: 0.98rem;
    line-height: 1.4;
  }

  .author-only {
    margin: 0;
    color: #466bb8;
    font-size: 0.98rem;
    font-weight: 600;
  }

  /* Hide the <img> whenever selectedTab !== "all" */
  /* We can accomplish this by “inlining” a style on the <img> itself inside the template, */
  /* but if you prefer pure CSS, you could also do something like: */
  /* li.article-card img[hidden] { display: none; } */
  /* We already only render <img> in the “all” branch, so no extra CSS is strictly needed. */

  /* ============================================ */
  /*  PAGINATION (unchanged)                       */
  /* ============================================ */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 22px;
    color: #214a80;
    font-size: 1.13rem;
  }
  .pagination-info {
    flex: 1;
    font-weight: 500;
  }
  .page-button {
    background: #e5eaff;
    color: #204488;
    border: none;
    padding: 0.3em 0.9em;
    border-radius: 999px;
    font-size: 1.1em;
    cursor: pointer;
    box-shadow: 0 1px 4px #0002;
    transition: background 0.17s;
  }
  .page-button:disabled {
    background: #bcc9dd;
    color: #6675a6;
    cursor: not-allowed;
  }
</style>
