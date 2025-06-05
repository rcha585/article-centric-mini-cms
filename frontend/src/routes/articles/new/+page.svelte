<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';
  import { goto } from '$app/navigation';

  // ******************************
  // ****  CONFIG & CONSTANTS  ****
  // ******************************
  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

  // ******************************
  // ****  PUBLISH HANDLER     ****
  // ******************************
  async function handlePublish(article) {
    /* ---------- tag validation ---------- */
    const tagArr = parseTags(article.tags);
    if (!validateTags(tagArr)) {
      alert('All tags must start with #, alphanumeric only');
      return;
    }

    /* ---------- 1.  POST /articles ------ */
    const body = {
      title:      article.title,
      content:    article.content,
      image_path: article.image_path || 'images/placeholder.png'
    };
    const res = await fetch(`${BASE_URL}/articles`, {
      method:        'POST',
      credentials:   'include',
      headers:       { 'Content-Type': 'application/json' },
      body:          JSON.stringify(body)
    });
    if (!res.ok) {
      alert('Failed: ' + (await res.text()));
      return;
    }

    /* ---------- 2.  obtain new article id (cheapest: query my list) ---- */
    const me   = await (await fetch(`${BASE_URL}/auth/me`, { credentials:'include' })).json();
    const list = await (await fetch(`${BASE_URL}/users/${me.id}/articles`, { credentials:'include' })).json();
    const aid  = Math.max(...list.map(a => a.id));

    /* ---------- 3.  create / taggings  ---- */
    // 3-1 ensure every tag exists
    for (const tag of tagArr) {
      await fetch(`${BASE_URL}/tags`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ content: tag })
      });
    }
    // 3-2 find their ids
    const allTags = await (await fetch(`${BASE_URL}/tags`)).json();
    const tagIds  = tagArr
      .map(t => allTags.find(x => x.content === t)?.id)
      .filter(Boolean);
    // 3-3 add taggings
    for (const tid of tagIds) {
      await fetch(`${BASE_URL}/articles/${aid}/tags/${tid}`, {
        method:'POST',
        credentials:'include'
      });
    }

    alert('Article published ✨');
    goto(`/articles/${aid}`);
  }

  /* ---------- helpers ---------- */
  const tagRe = /^#[a-zA-Z0-9]+$/;
  const parseTags    = (s='') => s.split(/[\s\u3000]+/).map(x=>x.trim()).filter(Boolean);
  const validateTags = (arr)  => arr.every(t => tagRe.test(t));

  /* TinyMCE key */
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
</script>

<ArticleEditor {apiKey} on:publish={e => handlePublish(e.detail)} />
