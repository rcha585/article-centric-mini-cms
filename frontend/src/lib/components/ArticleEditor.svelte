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

  // -------------------- TAG PARSING & VALIDATION --------------------
  // Track whether user has focused/touched the tags input, for validation
  let tagInputTouched = false;

  // maximum tags are 6, each length not exceed 15 characters.
  const MAX_TAGS = 6;
  const MAX_TAG_LEN = 15;
  const TAG_RULE = /^#[a-zA-Z0-9]+$/;

  $: tagArr   = parseTags(tags);
  $: tagValid = validateTags(tagArr);
  $: tagErrorMsg = getTagErrorMsg(tagArr);

  $: tagValues = tagArr.map(t => t.startsWith('#') ? t.slice(1) : t);

  function parseTags(input = '') {
    if (Array.isArray(input)) return input.filter(Boolean);
    const s = typeof input === 'string' ? input : '';
    return s.split(/[\s\u3000]+/).map(x => x.trim()).filter(Boolean);
  }

  function validateTags(arr) {
    if (arr.length > MAX_TAGS) return false;
    if (arr.some(t => !TAG_RULE.test(t))) return false;
    if (arr.some(t => t.length > MAX_TAG_LEN)) return false;
    if (arr.length !== new Set(arr.map(t => t.toLowerCase())).size) return false; // no same tags allowed
    return true;
  }

  // errors of tags system.
  function getTagErrorMsg(arr) {
    if (arr.length > MAX_TAGS) return `Maximum ${MAX_TAGS} tags allowed.`;
    if (arr.some(t => !TAG_RULE.test(t))) return "Each tag must start with # and use only letters/numbers.";
    if (arr.some(t => t.length > MAX_TAG_LEN)) return `Each tag must be <= ${MAX_TAG_LEN} chars.`;
    if (arr.length !== new Set(arr.map(t => t.toLowerCase())).size) return "Duplicate tags are not allowed.";
    return "";
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

  // -------------------- CONTENT RULES --------------------
  const MAX_WORDS = 1500;
  let wordCount = 0;
  $: wordCount =  getTextContent(content).split(/\s+/).filter(Boolean).length;
  
  // transfer HTML into text
  function getTextContent(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

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
      text_content: getTextContent(content),
      image_path: imgPath
    });
  }
</script>

<div class="article-editor">

  <!-- TITLE INPUT -->
  <input
    class="editor-title"
    type="text"
    placeholder="Title Here~~ Please Within 100 Characters"
    maxlength="100"
    bind:value={title}
  />

  <!-- TAGS INPUT & VALIDATION MESSAGE -->
  <div class="tags-section">
    <input
      class="editor-tags"
      type="text"
      placeholder="start with your #tag ~~"
      bind:value={tags}
      on:input={() => tagInputTouched = true}
      aria-invalid={!tagValid}
      aria-describedby="tag-error-msg"
    />
    <span id="tag-error-msg" class="tag-error" aria-live="polite">
      {#if tagInputTouched && !tagValid}
        {tagErrorMsg}
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
      <span>This article has no cover image. If you don't upload one, a default image will be used.</span>
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
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* TITLE INPUT */
  .editor-title {
    font-size: 2rem;
    font-weight: 700;
    border: none;
    outline: none;
    background: transparent;
    color: #222;
    padding: 8px 0;
  }
  .editor-title::placeholder {
    color: #bbb;
  }

  /* TAGS SECTION */
  .tags-section {
    position: relative;
  }
  .editor-tags {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 1rem;
    background: #fafafa;
  }
  .tag-error {
    color: #e11d48;
    font-size: ninerem;
    margin-left: 8px;
  }

  /* COVER UPLOAD ROW */
  .cover-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .upload-btn {
    background: #2563eb;
    color: #fff;
    padding: 6px 20px;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }
  .file-name {
    font-size: ninerem;
    color: #334155;
  }

  /* COVER PREVIEW IMAGE */
  .preview-container {
    margin-top: 8px;
  }
  .cover-preview {
    max-width: 260px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    object-fit: cover;
  }

  /* TOOLBAR AT BOTTOM */
  .editor-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }
  .btn-publish {
    background: #2563eb;
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
    background: #1e4fb7;
  }
  .btn-publish:disabled {
    background: #9db5e3;
    cursor: not-allowed;
  }
  .cover-error {
  color: #e11d48;
  font-size: 0.99rem;
  margin: 5px 0 0 3px;
  }
  .cover-hint {
  color: #8b949e;
  font-size: 0.98rem;
  margin: 5px 0 0 3px;
  }
</style>
