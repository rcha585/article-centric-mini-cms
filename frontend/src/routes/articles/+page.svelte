<script>
  import { onMount } from "svelte";
  import { ARTICLES_URL } from "$lib/js/api-urls.js";
  //–– Component state ––//
  let articles = [];
  let search = ""; // current search text
  let exactMatch = false; // whether to match search exactly
  let sortBy = "date";

  let loading = true;
  let error = "";
  
  //–– Fetch articles from the server ––//
  async function fetchArticles() {
    loading = true;  
    try {
      // Build query string from our search / sort state
      const query = new URLSearchParams({
        search,
        exact: exactMatch,
        sort: sortBy
      });
      const res = await fetch(`${ARTICLES_URL}?${query}`);
      if (res.ok) {
        // On success, parse JSON into our array
        articles = await res.json();
      } else {
        error = "Failed to load articles.";
      }
    } catch (e) {
      // Show network / unexpected error
      error = "Network error.";
    }
    loading = false;
  }

  //–– Like / unlike a single article ––//
  function toggleLike(article) {
    fetch(`${ARTICLES_URL}/${article.id}/like`, {
      method: article.likedByUser ? "DELETE" : "POST",
      credentials: "include"
    }).then(() => fetchArticles());
  }

  // When component first appears, load articles
  onMount(fetchArticles);
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<h1>Articles</h1>

<!-- Controls for searching, exact match, and sorting -->
<div class="controls">
  <!-- Text input bound to `search` -->
  <input type="text" bind:value={search} placeholder="Search articles..." />
  <label>
    <!-- Checkbox bound to `exactMatch` -->
    <input type="checkbox" bind:checked={exactMatch} />
    Exact match
  </label>
  <!-- Dropdown bound to `sortBy` -->
  <select bind:value={sortBy}>
    <option value="title">Title</option>
    <option value="username">Author</option>
    <option value="date">Date</option>
  </select>
  <!-- Manually trigger a new fetch -->
  <button on:click={fetchArticles}>Search</button>
</div>

{#if loading}
  <!-- Show while we're waiting on the API -->
  <p>Loading...</p>
{:else if error}
  <!-- Show if something goes wrong -->
  <p class="error">{error}</p>
{:else if articles.length === 0}
  <!-- Show when API returns no results -->
  <p>No articles found.</p>
{:else}
  <!-- List of articles -->
  <ul class="article-list">
    {#each articles as article}
      <li>
        <!-- Article heading and metadata -->
        <h2>{article.title}</h2>
        <p>By {article.username} — {new Date(article.date).toLocaleDateString()}</p>
         <!-- Preview or first 200 chars of content -->
        <p>{@html article.preview || article.content.slice(0, 200)}...</p>
        <button on:click={() => toggleLike(article)}>
          {article.likedByUser ? "Unlike" : "Like"} ({article.likes})
        </button>
      </li>
    {/each}
  </ul>
{/if}

<!-- Example of card layout -->
{#each articles as article (article.id)}
  <div class="card">
    <!-- ...other card stuff... -->

    <!-- Tags Section -->
    <div class="tags-list">
      {#if article.tags && article.tags.length > 0}
        {#each article.tags as tag}
          <span class="tag">#{tag}</span>
        {/each}
      {:else}
        <span class="tag tag-empty">No tags</span>
      {/if}
    </div>

    <!-- ...created at, author, read more... -->
  </div>
{/each}

<style>
  /* Layout for the search/sort controls */
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  /* Reset list styles */
  .article-list {
    list-style: none;
    padding: 0;
  }

  /* Individual article list item */
  .article-list li {
    border-bottom: 1px solid #ccc;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }

  /* Error message styling */
  .error {
    color: red;
  }
  
  /* Tag styling */
  .tags-list {
    margin-bottom: 0.75rem;
  }
  .tag {
    display: inline-block;
    background: #f1f5f9;
    color: #2563eb;
    border-radius: 12px;
    font-size: 0.85rem;
    margin-right: 0.25rem;
    padding: 0.15rem 0.7rem;
  }
  .tag-empty {
    color: #64748b;
  }
</style>
