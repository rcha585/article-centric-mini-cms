<script>
  export let tag = {
    id: '',
    content: '',
    image_path: ''
  };
</script>

<a class="tag-card" href={`/search?tag=${encodeURIComponent(tag.content)}`}>
  <div class="card-inner">
    <!-- 1) Icon/Image on the left -->
    <div class="icon-wrapper">
      {#if tag.image_path}
        <img src={tag.image_path} alt={`${tag.content} icon`} />
      {:else}
        <img alt={`${tag.content} icon`} />
      {/if}
    </div>

    <!-- 2) Textual info on the right -->
    <div class="text-wrapper">
      <!-- “# TagName” heading -->
      <h2 class="tag-title">#{tag.content}</h2>
    </div>
  </div>
</a>

<style>
  /* Overall clickable card */
  .tag-card {
    display: block;
    background-color: #e0f7ff;
    border: 1px solid #a0d8ef;
    border-radius: 8px;
    text-decoration: none;
    margin: 8px 0;
    transition: box-shadow 0.2s ease;
  }
  .tag-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  .card-inner {
    display: flex;
    align-items: center;
    padding: 12px;
  }
  .icon-wrapper {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .text-wrapper {
    flex-grow: 1;
  }
  .tag-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #0a3d62;
    line-height: 1.2;
  }
</style>

