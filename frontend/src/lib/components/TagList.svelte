<!-- src/lib/components/TagCard.svelte -->
<script>
  export let tag = {
    id: '',
    name: '',
    imageUrl: '',
    views: 0,
    discusses: 0
  };

  // Helper to format large numbers (e.g. 1500000 → "1.5 m", 30000 → "30 k")
  function formatCount(n) {
    if (n >= 1_000_000) {
      return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' m';
    }
    if (n >= 1_000) {
      return (n / 1_000).toFixed(1).replace(/\.0$/, '') + ' k';
    }
    return String(n);
  }
</script>

<a class="tag-card" href={`/tags/${tag.id}`}>
  <!-- Thumbnail container -->
  <div class="thumbnail">
    <img src={tag.imageUrl} alt={`${tag.name} thumbnail`} />
  </div>

  <!-- Info container -->
  <div class="info">
    <!-- “# TagName” heading -->
    <h3 class="tag-name">#{tag.name}</h3>

    <!-- Counters: “X views • Y discusses” -->
    <div class="counters">
      <span>{formatCount(tag.views)} views</span>
      <span>{formatCount(tag.discusses)} discusses</span>
    </div>
  </div>
</a>

<style>
  /* Container for an individual tag card */
  .tag-card {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
  }
  .tag-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  /* Thumbnail on the left: fixed 96×96 px */
  .thumbnail {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    overflow: hidden;
  }
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Right side: padding around text */
  .info {
    padding: 12px;
    /* allow the text to wrap if necessary */
    flex-grow: 1;
  }

  /* The “# TagName” text */
  .tag-name {
    margin: 0;
    font-size: 1.25rem;        /* 20px */
    font-weight: 600;
    line-height: 1.2;
    color: #222222;
  }

  /* Counters row (“X views” and “Y discusses”) */
  .counters {
    margin-top: 4px;
    display: flex;
    gap: 16px;                 /* space between the two spans */
    color: #555555;            /* a medium‐dark gray */
    font-size: 0.875rem;       /* 14px */
  }
</style>
