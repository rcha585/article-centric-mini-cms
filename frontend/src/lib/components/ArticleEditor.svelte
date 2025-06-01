<script>
  import RichEditor from '$lib/components/RichEditor.svelte';

  export let defaultTitle = '';
  export let defaultTags = '';
  export let defaultContent = '';
  export let apiKey;
  export let onPublish = () => {};
  export let onSaveDraft = () => {};

  let title = defaultTitle;
  let tags = defaultTags;
  let content = defaultContent;

  $: wordCount = content.replace(/<[^>]*>/g, '').trim().length;

  function handlePublish() {
    // function wait for test.
    onPublish({ title, tags, content });
  }

  function handleSave() {
    // future extension.
    onSaveDraft({ title, tags, content });
  }
</script>


<div class="article-editor">
  <input
    class="editor-title"
    type="text"
    placeholder="Title is here~~"
    maxlength="100"
    bind:value={title}
  />

  <input
    class="editor-tags"
    placeholder="#tags you want to place"
    bind:value={tags}
  />

  <div class="editor-toolbar">
    <div>
      <button class="btn-publish" on:click={handlePublish}>Publish</button>
      <button class="btn-save" on:click={handleSave}>Save</button>
    </div>
    <span class="word-count">Word Count: {wordCount}</span>
  </div>

  <RichEditor bind:value={content} {apiKey} />
</div>


<style>
    .article-editor {
    max-width: 800px;
    margin: 32px auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    }
    .editor-title {
    font-size: 2rem;
    font-weight: bold;
    border: none;
    outline: none;
    background: transparent;
    color: #222;
    padding: 8px 0;
    }
    .editor-title::placeholder {
    color: #bbb;
    }
    .editor-tags {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 1rem;
    background: #fafafa;
    }
    .editor-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    }


    .btn-publish {
    background: #2563eb;
    color: #fff;
    padding: 8px 30px;
    border-radius: 6px;
    min-width: 100px;
    border: none;
    margin-right: 12px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    }
    .btn-publish:hover {
    background: #d1d5db;
    }

    .btn-save {
    background: #2563eb;
    color: #fff;
    padding: 8px 36px;
    min-width: 100px;
    border-radius: 6px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    }
    .btn-save:hover {
    background: #d1d5db;
    }

    .word-count {
    color: #666;
    font-size: 0.95rem;
    }

</style>
