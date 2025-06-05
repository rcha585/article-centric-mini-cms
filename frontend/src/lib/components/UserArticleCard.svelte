<script>
  export let article;

  // Format article.createdAt as "DD/MM/YYYY" (locale default may vary).
  $: createdDate = new Date(article.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleEdit()     { dispatch("edit",     { id: article.id }); }
  function handleReadMore() { dispatch("readmore", { id: article.id }); }
  function handleDelete()   { dispatch("delete",   { id: article.id }); }
</script>

<div class="user-article-card">
  <div class="card-cover">
    <img
      src={
        // If article.coverUrl exists and is non‐empty, use backend‐hosted path.
        article.coverUrl && article.coverUrl.trim()
          ? `http://localhost:3000/${article.coverUrl}`
          : "http://localhost:5173/default-image.jpg"
      }
      alt={article.title}
      on:error={(e) => (e.target.src = "http://localhost:5173/default-image.jpg")}
    />
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

    <!-- NEW: Move Likes into its own row, slightly below tags/excerpt -->
    <div class="likes-row">
      <img src="/icons/like.svg" alt="Likes" class="icon-like" />
      <span class="likes-count">Likes: {article.likes}</span>
    </div>

    <div class="actions-row">
      <button class="delete-btn" on:click={handleDelete}>Delete</button>
      <button class="edit-btn"   on:click={handleEdit}>Edit</button>
      <button class="loadmore-btn" on:click={handleReadMore}>Load More</button>
    </div>

    <div class="card-createdat">Created at {createdDate}</div>
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

  /* New “Likes” row styling */
  .likes-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px; /* space after tags/excerpt */
    gap: 6px;
  }
  .icon-like {
    width: 19px;
    height: 19px;
    filter: drop-shadow(0 0 1px #ffffff90);
  }
  .likes-count {
    color: #215c99;
    font-size: 1.01rem;
    font-weight: 500;
  }

  /* Action buttons row (Delete/Edit/Load More) */
  .actions-row {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
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
    transition: background-color 0.18s, color 0.16s;
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
