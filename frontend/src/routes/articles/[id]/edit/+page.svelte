<!-- src/routes/articles/[id]/edit/+page.svelte -->
<script context="module">
  /** 
   * Example load() to fetch existing article data to prefill fields:
   * export async function load({ params, fetch }) {
   *   const articleId = params.id;
   *   const res = await fetch(`/api/articles/${articleId}`);
   *   const articleData = await res.json();
   *   return { props: { articleData } };
   * }
   */
</script>

<script>
  // In a real app, articleData would come from load()
  export let articleData = {
    title: 'How to get refund for my damaged product',
    body: '<p>Step 1: …</p><p>Step 2: …</p>'
  };

  let title = articleData.title;
  let body = articleData.body;

  function saveArticle() {
    // TODO: submit updated title/body to your backend
    console.log('Saving article:', { title, body });
  }
</script>

<section class="edit-article-page">
  <h2>Edit Article</h2>
  <label>
    Title
    <input type="text" bind:value={title} />
  </label>
  <label>
    Body (HTML)
    <textarea bind:value={body} rows="10"></textarea>
  </label>
  <button on:click={saveArticle}>Save Changes</button>
</section>

<style>
  .edit-article-page {
    max-width: 800px;
    margin: 2rem auto;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .edit-article-page h2 {
    margin: 0 0 1rem 0;
  }
  .edit-article-page label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
  .edit-article-page input,
  .edit-article-page textarea {
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  .edit-article-page button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  .edit-article-page button:hover {
    background: #1e8449;
  }
</style>
