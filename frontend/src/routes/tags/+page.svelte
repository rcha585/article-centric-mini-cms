<!-- src/routes/tags/+page.svelte -->
<script>
  // SvelteKit injects `data` from +page.js’s load()
  export let data;
  const { tags } = data;

  import TagList from '$lib/components/TagList.svelte';
</script>

<svelte:head>
  <title>Tags</title>
</svelte:head>

<!-- Page heading -->
<h1 class="page-title">All Tags</h1>

{#if !tags || tags.length === 0}
  <p class="no-tags">No tags available.</p>
{:else}
  <!-- Vertical stack of tag cards with 16px gap -->
  <div class="tag-list">
    {#each tags as tag (tag.id)}
      <TagList {tag} />
    {/each}
  </div>
{/if}

<style>
  /* Page title styling */
  .page-title {
    margin: 0 0 24px 0;
    font-size: 1.875rem;   /* 30px */
    font-weight: 700;
    color: #222222;
  }

  /* “No tags available” text */
  .no-tags {
    color: #555555;
    font-size: 1rem;       /* 16px */
  }

  /* Container for the list of TagCard components */
  .tag-list {
    display: flex;
    flex-direction: column;
    gap: 16px;             /* 16px vertical gap between cards */
  }
</style>
