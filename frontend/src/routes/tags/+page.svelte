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

<div class="tags-page-main">
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
</div>

<style>
  /* Heading style for the page title */
  .tags-page-main {
    background: linear-gradient(90deg, #3d5a80 30%, #98c1d9 100%);
    color: #2b2b3c;
    min-height: calc(100vh - 64px);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 1200px;
    margin: 2rem auto;
    border-radius: 10px;
    position: relative;       
    overflow: hidden; 
  }

  .tags-page-main::before {
    content: "";
    position: absolute;
    top: 0;
    right: -50px;
    width: 300px;
    height: 100%;
    background: radial-gradient(circle at top left,rgba(255,255,255,0.2),transparent);
    transform: rotate(15deg);
    pointer-events: none;
  }

  .page-title {
    margin: 0 0 24px;
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    text-align: center;
  }

  /* Style for the empty tags message */
  .no-tags {
    color: #ffffffaa;
    font-size: 1rem;
    text-align: center;
    padding: 4rem 0;
  }

  /* Flex column for tag cards, with space between */
  .tag-list {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* load more style to maintain the same */
  .load-more {
    margin: 24px auto 0;
    display: block;
    background: none;
    border: none;
    color: #ffffffbb;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
  }

  .load-more:hover {
    color: #ffffff;
  }
</style>
