<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';
  export let data;
  const { article, tagStr } = data;

  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  const apiKey   = import.meta.env.VITE_TINYMCE_API_KEY;


  function parseTags(tagsInput) {
    if (Array.isArray(tagsInput)) return tagsInput;
    return (tagsInput || '')
      .split(/[\s\u3000]+/)
      .map(t => t.trim())
      .filter(Boolean);
  }

  function validateTags(arr) {
    const rule = /^[a-zA-Z0-9]+$/;
    return arr.every(t => rule.test(t));
  }

  // Called when ArticleEditor dispatches “publish”: { title, tags, content, image_path }
  // take it first and then do validation, PATCH, taggings.
  async function handlePublish(e) {
    const { title, tags, content, image_path } = e.detail;
    const tagArr = parseTags(tags);

    // Tag format validation.
    if (!validateTags(tagArr)) {
      alert('All tags must start with # and contain only letters/numbers.');
      return;
    }

    // PATCH /articles/:id
    const patchBody = {
      title,
      content,
      image_path: image_path || 'images/default-image.jpg' 
      // if user not change cover, keep image_path.
    };

    const res = await fetch(`${BASE_URL}/articles/${article.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchBody)
    });
    if (!res.ok) {
      alert('Failed to update article: ' + (await res.text()));
      return;
    }

    // Ensure each tag exists in the tags table (POST tags).
    for (const tag of tagArr) {
      await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tag })
      }).catch(() => {});
    }

    // Fetch all existing tags, map to IDs.
    const allTags = await (await fetch(`${BASE_URL}/tags`)).json();
    const tagIds  = tagArr
      .map(t => {
        const found = allTags.find(x => x.content === t);
        return found ? found.id : null;
      })
      .filter(id => id != null);

    // Delete old taggings
    //“DELETE /articles/:id/tags
    const existingTaggings = await (await fetch(`${BASE_URL}/articles/${article.id}/tags`)).json();
    for (const { id: tid } of existingTaggings) {
      await fetch(`${BASE_URL}/articles/${article.id}/tags/${tid}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    }

    // POST /articles/:id/tags/:tid
    for (const tid of tagIds) {
      await fetch(`${BASE_URL}/articles/${article.id}/tags/${tid}`, {
        method: 'POST',
        credentials: 'include'
      });
    }

    alert('Article updated successfully!');
    window.location.href = `/articles/${article.id}`;
  }
</script>

<ArticleEditor
  {apiKey}
  defaultTitle   ={article.title}
  defaultTags    ={tagStr}
  defaultContent ={article.content}
  defaultCover   ={article.image_path}
  on:publish      ={handlePublish}
/>
