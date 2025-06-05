<script>
  /********************  PROPS  ********************/
  export let defaultTitle   = '';
  export let defaultTags    = '';
  export let defaultContent = '';
  export let defaultCover   = '';
  export let apiKey         = '';
  import { createEventDispatcher } from 'svelte';
  import RichEditor from '$lib/components/RichEditor.svelte';

  const dispatch = createEventDispatcher();

  /********************  STATE  ********************/
  let title   = defaultTitle;
  let tags    = defaultTags;
  let content = defaultContent;

  let existingCoverUrl = defaultCover
    ? `http://localhost:3000/${defaultCover}`
    : '/default-image.jpg';

  /* cover-upload state (plain JS) */
  let coverFile  = null;      // File | null
  let coverPath  = '';        // backend path like  images/xxxx.jpg
  let uploading  = false;

  /* live word counter */
  $: wordCount = content.replace(/<[^>]+>/g,'').trim().length;

  /*****************  CHOOSE FILE  *****************/
  function onFileChange(event) {
    const input = event.target;
    const f = input.files && input.files[0];
    if (!f) return;
    coverFile = f;
  }

  /*****************  UPLOAD FILE  *****************/
  async function uploadCover() {
    if (!coverFile) return 'images/placeholder.png';

    uploading = true;
    const fd  = new FormData();
    fd.append('file', coverFile);

    try {
      const res  = await fetch('http://localhost:3000/api/upload', { method:'POST', body:fd });
      const json = await res.json();
      uploading  = false;
      return res.ok ? json.path : 'images/placeholder.png';
    } catch {
      uploading = false;
      alert('Upload failed, using placeholder');
      return 'images/placeholder.png';
    }
  }

  /*****************  PUBLISH CLICK  ***************/
  async function handlePublish() {
    const imgPath = await uploadCover();
    coverPath = imgPath;

    dispatch('publish', {
      title,
      tags,
      content,
      image_path: imgPath           // ⇢ will be saved into DB
    });
  }
</script>

<div class="article-editor">
  <!-- Title -->
  <input
    class="editor-title"
    type="text"
    placeholder="Title is here~~"
    maxlength="100"
    bind:value={title}
  />

  <!-- Tags -->
  <input
    class="editor-tags"
    placeholder="#tags you want to place"
    bind:value={tags}
  />

  <!-- Upload-cover row -->
  <div class="cover-row">
    <label class="upload-btn">
      📷 Upload Cover
      <input type="file" accept="image/*" on:change={onFileChange} hidden />
    </label>
    {#if coverFile}
      <span class="file-name">{coverFile.name}</span>
    {/if}
  </div>

  <!-- Preview -->
  {#if coverFile}
    <img class="cover-preview" src={URL.createObjectURL(coverFile)} alt="preview"/>
  {:else if coverPath}
    <img class="cover-preview" src={'/' + coverPath} alt="preview"/>
  {/if}

  <!-- Toolbar -->
  <div class="editor-toolbar">
    <button class="btn-publish" on:click={handlePublish} disabled={uploading}>
      {uploading ? 'Uploading…' : 'Publish'}
    </button>
    <span class="word-count">Word Count: {wordCount}</span>
  </div>

  <!-- Rich-text editor -->
  <RichEditor bind:value={content} {apiKey} />
</div>

<style>
/* container */
.article-editor  { max-width:820px; margin:32px auto; display:flex; flex-direction:column; gap:24px; }

/* title */
.editor-title    { font-size:2rem; font-weight:700; border:none; outline:none; background:transparent; color:#222; padding:8px 0; }
.editor-title::placeholder{ color:#bbb; }

/* tags input */
.editor-tags     { border:1px solid #ddd; border-radius:6px; padding:8px 12px; font-size:1rem; background:#fafafa; }

/* upload row */
.cover-row       { display:flex; align-items:center; gap:12px; }
.upload-btn      { background:#2563eb; color:#fff; padding:6px 20px; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; user-select:none; }
.file-name       { font-size:.9rem; color:#334155; }

/* preview */
.cover-preview   { max-width:260px; margin-top:8px; border-radius:8px; border:1px solid #e5e7eb; object-fit:cover; }

/* toolbar */
.editor-toolbar  { display:flex; align-items:center; justify-content:space-between; margin-top:6px; }
.btn-publish     { background:#2563eb; color:#fff; padding:8px 34px; border-radius:6px; font-size:1rem; font-weight:600; border:none; cursor:pointer; transition:background .18s; }
.btn-publish:hover:enabled { background:#1e4fb7; }
.btn-publish:disabled      { background:#9db5e3; cursor:progress; }
.word-count      { font-size:.92rem; color:#6b7280; }
</style>
