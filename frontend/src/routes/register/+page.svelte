<script>
  import { PUBLIC_IMAGES_URL } from "$env/static/public";
  import ArticleCard from "$lib/components/ArticleCard.svelte";
  import IconButton from "$lib/components/IconButton.svelte";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<h1>Home page</h1>
<p>This is the homepage.</p>

<!-- These images are stored on your Express server. -->
<img src={`${PUBLIC_IMAGES_URL}/Dragonite.png`} alt="Dragonite" style="width: 320px" />

<!-- Optional: display article cards here -->
<!-- Example -->
<ArticleCard
  article={{
    title: "Sample Title",
    content: "Some summary or content preview goes here.",
    imageUrl: `${PUBLIC_IMAGES_URL}/Dragonite.png`,
    created: "30/5/2025",
    likes: "100K",
    favorites: "90K"
  }}
/>
