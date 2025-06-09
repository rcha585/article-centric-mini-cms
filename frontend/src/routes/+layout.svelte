<!-- src/routes/+layout.svelte -->
<script>
  import "$lib/css/app.css";
  import Header from '$lib/components/Header.svelte';
  export let data;
  let { myNotifications } = data;
</script>

<Header />

<main class="main-content">
  <slot />
</main>

<style>
  .main-content {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
  }
</style>
