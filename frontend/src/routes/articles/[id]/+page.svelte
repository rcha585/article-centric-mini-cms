<script>
  export let data;
  // data.article was returned by +page.js above
  const { article } = data;
</script>

<svelte:head>
  <title>{article.title} — Article</title>
</svelte:head>

<article class="detail-container">
  <!-- Title -->
  <h1 class="title">{article.title}</h1>

  <!-- Meta: author + date -->
  <p class="meta">
    By <strong>{article.username}</strong> on 
    {new Date(article.created_at).toLocaleDateString()}
  </p>

  <!-- Main image (if any) -->
  {#if article.image_path}
    <img class="main-image" src={article.image_path} alt={article.title} />
  {/if}

  <!-- Full content -->
  <div class="content" >
    {@html article.content}
  </div>
</article>

<style>
  .detail-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    color: #334155;
  }
  .title {
    font-size: 2rem;
    color: #1e3a8a;
    margin-bottom: 0.5rem;
  }
  .meta {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }
  .main-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    object-fit: cover;
  }
  .content {
    font-size: 1rem;
  }
</style>
