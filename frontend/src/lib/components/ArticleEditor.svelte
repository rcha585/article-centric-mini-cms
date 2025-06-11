<script>
  // PROPS
  // These props are passed in from the parent page:
  export let defaultTitle   = '';
  export let defaultTags    = '';
  export let defaultContent = '';
  export let defaultCover   = '';
  export let apiKey         = '';

  import { createEventDispatcher } from 'svelte';
  import RichEditor from '$lib/components/RichEditor.svelte';

  const dispatch = createEventDispatcher();

  // Populate initial fields from props
  let title   = defaultTitle;
  let tags    = defaultTags;
  let content = defaultContent;

  // If a cover image already exists, show it (fallback to default image)
  let existingCoverUrl = defaultCover
    ? `http://localhost:3000/${defaultCover}`
    : '/default-image.jpg';

  // When the user selects a new file, store it here
  let coverFile  = null;      // File | null
  let coverPath  = '';        // path returned by backend (e.g. "images/abc.jpg")
  let uploading  = false;
  let coverError = ""; 

  // Track whether user has focused/touched the tags input, for validation
  let tagInputTouched = false;
  $: tagArr   = parseTags(tags);
  $: tagValid = validateTags(tagArr);

  $: tagValues = tagArr.map(t => t.startsWith('#') ? t.slice(1) : t);

  // -------------------- TAG PARSING & VALIDATION --------------------
  function parseTags(input = '') {
   // if send in an array, just return.
   if (Array.isArray(input)) {
     return input.filter(Boolean);
   }
   // or treated as string
   const s = typeof input === 'string' ? input : '';
   return s
     .split(/[\s\u3000]+/)
     .map(x => x.trim())
     .filter(Boolean);
  }

  function validateTags(arr) {
    // Each tag must start with "#" followed by alphanumeric characters
    const rule = /^#[a-zA-Z0-9]+$/;
    return arr.length > 0 && arr.every(t => rule.test(t));
  }

  // -------------------- FILE SELECTION --------------------
  function onFileChange(event) {
    // Fired when the user picks a file.
    const input = event.target;
    const f = input.files && input.files[0];
    if (!f) return;

    // if image large than 5MB, not update image.
    if (f.size > 5 * 1024 * 1024) {
      coverError = "Image size must be less than 5MB.";
      coverFile = null;
      return;
    }
    coverError = "";

    coverFile = f;
  }

  // -------------------- FILE UPLOAD --------------------
  // Upload the selected file to the backend and return its new path
  async function uploadCover() {
    if (!coverFile) {
      // No new file selected, then send placeholder string.
      return 'images/placeholder.png';
    }

    uploading = true;
    const fd = new FormData();
    fd.append('file', coverFile);

    try {
      const res = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: fd
      });
      const json = await res.json();
      uploading = false;

      // If upload succeeded, return the returned path; otherwise fallback
      return res.ok ? json.path : 'images/placeholder.png';
    } catch {
      uploading = false;
      alert('Upload failed; using placeholder image.');
      return 'images/placeholder.png';
    }
  }

  const MAX_WORDS = 1500;
  let wordCount = 0;
  $: wordCount = content
    .replace(/<[^>]+>/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;

  // -------------------- PUBLISH BUTTON CLICK --------------------
  async function handlePublish() {
    // If tags are invalid, prevent publishing
    if (!tagValid) {
      alert('Each tag must start with “#” and contain only letters or numbers.');
      return;
    }

    if (wordCount > MAX_WORDS) {
      alert(`Your article is too long — please keep it under ${MAX_WORDS} words. You’re currently at ${wordCount}.`);
      return;
    }

    let imgPath = '';
    // only upload new picture, or use default.
    if (coverFile) {
      imgPath = await uploadCover();
    } else if (existingCoverUrl && !existingCoverUrl.includes('/default-image.jpg')) {
      // existingCoverUrl: "http://localhost:3000/images/xxx.jpg"
      imgPath = existingCoverUrl.replace('http://localhost:3000/', '');
    } else {
      imgPath = 'images/placeholder.png';
    }
    coverPath = imgPath;

    // Dispatch a "publish" event so the parent page can handle saving to DB
    dispatch('publish', {
      title,
      tags: tagValues,
      content,
      image_path: imgPath
    });
  }
</script>

<div class="article-editor">

  <!-- TITLE INPUT -->
  <input
    class="editor-title"
    type="text"
    placeholder="Enter article title..."
    maxlength="100"
    bind:value={title}
  />

  <!-- TAGS INPUT & VALIDATION MESSAGE -->
  <div class="tags-section">
    <input
      class="editor-tags"
      type="text"
      placeholder="#tag1 #tag2 #anotherTag"
      bind:value={tags}
      on:input={() => tagInputTouched = true}
      aria-invalid={!tagValid}
      aria-describedby="tag-error-msg"
    />
    <span id="tag-error-msg" class="tag-error" aria-live="polite">
      {#if tagInputTouched && !tagValid}
        Invalid tag format. Each tag must start with “#” and be alphanumeric,
        separated by spaces (e.g. “#travel #food #hello”).
      {/if}
    </span>
  </div>

  <!-- EXISTING COVER PREVIEW OR SELECT NEW FILE -->
  <div class="cover-row">
    <label class="upload-btn">
      📷 Upload Cover
      <input type="file" accept="image/*" on:change={onFileChange} hidden />
    </label>
    {#if coverFile}
      <!-- Show the local preview of the newly selected file -->
      <span class="file-name">{coverFile.name}</span>
      <button class="remove-cover-btn" type="button" on:click={() => coverFile = null}>Change Picture</button>
    {/if}
  </div>

  {#if coverError}
    <div class="cover-error">{coverError}</div>
  {/if}

  {#if !coverFile && (existingCoverUrl.endsWith('/default-image.jpg') || !existingCoverUrl)}
    <div class="cover-hint">
      <span>This article has no cover image. If you don’t upload one, a default image will be used.</span>
    </div>
  {/if}

  <!-- COVER PREVIEW: show the newly selected file OR the existing cover -->
  <div class="preview-container">
    {#if coverFile}
      <img class="cover-preview" src={URL.createObjectURL(coverFile)} alt="Cover preview" />
    {:else}
      <img class="cover-preview" src={existingCoverUrl} alt="Existing cover" on:error={(e) => e.target.src = '/default-image.jpg'} />
    {/if}
  </div>

  <!-- TOOLBAR: Publish button + word count -->
  <div class="editor-toolbar">
    <button
      class="btn-publish"
      on:click={handlePublish}
      disabled={uploading || !tagValid}
    >
      {uploading ? 'Uploading…' : 'Publish'}
    </button>
    <span class="word-count">Word Count: {wordCount}</span>
  </div>

  <!-- RICH TEXT EDITOR -->
  <RichEditor bind:value={content} {apiKey} />
</div>

<style>
  /* Container for the entire editor */
  .article-editor {
    max-width: 820px;
    margin: 32px auto;
    padding: 32px;
    background: linear-gradient(90deg,#3d5a80cc 20%,#98c1d9cc 100%);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 24px;
    transition: box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .article-editor::before {
    content: "";
    position: absolute;
    top: 0;
    right: -50px;
    width: 300px;
    height: 100%;
    background: radial-gradient(circle at top left,rgba(255,255,255,0.2),transparent);
    transform: rotate(15deg);
    pointer-events: none;
  }

  .article-editor:hover {
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3);
  }

  /* TITLE INPUT */
  .editor-title {
    font-size: 2rem;
    font-weight: 700;
    border: none;
    outline: none;
    background: transparent;
    color: #f0f9ff;
    padding: 8px 0;
  }

  .editor-title::placeholder {
    color: #f0f9ff;
  }

  .editor-title:focus {
    outline: none;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  }

  /* TAGS SECTION */
  .tags-section {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 16px;
  }

  .editor-tags {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 1rem;
    background: rgba(255,255,255,0.25);
    color: #2b2b3c;  
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  .editor-tags::placeholder {
    color: rgba(43,43,60,0.5);
  }

  .editor-tags:focus {
    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.8);
  }

  .editor-tags:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  .tag-error {
    color: #e11d48;
    font-size: ninerem;
    margin-left: 8px;
    border-radius: 4px;
  }

  /* COVER UPLOAD ROW */
  .cover-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .upload-btn {
    background: #3d5a80;
    color: #fff;
    padding: 8px 24px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .upload-btn:hover {
    background: #2d4a6e;
  }

  .upload-btn,
  .btn-publish {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .upload-btn:hover,
  .btn-publish:hover:enabled {
    transform: translateY(-3px);
    box-shadow:
      0 8px 24px rgba(61, 90, 128, 0.4),
      0 0 12px rgba(61, 90, 128, 0.6);
  }

  .file-name {
    font-size: ninerem;
    color: #334155;
  }

  .remove-cover-btn {
    transition: color 0.2s ease, text-shadow 0.2s ease;
  }

  .remove-cover-btn:hover {
    color: #3d5a80;
    text-shadow: 0 0 6px rgba(231, 76, 60, 0.8);
  }

  /* COVER PREVIEW IMAGE */
  .preview-container {
    margin-top: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .cover-preview {
    max-width: 260px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    object-fit: cover;
  }

  .cover-preview:hover {
    transform: scale(1.02);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.2),
      0 0 10px rgba(255, 255, 255, 0.7);
  }

  /* TOOLBAR AT BOTTOM */
  .editor-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }

  .btn-publish {
   background: #3d5a80;   
    color: #fff;
    padding: 8px 34px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.18s;
  }

  .btn-publish:hover:enabled {
    background: #2d4a6e;
  }

  .btn-publish:disabled {
    background: rgba(92,122,153,0.5);
    cursor: not-allowed;
  }

  .cover-error {
    color: #e11d48;
    font-size: 0.99rem;
    margin: 5px 0 0 3px;
  }

  .cover-hint {
    color: rgba(255,255,255,0.75);
    font-size: 0.98rem;
    margin: 5px 0 0 3px;
  }


  @media (max-width: 600px) {
    .article-editor {
      padding: 16px;
      margin: 16px;
      gap: 16px;
    }
    .upload-btn, .btn-publish {
      width: 100%;
      text-align: center;
    }
  }
</style>
