<script>
  // Receive data prop from parent or +page.js load function.
  // Data shape: { articles, totalCount, page, perPage, search }
  export let data;

  // Destructure with default values to avoid runtime errors if any field is missing.
  const {
    articles = [],        // List of article objects to display
    totalCount = 0,       // Total number of articles matching the query
    page = 1,             // Current page number (1-based)
    perPage = 6,          // How many articles per page
    search = ""           // Current search query (string)
  } = data;

  // Calculate the total number of pages needed for pagination.
  const totalPages = Math.ceil(totalCount / perPage);

  /**
   * Navigate to a specific page number while retaining the current search query.
   * Uses window.location for a full reload; in SvelteKit, you could use goto from $app/navigation for SPA navigation.
   * @param {number} p - The page number to go to.
   */
  function goToPage(p) {
    // Encode the search query for safe URL usage
    window.location.href = `/search?query=${encodeURIComponent(search)}&page=${p}`;
  }
</script>

<!-- =================== PAGE LAYOUT =================== -->

<!-- GRADIENT BACKGROUND & WRAPPER -->
<div class="search-background">
  <!-- Content container to center and style the articles list -->
  <div class="content-wrapper">
    <h2 class="all-articles-title">All Articles</h2>

    <!-- If no articles, show friendly message -->
    {#if articles.length === 0}
      <p style="color: #223; font-size: 1.1em; margin-top: 1.5em;">
        No articles found{search ? ` for "${search}"` : ""}. Try adjusting your search or check back later.
      </p>
    {:else}
      <ul class="article-list">
        {#each articles as article (article.id)}
          <li class="article-card">
            <!-- Article thumbnail image, fallback background if missing -->
            <img
              class="thumbnail"
              src={article.image_path}
              alt={"Thumbnail for " + article.title}
              on:error="{(e) => e.target.style.background='#e0e0e0'}"
            />

            <div class="info">
              <!-- Article title, links to full article page -->
              <h3>
                <a href={`/articles/${article.id}`} class="article-link">
                  {article.title}
                </a>
              </h3>
              <!-- Article preview: show only the first 110 chars -->
              <p class="desc">
                {article.content.slice(0, 110)}{article.content.length > 110 ? "..." : ""}
              </p>
              <!-- Author info (you can link author page if needed) -->
              <div class="meta">
                By <span class="author">{article.username}</span>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}

    <!-- PAGINATION CONTROLS: Show only if there are more than one page -->
    {#if totalPages > 1}
      <div class="pagination">
        <span>
          Showing {(page - 1) * perPage + 1}
          –
          {Math.min(page * perPage, totalCount)}
          of {totalCount} results
        </span>
        <!-- Previous page button -->
        <button disabled={page === 1} on:click={() => goToPage(page - 1)} title="Previous Page">&lt;</button>
        <!-- Next page button -->
        <button disabled={page === totalPages} on:click={() => goToPage(page + 1)} title="Next Page">&gt;</button>
      </div>
    {/if}
  </div>
</div>

<style>
  /* GRADIENT BACKGROUND: Full-page soft blue gradient */
  .search-background {
    min-height: 100vh;
    background: linear-gradient(110deg, #214a80 0%, #97a1b8 100%);
    padding-bottom: 48px;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }

  /* MAIN CONTENT AREA: Light glassmorphism box with rounded corners */
  .content-wrapper {
    background: linear-gradient(90deg, #fff6 60%, #fff5 100%);
    margin: 0 auto;
    border-radius: 20px;
    width: 70vw;
    min-width: 340px;
    max-width: 820px;
    padding: 30px 36px 30px 36px;
    box-shadow: 0 4px 24px #0002;
  }

  .all-articles-title {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1.2px;
    margin-bottom: 16px;
  }

  /* ARTICLE LISTING */
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

  /* PAGINATION BUTTONS */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 22px;
    color: #fff;
    font-size: 1.13rem;
  }
  .pagination button {
    background: #e5eaff;
    color: #204488;
    border: none;
    padding: 0.15em 0.9em;
    border-radius: 999px;
    font-size: 1.1em;
    margin: 0 2px;
    cursor: pointer;
    box-shadow: 0 1px 4px #0002;
    transition: background 0.17s;
  }
  .pagination button:disabled {
    background: #bcc9dd;
    color: #6675a6;
    cursor: not-allowed;
  }
</style>
