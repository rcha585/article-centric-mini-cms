<script>
  export let data;

  const { article, comments } = data;
</script>

<svelte:head>
  <title>{article.title}</title>
</svelte:head>

<article class="detail-container">
  <!-- 1) Title -->
  <h1 class="title">{article.title}</h1>

  <!-- 2) “By {username} on {date}” -->
  <p class="meta">
    By <strong>{article.username}</strong> on
    {new Date(article.created_at).toLocaleDateString()}
  </p>

  <!-- 3) Main image (if any) -->
  {#if article.image_path}
    <img class="main-image" src={article.image_path} alt={article.title} />
  {/if}

  <!-- 4) Full content  -->
  <div class="content">
    {@html article.content}
  </div>
</article>

<!-- 5) Comments Section -->
<section class="comments-section">
  <h2>Comments</h2>

  {#if comments.length === 0}
    <p>No comments yet.</p>
  {:else}
    <ul class="comments-list">
      {#each comments as comment (comment.id)}
        <li class="comment-item">
          <p class="comment-meta">
            <strong>{comment.username}</strong>
            • {new Date(comment.created_at).toLocaleDateString()}
          </p>
          <p class="comment-content">{comment.content}</p>
        </li>
      {/each}
    </ul>
  {/if}
</section>

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
    margin-bottom: 2rem;
  }

  /* COMMENTS */
  .comments-section {
    max-width: 700px;
    margin: 2rem auto;
    padding: 0 1rem;
    border-top: 1px solid #e2e8f0;
  }
  .comments-section h2 {
    color: #1e3a8a;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  .comments-list {
    list-style: none;
    padding: 0;
  }
  .comment-item {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #cbd5e1;
  }
  .comment-meta {
    font-size: 0.85rem;
    color: #475569;
    margin-bottom: 0.25rem;
  }
  .comment-content {
    font-size: 1rem;
    color: #334155;
    margin: 0;
  }
</style>
