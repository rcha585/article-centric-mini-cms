<script>
  export let article = {
    id: 1,
    title: "The Future of AI",
    excerpt: "Artificial intelligence is transforming the world...",
    createdAt: "2025-06-01",
    likes: 102,
    favorites: 57,
    tags: ["AI", "Technology", "Future", "Innovation", "Trending", "Research"],
    coverUrl: "/default-article-cover.png"
  };
  $: createdDate = new Date(article.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleEdit() {
    dispatch("edit", { id: article.id });
  }
  function handleReadMore() {
    dispatch("readmore", { id: article.id });
  }
  function handleDelete() {
    dispatch("delete", { id: article.id });
  }
</script>

<div class="user-article-card">
  <div class="card-cover">
    <img src={article.coverUrl} alt={article.title} />
  </div>
  <div class="card-main">
    <div class="card-title">{article.title}</div>
    <div class="card-excerpt">{article.excerpt}</div>
    {#if article.tags?.length}
      <div class="tags">
        {#each article.tags.slice(0, 4) as tag}
          <span class="tag">#{tag}</span>
        {/each}
        {#if article.tags.length > 4}
          <span class="tag more">+{article.tags.length - 4}</span>
        {/if}
      </div>
    {/if}
    <div class="card-bottom">
      <div class="card-icons">
        <span title="Likes">
          <img src="/icons/like.svg" alt="Likes" class="icon" />
          <!-- WebSocket, many users login and likes will update -->
          {article.likes}
        </span>
        <span title="Favorites">
          <img src="/icons/favorite.svg" alt="Favorites" class="icon" />
          {article.favorites}
        </span>
      </div>
      <div class="card-actions">
        <button class="delete-btn" on:click={handleDelete}>Delete</button>
        <button class="edit-btn" on:click={handleEdit}>Edit</button>
        <button class="loadmore-btn" on:click={handleReadMore}>Load More</button>
      </div>
    </div>
    <div class="card-createdat">Created by {createdDate}</div>
  </div>
</div>

<style>
  .user-article-card {
    display: flex;
    background: linear-gradient(110deg, #eaf1fb 0%, #f7fafd 100%);
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 #b5cbe4a0;
    padding: 22px 28px;
    margin-bottom: 28px;
    align-items: flex-start;
    min-height: 150px;
    transition: box-shadow 0.2s;
  }

  .user-article-card:hover {
    box-shadow: 0 8px 32px 0 #b5cbe4cc;
  }

  .card-cover img {
    width: 92px;
    height: 92px;
    object-fit: cover;
    border-radius: 12px;
    margin-right: 32px;
    border: 2px solid #dde3ea;
    background: #fff;
    box-shadow: 0 2px 8px #d4e3f6aa;
  }

  .card-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .card-title {
    font-weight: bold;
    font-size: 1.18rem;
    color: #254060;
    line-height: 1.38;
    margin-bottom: 7px;
    word-break: break-all;
  }

  .card-excerpt {
    font-size: 1rem;
    color: #4570a0;
    margin-bottom: 12px;
    max-width: 97%;
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 11px;
    margin-bottom: 10px;
  }
  .tag {
    background: #dcecfb;
    color: #2068a3;
    padding: 3px 14px;
    border-radius: 12px;
    font-size: 0.93rem;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;
  }
  .tag.more {
    background: #b8cff1;
    color: #225;
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    flex-wrap: wrap;
    gap: 10px 0;
  }

  .card-icons {
    display: flex;
    gap: 20px;
    color: #215c99;
    font-size: 1.01rem;
    align-items: center;
  }
  .card-icons .icon {
    width: 19px;
    height: 19px;
    margin-right: 5px;
    vertical-align: middle;
    filter: drop-shadow(0 0 1px #ffffff90);
  }

  .card-actions {
    display: flex;
    gap: 10px;
  }
  .edit-btn,
  .loadmore-btn,
  .delete-btn {
    padding: 6px 18px;
    font-size: 0.97rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition:
      background-color 0.18s,
      color 0.16s;
    box-shadow: 0 1px 2px rgba(25, 118, 210, 0.07);
  }
  .edit-btn {
    background: #e7eef9;
    color: #3970b7;
  }
  .edit-btn:hover {
    background: #c1d6f2;
    color: #204c7a;
  }
  .loadmore-btn {
    background: #1976d2;
    color: #fff;
  }
  .loadmore-btn:hover {
    background: #1252a1;
  }
  .delete-btn {
    background: #fde6e5;
    color: #ce4242;
  }
  .delete-btn:hover {
    background: #eac1c1;
    color: #901616;
  }

  .card-createdat {
    font-size: 0.91rem;
    color: #8ea5c1;
    text-align: right;
    margin-top: 6px;
    margin-bottom: 2px;
    letter-spacing: 0.2px;
  }
</style>
