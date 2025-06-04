<script>
  export let article;
  export let maxExcerptLength = 50;

  $: previewText =
    article.excerpt.length > maxExcerptLength
      ? `${article.excerpt.slice(0, maxExcerptLength)}…`
      : article.excerpt;

  $: createdDate = new Date(article.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleReadMore(e) {
    e.stopPropagation();
    dispatch("readmore", { id: article.id });
  }
</script>

<article class="article-card">
  <img class="article-cover" src={article.coverUrl || "/default-cover.png"} alt={article.title} />

  <div class="article-content">
    <h3 class="article-title">{article.title}</h3>
    <p class="article-excerpt">{previewText}</p>

    <!-- cannot fetch tags, future extension -->

    {#if article.tags?.length}
      <div class="article-tags">
        {#each article.tags as tag}
          <span class="article-tag">#{tag}</span>
        {/each}
      </div>
    {/if}

    <div class="article-meta">
      <div class="meta-row">
        <span class="meta-label">Created<br />at</span>
        <span class="meta-date">{createdDate}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">By</span>
        <img
          class="author-avatar"
          src={article.author.avatarUrl || "/default-avatar.png"}
          alt={article.author.name}
        />
        <span class="author-name">{article.author.name}</span>
      </div>
      <button class="read-more-btn" on:click={handleReadMore}> Read More </button>
    </div>
  </div>
</article>

<style>
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
  .article-cover {
    width: 100%;
    height: 148px;
    object-fit: cover;
    object-position: center;
    background: #f3f3f3;
    border-bottom: 1px solid #e5e6e8;
  }
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
  .article-meta {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #eef1f5;
    padding: 10px 0 0 0;
    border-radius: 0 0 16px 16px;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  }
  .meta-label {
    font-weight: bold;
    color: #384860;
    font-size: 1rem;
    min-width: 54px;
  }
  .meta-date {
    color: #858ea1;
    font-size: 0.97rem;
  }

  .author-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    margin-left: 8px;
    border: 1.5px solid #e2e5ea;
    background: #fff;
  }
  .author-name {
    margin-left: 6px;
    font-size: 0.97rem;
    color: #35405a;
    font-weight: 500;
  }

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
