<!-- src/lib/components/TagList.svelte -->
<script>
  export let tags = []; // e.g. ['svelte', 'javascript', 'css']
</script>

<div class="tag-list">
  {#each tags as tag}
    <a href={`/tags/${tag}`} class="tag-pill">#{tag}</a>
  {/each}
</div>

<style>
  .tag-list {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .tag-pill {
    background: #e1e1e1;
    color: #2c3e50;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    text-decoration: none;
  }
  .tag-pill:hover {
    background: #d0d0d0;
  }
</style>
