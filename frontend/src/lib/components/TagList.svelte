<script>
  export let tag = {
    id: '',
    content: ''
  };
</script>

<a class="tag-card" href={`/tags/${tag.id}`}>
  <div class="card-inner">
    <!-- 1) Icon/Image on the left -->
    <div class="icon-wrapper">
      <img alt={tag.content + ' icon'} />
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
    display: block;                      /* full‐width link container */
    background-color: #e0f7ff;           /* very light blue */
    border: 1px solid #a0d8ef;           /* slightly darker blue border */
    border-radius: 8px;                  /* rounded corners */
    text-decoration: none;               /* remove link underline */
    margin: 8px 0;                       /* vertical gap between cards */
    transition: box-shadow 0.2s ease;
  }
  .tag-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* Inner flex wrapper to align icon + text */
  .card-inner {
    display: flex;
    align-items: center;
    padding: 12px;
  }

  /* Left‐side icon container (fixed square) */
  .icon-wrapper {
    flex-shrink: 0;       /* don’t let it shrink horizontally */
    width: 64px;
    height: 64px;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-right: 16px;   /* space between image and text */
  }
  .icon-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Right‐side text container */
  .text-wrapper {
    flex-grow: 1;        /* occupies remaining horizontal space */
  }

  /* The “# TagName” heading */
  .tag-title {
    margin: 0;
    font-size: 1.5rem;         /* 24px */
    font-weight: 600;
    color: #0a3d62;            /* a dark blue/black for strong contrast */
    line-height: 1.2;
  }

  /* Counters row: small gray text, spaced apart */
  .tag-counters {
    margin-top: 4px;
    display: flex;
    gap: 24px;                /* space between “views” and “discusses” */
    font-size: 0.875rem;      /* 14px */
    color: #555555;           /* medium‐dark gray */
  }
</style>
