<script>

  export let article;
  export let canEdit   = false;
  export let canDelete = false;
  export let canRead   = true;


  // Format article.createdAt as "DD/MM/YYYY" (locale default may vary).
  $: createdDate = new Date(article.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleEdit() { dispatch("edit",     { id: article.id }); }
  function handleReadMore() { dispatch("readmore", { id: article.id }); }
  function handleDelete() { dispatch("delete",   { id: article.id }); }
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
          <a
            class="tag"
            href={`/search?tag=${encodeURIComponent(tag.content)}&id=${tag.id}`}
          >
            #{tag.content}
          </a>
        {/each}
        {#if article.tags.length > 4}
          <span class="tag more">+{article.tags.length - 4}</span>
        {/if}
      </div>
    {/if}
    <div class="likes-row">
      <span class="likes-count">Likes: {article.likes}</span>
    </div>

    <div class="actions-row">
      {#if canDelete}
        <button class="delete-btn" on:click={() => dispatch('delete', { id: article.id })}>
        Delete
        </button>
      {/if}

      {#if canEdit}
        <button class="edit-btn" on:click={() => dispatch('edit', { id: article.id })}>
        Edit
        </button>
      {/if}

      {#if canRead}
        <button class="loadmore-btn" on:click={() => dispatch('readmore', { id: article.id })}>
        Read&nbsp;More
        </button>
      {/if}
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
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 24px;
    border: 1px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.2);
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
    color: #244366;
    margin-bottom: 12px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 11px;
    margin-bottom: 10px;
    transition: 
    transform 0.2s ease,
    background-color 0.2s ease, 
    color 0.2s ease,
    box-shadow 0.2s ease;
  }

  a.tag {
    background: #dcecfb;
    color: #2068a3;
    padding: 3px 14px;
    border-radius: 12px;
    font-size: 0.93rem;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;
    text-decoration: none;
  }
  
  .tag.more {
    color: #2068a3;
    background: #dcecfb;
    font-size: 0.93rem;
    padding: 3px 14px;
    font-weight: 500;
    border-radius: 10px;
    margin:auto;
    height: 22px;
  }
  .tag:hover {
    transform: translateY(-4px);
    background-color: rgba(61,90,128,0.6);
    color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  /* New “Likes” row styling */
  .likes-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px; /* space after tags/excerpt */
    gap: 6px;
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

  @media (max-width: 600px) {
    .user-article-card {
      flex-direction: column;
      align-items: center;
    }
    .card-cover img {
      margin: 0 0 16px 0;
    }
    .actions-row {
      flex-wrap: wrap;
      justify-content: center;
    }
    .card-createdat {
      text-align: center;
      margin-top: 8px;
    }
  }
</style>
