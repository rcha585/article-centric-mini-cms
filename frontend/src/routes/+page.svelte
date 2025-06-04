<script>
  export let data;
  import ArticleCard from "$lib/components/ArticleCard.svelte";

  let { articles = [] } = data;
  
  import { goto } from '$app/navigation';
  function toDetail(e) {
    goto(`/articles/${e.detail.id}`);
  }

  function goToLogin() {
    goto("/login");
  }
</script>

<div class="main-page">
  <div class="article-grid">
    {#each articles as a (a.id)}
      <ArticleCard article={a} on:readmore={toDetail} />
    {/each}
  </div>
</div>

<style>
  .main-page {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .article-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    gap: 20px 10px;
    width: 100%;
    max-width: 1200px;
    margin-top: 40px;
    margin-bottom: 40px;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
