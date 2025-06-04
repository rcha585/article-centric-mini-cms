
<script>
  export let data;
  const { tags } = data;

  import TagList from '$lib/components/TagList.svelte';
</script>

<svelte:head>
  <title>Tags</title>
</svelte:head>

<h1 class="page-title">All Tags</h1>

{#if !tags || tags.length === 0}
  <p class="no-tags">No tags available.</p>
{:else}
  <div class="tag-list">
    {#each tags as tag (tag.id)}
      <TagList {tag} />
    {/each}
  </div>
{/if}



<style>
  .page-title {
    margin: 0 0 24px 0;
    font-size: 1.875rem;   /* 30px */
    font-weight: 700;
    color: #222222;
  }

  .no-tags {
    color: #555555;
    font-size: 1rem;       /* 16px */
  }

  .tag-list {
    display: flex;
    flex-direction: column;
    gap: 16px;             /* 16px vertical gap between cards */
  }
</style>
