<script>
  // Props: Expects `data` from SvelteKit's load function.
  export let data;

  // Destructure the tags array from the data (array of tag objects).
  const { tags } = data;

  // Import the TagList component to display individual tag cards.
  import TagList from "$lib/components/TagList.svelte";
</script>

<svelte:head>
  <title>Tags</title>
</svelte:head>

<!--
  Tags Page
  Displays all available tags using the TagList component.
-->

<h1 class="page-title">All Tags</h1>

<!-- Conditional rendering:
     - If tags array is empty or undefined, show a message.
     - Otherwise, display a vertical list of TagList cards.
-->
{#if !tags || tags.length === 0}
  <p class="no-tags">No tags available.</p>
{:else}
  <div class="tag-list">
    {#each tags as tag (tag.id)}
      <!-- Render each tag using the TagList component.
           Pass the `tag` object as a prop. -->
      <TagList {tag} />
    {/each}
  </div>
{/if}

<style>
  /* Heading style for the page title */
  .page-title {
    margin: 0 0 24px 0;
    font-size: 1.875rem; /* 30px */
    font-weight: 700;
    color: #222222;
  }

  /* Style for the empty tags message */
  .no-tags {
    color: #555555;
    font-size: 1rem; /* 16px */
  }

  /* Flex column for tag cards, with space between */
  .tag-list {
    display: flex;
    flex-direction: column;
    gap: 16px; /* 16px vertical gap between cards */
  }
</style>
