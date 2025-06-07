<script>
  // Props: Expects `data` from SvelteKit's load function.
  export let data;

  // Destructure the tags array from the data (array of tag objects).
  const { tags } = data;

  // Import the TagList component to display individual tag cards.
  import TagList from "$lib/components/TagList.svelte";

  // Adding a load more feature. 
  let displayCount = 5;

  // load more cards if trigger the function. 
  function loadMore() {
    displayCount = Math.min(tags.length, displayCount + 5);
  }
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
    {#each tags.slice(0, displayCount) as tag (tag.id)}
      <!-- Render each tag using the TagList component.
           Pass the `tag` object as a prop. -->
      <TagList {tag} />
    {/each}
  </div>

  <!-- add a load more buttom to load more cards -->
  {#if displayCount < tags.length}
    <button class="load-more" on:click={loadMore}>
      Load more…
    </button>
  {/if}
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

  /* load more style to maintain the same */
  .load-more {
    margin: 24px auto;
    display: block;
    background: none;
    border: none;
    color: #707070;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: underline;
  }
  .load-more:hover {
    color: #145aa1;
  }
</style>
