<script>
  // Accepts a tag object as a prop. This represents a single tag with:
  // - id: unique identifier for the tag
  // - content: the tag's textual label (e.g., "Svelte", "JavaScript")
  // - image_path: optional path to an icon/image for the tag
  export let tag = {
    id: "",
    content: "",
    image_path: ""
  };
</script>

<!--
  Tag Card Component

  This is a clickable card representing a single tag.
  - On the left: an image/icon if available, or just an empty img placeholder for layout consistency.
  - On the right: the tag's name as a heading, prefixed with '#'.
  - Clicking the card navigates to the search page, filtered by this tag.
-->
<a
  class="tag-card"
  href={`/search?tag=${encodeURIComponent(tag.content)}&id=${tag.id}`}
  aria-label={`Search articles tagged with "${tag.content}"`}
>
  <div class="card-inner">
    <!-- Icon/Image Section (left side) -->
    <div class="icon-wrapper">
      {#if tag.image_path}
        <!-- If an image path is provided, show the tag's icon -->
        <img src={tag.image_path} alt={`${tag.content} icon`} />
      {:else}
        <!-- If not, show a placeholder image for consistent card sizing.
             You could put a default SVG here for better UX if you want. -->
        <img alt={`${tag.content} icon`} />
      {/if}
    </div>

    <!-- Text Section (right side) -->
    <div class="text-wrapper">
      <!-- Display the tag as a heading, e.g. "#JavaScript" -->
      <h2 class="tag-title">#{tag.content}</h2>
    </div>
  </div>
</a>

<style>
  /* The clickable card container */
  .tag-card {
    display: block;
    background-color: #e0f7ff;     /* Soft blue background */
    border: 1px solid #a0d8ef;     /* Lighter blue border */
    border-radius: 8px;
    text-decoration: none;         /* Remove underline from link */
    margin: 8px 0;
    transition: box-shadow 0.2s ease;
  }
  .tag-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Soft shadow on hover */
  }

  /* Inner content layout: icon left, text right */
  .card-inner {
    display: flex;
    align-items: center;
    padding: 12px;
  }

  /* Icon/image box styles */
  .icon-wrapper {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

  /* Tag text section */
  .text-wrapper {
    flex-grow: 1;
  }

  /* Tag heading */
  .tag-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #0a3d62;
    line-height: 1.2;
  }
</style>
