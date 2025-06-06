<script>
  // Props: article object and max length of excerpt
  export let article;
  export let maxExcerptLength = 50;

  // Create preview text, clipped if too long
  $: previewText =
    article.excerpt.length > maxExcerptLength
      ? `${article.excerpt.slice(0, maxExcerptLength)}…`
      : article.excerpt;

  // Format created date
  $: createdDate = new Date(article.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Event dispatcher for "Read More" button
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleReadMore(e) {
    e.stopPropagation();
    dispatch("readmore", { id: article.id });
  }
</script>

<article class="article-card">
  <!-- Article Cover Image (fallback to default) -->
  <img
    class="article-cover"
    src={article.coverUrl || '/default-image.jpg'}
    alt={article.title}
    on:error={(e) => (e.target.src = '/default-image.jpg')}
  />

  <div class="article-content">
    <!-- Title and Excerpt -->
    <h3 class="article-title">{article.title}</h3>
    <p class="article-excerpt">{previewText}</p>

    <!-- Article Tags -->
    {#if article.tags?.length}
      <div class="article-tags">
        {#each article.tags as tag}
          <span class="article-tag">#{tag}</span>
        {/each}
      </div>
    {/if}

    <!-- Meta Info Row: Created at / By -->
    <div class="article-meta-row">
      <div class="meta-labels">
        <div class="meta-label">Created at</div>
        <div class="meta-label">By</div>
      </div>
      <div class="meta-values">
        <div class="meta-value">{createdDate}</div>
        <div class="meta-value author">
          <img
            class="author-avatar"
            src={article.author.avatarUrl || '/default-avatar.png'}
            alt={article.author.name}
          />
          <span class="author-name">{article.author.name}</span>
        </div>
      </div>
    </div>

    <!-- Read More Button -->
    <button class="read-more-btn" on:click={handleReadMore}>
      Read More
    </button>
  </div>
</article>

<style>
  /* Main Card Style */
  .article-card {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(30, 50, 80, 0.11);
    background: linear-gradient(135deg, #f4f6f8 0%, #e9ecf3 100%);
    border: 1px solid #eef0f2;
    transition: box-shadow 0.22s;
  }
  .article-card:hover {
    box-shadow: 0 6px 24px rgba(30, 50, 80, 0.16);
  }

  /* Cover Image */
  .article-cover {
    width: 100%;
    height: 148px;
    object-fit: cover;
    object-position: center;
    background: #f3f3f3;
    border-bottom: 1px solid #e5e6e8;
  }

  /* Content */
  .article-content {
    padding: 18px 18px 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .article-title {
    font-size: 1.22rem;
    font-weight: 700;
    color: #235a82;
    margin-bottom: 4px;
  }
  .article-excerpt {
    font-size: 1.01rem;
    color: #555d65;
    margin-bottom: 10px;
    min-height: 48px;
  }
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 10px;
    margin-bottom: 8px;
  }
  .article-tag {
    font-size: 0.88rem;
    color: #395d74;
    background: #f0f2f7;
    padding: 3px 12px;
    border-radius: 12px;
    letter-spacing: 0.01em;
    font-weight: 500;
  }

  /* Meta Row: Two Columns, Clean Layout */
  .article-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 8px;
    margin-bottom: 10px;
    background: #eef1f5;
    padding: 9px 12px;
    border-radius: 11px;
  }
  .meta-labels {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: #1e293b;
    font-weight: 600;
    font-size: 1em;
    min-width: 80px;
  }
  .meta-values {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
  }
  .meta-value {
    color: #475569;
    font-size: 0.99em;
  }
  .meta-value.author {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .author-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.2px solid #e2e8f0;
    background: #fff;
  }
  .author-name {
    font-weight: 500;
    color: #1e293b;
    font-size: 1em;
  }

  /* Read More Button */
  .read-more-btn {
    align-self: flex-end;
    margin-top: 4px;
    background: #1874d0;
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 6px 24px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(24, 116, 208, 0.07);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.18s;
  }
  .read-more-btn:hover {
    background: #145aa1;
  }
</style>
