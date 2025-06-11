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

  // default to your static asset if no image_path was provided
  const defaultIcon = '/hashtag.png';

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
        <!-- If an image path is provided, show the tag's icon -->
        <img 
          src={defaultIcon} alt={`#${tag.content} icon`} class="tag-icon"
        />
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
    width: 100%;
    box-sizing: border-box;
    margin: 8px 0;
    padding: 16px;
    background: rgba(255, 255, 255, 0.3);        
    backdrop-filter: blur(8px);                 
    border: 1px solid rgba(255, 255, 255, 0.25); 
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }

  .tag-card:hover {
    transform: translateY(-4px);
    border-color: #ffffff;
    box-shadow:
      0 0 8px rgba(255,255,255,0.8),    
      0 0 16px rgba(93,194,244,0.6),    
      0 0 24px rgba(93,194,244,0.4);
  }

  .tag-icon {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }

  /* Inner content layout: icon left, text right */
  .card-inner {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Icon/image box styles */
  .icon-wrapper {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(4px);
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-wrapper img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  /* Tag text section */
  .text-wrapper {
    flex-grow: 1;
  }

  /* Tag heading */
  .tag-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d4a6e;
    line-height: 1.2;
  }
</style>
