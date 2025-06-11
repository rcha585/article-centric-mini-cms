<script>
  // Props: article object and max length of excerpt
  export let article;
  export let maxExcerptLength = 300;

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

  // Subscribers number
  $: subsText = `${article.subsCount} subscriber${article.subsCount === 1 ? "" : "s"}`;

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
        {#each article.tags.slice(0, 4) as tag}
          {#if typeof tag === 'string'}
            <a class="article-tag" href={`/search?tag=${encodeURIComponent(tag)}`}>#{tag}</a>
          {:else}
            <a class="article-tag" href={`/search?tag=${encodeURIComponent(tag.content)}&id=${tag.id}`}>#{tag.content}</a>
          {/if}
        {/each}
      </div>
    {/if}

    <!-- Meta Info (Two-row Table Layout) -->
    <div class="article-meta-table">

      <div class="meta-row">
        <span class="meta-label">Created at</span>
        <span class="meta-empty"></span>
        <span class="meta-date">{createdDate}</span>
      </div>

      <div class="meta-row">
        <span class="meta-label">By</span>
        <span class="meta-empty"></span>
        <span class="meta-author">
          <img
            class="author-avatar"
            src={article.author.avatarUrl || '/default-avatar.png'}
            alt={article.author.name}
          />
          <span class="author-name">{article.author.name}</span>
        </span>
      </div>

      <div class="meta-row">
        <span class="meta-label">Subscriber</span>
        <span class="meta-empty"></span>
        <span class="meta-subs">{subsText}</span>
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
    max-width: 420px;
    min-height:580px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(30, 50, 80, 0.11);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border: 1px solid #eef0f2;
    transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  }

  .article-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow:
    0 8px 24px rgba(61, 90, 128, 0.3),
    0 0 16px rgba(61, 90, 128, 0.6),
    0 0 32px rgba(152, 193, 217, 0.4);
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
    flex: 1 1 auto;
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
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4em;
    max-height: calc(1.4em * 7);
    min-height: calc(1.4em * 7);
    font-size: 1rem;
    color: #254060;
    margin-bottom: 10px;
    white-space: normal;
  }

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 10px;
    margin-bottom: 1px;
  }

  .article-tag {
    display: inline-block;
    text-decoration: none;
    font-size: 0.88rem;
    color: #2d4a6e;
    background: #f0f2f7;
    padding: 4px 12px;
    border-radius: 12px;
    letter-spacing: 0.01em;
    font-weight: 500;
    transition: background-color 0.2s, color 0.2s;
    cursor: pointer;
  }

  .article-tag:hover {
  background: #3d5a80;
  color: #fff;
  }

  /* Meta Row: Two Columns, Clean Layout */
  .article-meta-table {
    margin-top: 1px;
    margin-bottom: 6px;
    border-radius: 11px;
    padding: 12px 14px 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    font-size: 0.97em;
  }

  .meta-row {
    display: grid;
    grid-template-columns: 78px 1fr auto;
    align-items: center;
    gap: 0 6px;
  }

  .meta-label {
    color: #334155;
    font-weight: 600;
    text-align: left;
    font-size: 0.99em;
  }

   .meta-author {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
    min-width: 90px;
  }

  .meta-label {
    color: #1e293b;
    font-weight: 600;
    margin-right: 2px;
  }

  .meta-subs{
    color:#0f172a;
    font-weight:600;
  }

  .author-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e2e8f0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
    margin-top: 8px;
    background: #3d5a80;
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
    background: #2d4a6e;
  }
</style>
