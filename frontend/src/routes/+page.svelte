<script>
  export let data;
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import { goto } from '$app/navigation';

  let { articles = [] } = data;

   // --- SORTING LOGIC ---
  let sortType = 'date'; // default sort by date desc

  function setSort(type) {
    sortType = type;
    currentPage = 1;
  }

  $: sortedArticles = articles.slice().sort((a, b) => {
    if (sortType === 'date') {
      return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
    }
    if (sortType === 'title') {
      return (a.title || '').localeCompare(b.title || '');
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
    goto('/login');
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
    <button class="hero-login-btn" on:click={goToLogin}>Join Us</button>
  </div>
</section>

<!-- SORT BUTTONS -->
<div class="sort-row">
  <button class:active={sortType === 'date'} on:click={() => setSort('date')}>Sort by Time</button>
  <button class:active={sortType === 'title'} on:click={() => setSort('title')}>Sort by Title</button>
</div>

<!-- Article cards grid with paging -->
<div class="main-page">
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

<style>
/* Hero visual styles */
.hero {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}
.hero-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.6) blur(2px);
  z-index: 1;
}
.hero-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #2563eb99 0%, #64748b99 100%);
  z-index: 2;
  pointer-events: none;
  opacity: 0.84;
}
.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: #fff;
  max-width: 650px;
  margin: 0 auto;
  padding: 0 24px;
}
.hero-content h1 {
  font-size: 2.4rem;
  font-weight: bold;
  letter-spacing: 1.2px;
  margin-bottom: 0.4em;
  text-shadow: 0 2px 16px #33415566;
}
.hero-content p {
  font-size: 1.18rem;
  font-weight: 400;
  margin-bottom: 1.2em;
  opacity: 0.93;
  text-shadow: 0 1px 8px #33415533;
}
.hero-login-btn {
  padding: 0.75em 2.3em;
  border: none;
  border-radius: 24px;
  background: #f5f8fa;
  color: #2563eb;
  font-size: 1.07rem;
  font-weight: 600;
  box-shadow: 0 2px 12px #1e293b21;
  cursor: pointer;
  transition: background-color 0.2s;
}
.hero-login-btn:hover {
  background: #e0edfa;
}


.sort-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 0 14px 0;
  max-width: 1220px;
  margin: 0 auto;
}
.sort-row button {
  background: #f3f8fd;
  color: #2563eb;
  font-weight: 600;
  border: none;
  border-radius: 7px;
  padding: 7px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.16s;
  box-shadow: 0 1px 6px #93c5fd22;
  outline: none;
}
.sort-row button.active,
.sort-row button:hover {
  background: #2563eb;
  color: #fff;
}

/* Main content and grid */
.main-page {
  width: 100%;
  max-width: 1220px;
  margin: 0 auto 36px auto;
  padding: 0 18px;
}
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(325px, 1fr));
  gap: 32px;
  margin-bottom: 28px;
}

/* Pagination */
.pagination {
  display: flex;
  gap: 0.5em;
  justify-content: center;
  align-items: center;
  margin-top: 0.5em;
}
.pagination button {
  padding: 0.52em 1.12em;
  border: none;
  background: #f1f5f9;
  color: #2563eb;
  font-weight: 600;
  border-radius: 7px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.17s;
}
.pagination button.active,
.pagination button:hover:not([disabled]) {
  background: #2563eb;
  color: #fff;
}
.pagination button[disabled] {
  background: #cdd3de;
  color: #6c7897;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .hero-content h1 { font-size: 1.3rem;}
  .main-page { padding: 0 3px;}
  .article-grid { gap: 14px;}
}
</style>
