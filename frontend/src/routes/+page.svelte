<script>
  export let data;
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores/currentUser.js';

  let { articles = [] } = data;
  $: user = $currentUser; // reactive user store

   // --- SORTING LOGIC ---
  let sortField  = 'date'; // default sort by date desc
  let sortDirection = 'desc'; // default direction: newest‐first for date

  function toggleSort(field) {
    if (sortField === field) {
      // same field clicked → just reverse direction
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // new field clicked → switch to that field, default ascending
      sortField = field;
      sortDirection = 'asc';
    }
    currentPage = 1; // whenever sorting changes, reset to page 1
  }

    $: sortedArticles = articles
    .slice() // copy the array so we don't mutate original
    .sort((a, b) => {
      // Helper: get values for comparison
      // For 'date', we compare Date objects
      // For 'title' or 'author', we compare strings
      if (sortField === 'date') {
        const da = new Date(a.createdAt);
        const db = new Date(b.createdAt);
        // if descending, put larger (newer) first
        return sortDirection === 'desc' ? db - da : da - db;
      }

      if (sortField === 'title') {
        // localeCompare returns <0 if a < b, >0 if a > b
        const cmp = (a.title || '').localeCompare(b.title || '');
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      if (sortField === 'author') {
        const cmp = (a.author.name || '').localeCompare(b.author.name || '');
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      return 0;
    });

  // Paging logic
  let currentPage = 1;
  const pageSize = 3;
  $: totalPages = Math.ceil(sortedArticles.length / pageSize);
  $: pagedArticles = sortedArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toDetail(e) {
    goto(`/articles/${e.detail.id}`);
  }
  function goToLogin() {
    goto("/login");
  }
  function goPage(p) {
    if (p > 0 && p <= totalPages) currentPage = p;
  }
</script>

<!-- Main visual hero section -->
<section class="hero">
  <img src="/main-page-image.jpg" alt="Main Visual" class="hero-bg" />
  <div class="hero-mask"></div>
  <div class="hero-content">
    <h1>Welcome to Blog Article</h1>
    <p>Discover insightful articles on technology, travel, and more. Curated by our passionate writers.</p>
    {#if !user}
      <button class="hero-login-btn" on:click={goToLogin}>Join Us</button>
    {/if}
  </div>
</section>

<!-- SORT BUTTONS -->
<div class="sort-row">
  <!-- Each button calls toggleSort('field') -->
  <!-- We add a small arrow ▲ or ▼ next to the active field to indicate direction -->
  <button
    class:active={sortField === 'date'}
    on:click={() => toggleSort('date')}
  >
    Sort by Time
    {#if sortField === 'date'}
      {sortDirection === 'asc' ? ' ▲' : ' ▼'}
    {/if}
  </button>

  <button
    class:active={sortField === 'title'}
    on:click={() => toggleSort('title')}
  >
    Sort by Title
    {#if sortField === 'title'}
      {sortDirection === 'asc' ? ' ▲' : ' ▼'}
    {/if}
  </button>

  <button
    class:active={sortField === 'author'}
    on:click={() => toggleSort('author')}
  >
    Sort by Author
    {#if sortField === 'author'}
      {sortDirection === 'asc' ? ' ▲' : ' ▼'}
    {/if}
  </button>
</div>

<!-- Article cards grid with paging -->
<div class="main-page">
  <div class="cards-wrapper">
  <div class="article-grid">
    {#each pagedArticles as a (a.id)}
      <ArticleCard article={a} on:readmore={toDetail} />
    {/each}
  </div>
  
  <!-- Paging controls -->
  <div class="pagination">
    <button on:click={() => goPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
    {#each Array(totalPages) as _, i}
      <button 
        class:active={currentPage === i+1} 
        on:click={() => goPage(i+1)}
      >{i+1}</button>
    {/each}
    <button on:click={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
  </div>
</div>
</div>
<style>
  /* Hero visual styles */
  .cards-wrapper {
    background: linear-gradient(90deg,rgba(61, 90, 128, 0.7) 30%,rgba(152, 193, 217, 0.7) 100%);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 24px;
    display: grid;
    width: 100%;
    gap: 32px;
    margin: 0 auto;
    max-width: 1220px;
    box-sizing: border-box;
    overflow-x: auto;
    grid-template-rows: auto auto;   
    position: relative;
    overflow: hidden; 
  }

  .cards-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    right: -50px;
    width: 300px;
    height: 100%;
    background: radial-gradient(circle at top left,rgba(255,255,255,0.2),transparent);
    transform: rotate(15deg);
    pointer-events: none;
  }

  .hero {
    position: relative;
    width: 100%;
    max-width: 1220px;
    height: 320px;
    overflow: hidden;
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    border-radius: 12px;
  }

  .hero-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: blur(6px) brightness(0.7);
    box-shadow: 0 0 30px rgba(255,255,255,0.6); 
    transition: filter 0.4s ease, box-shadow 0.4s ease;
    z-index: 1;
  }

  .hero:hover .hero-bg {
    filter: blur(3px) brightness(1.0);
    box-shadow: 0 0 50px rgba(255,255,255,0.8);
  }

  .hero-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #3d5a80bb 30%, #98c1d9bb 100%);
    z-index: 2;
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 3;
    text-align: center;
    max-width: 650px;
    margin: 0 auto;
    padding: 0 24px;
    color: #f0f9ff;
  }

  .hero-content h1 {
    font-size: 2.4rem;
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 0.5em;
    text-shadow:
      0 0 8px rgba(255,255,255,0.9),
      0 0 16px rgba(255,255,255,0.7),
      0 2px 16px rgba(0,0,0,0.4);
  }

  .hero-content p {
    font-size: 1.2rem;
    margin-bottom: 1em;
    text-shadow:
      0 0 6px rgba(255,255,255,0.6),
      0 1px 8px rgba(0,0,0,0.3);
  }

  .hero-login-btn {
    padding: 0.75em 2em;
    border: none;
    border-radius: 24px;
    background: rgba(255,255,255,0.85);
    color: #2b2b3c;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .hero-login-btn:hover {
    background: #fff;
    box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  }

  /* Sort controls */
  .sort-row {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    max-width: 1220px;
    margin: 24px auto;
  }

  .sort-row button {
    background: rgba(61,90,128,0.3);
    color: #2b2b3c;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    padding: 8px 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }

  .sort-row button:hover,
  .sort-row button.active {
    background: rgba(61,90,128,0.6);
    color: #fff;
  }

  /* Main content and grid */
  .main-page {
    width: 100%;
    max-width: 1220px;
    margin: 0 auto 48px;
    padding: 0;
    display: flex;
    justify-content: center; 
  }

  .article-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    grid-auto-columns: minmax(240px, 300px);
    grid-auto-flow: column;
    gap: 32px;
    margin-bottom: 32px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  /* Pagination */
  .pagination {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
  }

  .pagination button {
    padding: 0.5em 1em;
    border: none;
    background: rgba(61,90,128,0.3);
    color: #ffffffcc;
    font-weight: 600;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  .pagination button.active,
  .pagination button:hover:not([disabled]) {
    background: rgba(61,90,128,0.6);
    color: #fff;
  }

  @media (max-width: 600x) {
    .hero-content h1 { font-size: 2rem; }
    .hero-content p { font-size: 1rem; }
    .main-page { padding: 0 12px; }
    .article-grid { grid-template-columns: 1fr;}
  }

  @media (max-width: 700px) {
  .article-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 16px;
    overflow-x: visible;
  }
  .pagination {
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }
}
</style>
