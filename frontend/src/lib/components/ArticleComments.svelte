<!-- src/lib/components/ArticleComments.svelte -->
<script>
  export let commentsData = [];
  // If you want “Latest first” sorting built‐in, you can do it here:
  $: sortedComments = [...commentsData].sort((a, b) => new Date(b.date) - new Date(a.date));
</script>

<section class="article-comments">
  <h2>Comments ({sortedComments.length})</h2>
  {#if sortedComments.length === 0}
    <p>No comments yet. Be the first to comment!</p>
  {/if}
  {#each sortedComments as c}
    <div class="comment-card">
      <p class="comment-text">{c.content}</p>
      <p class="comment-meta">
        {c.date} — <strong>{c.author}</strong>
      </p>
    </div>
  {/each}
</section>

<style>
  .article-comments {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  .article-comments h2 {
    margin: 0 0 1rem 0;
  }
  .comment-card {
    margin-bottom: 1rem;
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid #e1e1e1;
  }
  .comment-text {
    margin: 0 0 0.5rem 0;
    color: #3d3d3d;
  }
  .comment-meta {
    margin: 0;
    font-size: 0.8rem;
    color: #7f8c8d;
  }
</style>
