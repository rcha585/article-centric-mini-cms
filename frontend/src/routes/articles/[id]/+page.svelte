<script>
  import { onMount } from 'svelte';
  // import { ARTICLES_URL } from '$lib/js/api-urls.js';

  let articles = [];
  let search = '';
  let exactMatch = false;
  let sortBy = 'date';

  let loading = true;
  let error = '';

  async function fetchArticles() {
    loading = true;
    try {
      const query = new URLSearchParams({
        search,
        exact: exactMatch,
        sort: sortBy
      });
      const res = await fetch(`${ARTICLES_URL}?${query}`);
      if (res.ok) {
        articles = await res.json();
      } else {
        error = 'Failed to load articles.';
      }
    } catch (e) {
      error = 'Network error.';
    }
    loading = false;
  }

  function toggleLike(article) {
    fetch(`${ARTICLES_URL}/${article.id}/like`, {
      method: article.likedByUser ? 'DELETE' : 'POST',
      credentials: 'include'
    }).then(() => fetchArticles());
  }

  onMount(fetchArticles);
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<h1>Articles</h1>

<div class="controls">
  <input type="text" bind:value={search} placeholder="Search articles..." />
  <label>
    <input type="checkbox" bind:checked={exactMatch} />
    Exact match
  </label>
  <select bind:value={sortBy}>
    <option value="title">Title</option>
    <option value="username">Author</option>
    <option value="date">Date</option>
  </select>
  <button on:click={fetchArticles}>Search</button>
</div>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if articles.length === 0}
  <p>No articles found.</p>
{:else}
  <ul class="article-list">
    {#each articles as article}
      <li>
        <h2>{article.title}</h2>
        <p>By {article.username} — {new Date(article.date).toLocaleDateString()}</p>
        <p>{@html article.preview || article.content.slice(0, 200)}...</p>
        <button on:click={() => toggleLike(article)}>
          {article.likedByUser ? "Unlike" : "Like"} ({article.likes})
        </button>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .article-list {
    list-style: none;
    padding: 0;
  }

  .article-list li {
    border-bottom: 1px solid #ccc;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }

  .error {
    color: red;
  }
</style>
