<script>
  export let data; // contains: articles, totalCount, page, perPage, search

  // You'd receive these from your load function
  const { articles = [], totalCount = 0, page = 1, perPage = 6, search = "" } = data;

  // Pagination helpers
  const totalPages = Math.ceil(totalCount / perPage);
  function goToPage(p) {
    // Use SvelteKit's navigation, or window.location for SPA
    window.location.href = `/search?query=${encodeURIComponent(search)}&page=${p}`;
  }
</script>

<!-- GRADIENT BACKGROUND & WRAPPER -->
<div class="search-background">
  <!-- MAIN CONTENT WRAPPER -->
  <div class="content-wrapper">
    <h2 class="all-articles-title">All Articles</h2>

    <ul class="article-list">
      {#each articles as article (article.id)}
        <li class="article-card">
          <img class="thumbnail" src={article.image_path} alt={article.title} />
          <div class="info">
            <h3>
              <a href={`/articles/${article.id}`} class="article-link">
                {article.title}
              </a>
            </h3>
            <p class="desc">
              {article.content.slice(0, 110)}{article.content.length > 110 ? "..." : ""}
            </p>
            <div class="meta">
              By <span class="author">{article.username}</span>
            </div>
          </div>
        </li>
      {/each}
    </ul>

    <!-- PAGINATION -->
    <div class="pagination">
      <span
        >{(page - 1) * perPage + 1} - {Math.min(page * perPage, totalCount)} of {totalCount} results</span
      >
      <button disabled={page === 1} on:click={() => goToPage(page - 1)}>&lt;</button>
      <button disabled={page === totalPages} on:click={() => goToPage(page + 1)}>&gt;</button>
    </div>
  </div>
</div>

<style>
  /* GRADIENT BACKGROUND */
  .search-background {
    min-height: 100vh;
    background: linear-gradient(110deg, #214a80 0%, #97a1b8 100%);
    padding-bottom: 48px;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }

  /* SEARCH BAR */
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    margin-bottom: 18px;
  }
  .search-bar input {
    width: 420px;
    max-width: 80vw;
    border-radius: 22px;
    border: none;
    font-size: 1.4rem;
    padding: 0.6em 2em 0.6em 2.2em;
    background: #e6eef7;
    outline: none;
    box-shadow: 0 2px 16px #0001;
  }

  /* MAIN CONTENT */
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

  /* ARTICLE LIST */
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

  /* PAGINATION */
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
