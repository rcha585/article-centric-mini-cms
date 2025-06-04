<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';
  export let data;
  const { article, tagStr } = data;

  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  const apiKey   = import.meta.env.VITE_TINYMCE_API_KEY;

  /* 重用“新建文章”里那两小段工具函数 ------------------ */
  function parseTags(tagStr) {
    return tagStr.split(/[\s\u3000]+/)
                 .map(t => t.trim())
                 .filter(Boolean);
  }
  function validateTags(arr) {
    const rule = /^#[a-zA-Z0-9]+$/;
    return arr.every(t => rule.test(t));
  }

  /* 真正的“发布（=保存修改）” --------------------------- */
  async function handlePublish(upd) {
    /* 0. 校验 tag – 不想管标签可以把这一段删掉 */
    const tagArr = parseTags(upd.tags);
    if (!validateTags(tagArr)) {
      alert('All tags must start with # and be alphanumeric.');
      return;
    }

    /* 1. 更新文章主体 ---------------------------------- */
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



    /* 2. 可选：重新打标签（最简单做法：先删后全加） -------- */
    //  2-1 确保每个 tag 都存在于 tags 表
    for (const tag of tagArr) {
      await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tag })
      });
    }
    
    //  2-2 找到这些 tag 的 id
    const allTags = await (await fetch(`${BASE_URL}/tags`)).json();
    const tagIds  = tagArr.map(t => allTags.find(x => x.content === t))
                          .filter(Boolean)
                          .map(x => x.id);
    //  2-3 先清空旧标签（你需要在后端做 DELETE /articles/:aid/tags）
    await fetch(`${BASE_URL}/articles/${article.id}/tags`, {
      method: 'DELETE',
      credentials: 'include'
    }).catch(() => {});  // 没有接口就跳过
    //  2-4 再重新打新标签
    for (const tid of tagIds) {
      await fetch(`${BASE_URL}/articles/${article.id}/tags/${tid}`, {
        method: 'POST',
        credentials: 'include'
      });
    }

    alert('Article updated!');
    // 3. 跳回文章详情
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
