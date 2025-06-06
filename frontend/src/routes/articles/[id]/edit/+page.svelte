<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';
  export let data;
  const { article, tagStr } = data;

  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  const apiKey   = import.meta.env.VITE_TINYMCE_API_KEY;

  function parseTags(tagStr) {
    return tagStr.split(/[\s\u3000]+/)
                 .map(t => t.trim())
                 .filter(Boolean);
  }
  function validateTags(arr) {
    const rule = /^#[a-zA-Z0-9]+$/;
    return arr.every(t => rule.test(t));
  }

  async function handlePublish(upd) {
    const tagArr = parseTags(upd.tags);
    if (!validateTags(tagArr)) {
      alert('All tags must start with # and be alphanumeric.');
      return;
    }

    const res = await fetch(`${BASE_URL}/articles/${article.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title:       upd.title,
        content:     upd.content,
        image_path:  upd.image_path || 'placeholder.png'
      })
    });
    if (!res.ok) {
      alert('Failed to update: ' + (await res.text()));
      return;
    }

    for (const tag of tagArr) {
      await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tag })
      });
    }
    
    const allTags = await (await fetch(`${BASE_URL}/tags`)).json();
    const tagIds  = tagArr.map(t => allTags.find(x => x.content === t))
                          .filter(Boolean)
                          .map(x => x.id);
  
    await fetch(`${BASE_URL}/articles/${article.id}/tags`, {
      method: 'DELETE',
      credentials: 'include'
    }).catch(() => {});  
    for (const tid of tagIds) {
      await fetch(`${BASE_URL}/articles/${article.id}/tags/${tid}`, {
        method: 'POST',
        credentials: 'include'
      });
    }

    alert('Article updated!');
    window.location.href = `/articles/${article.id}`;
  }
</script>

<ArticleEditor
  {apiKey}
  defaultTitle   ={article.title}
  defaultTags    ={tagStr}
  defaultContent ={article.content}
  onPublish      ={handlePublish}
/>
