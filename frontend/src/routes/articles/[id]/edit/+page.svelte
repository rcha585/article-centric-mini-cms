<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';
  export let data;
  const { article, tagStr } = data;

  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  const apiKey   = import.meta.env.VITE_TINYMCE_API_KEY;

  // make "#Tech #Travel" into ["#Tech", "#Travel"].
  function parseTags(tagStr) {
    return tagStr
    .split(/[\s\u3000]+/)
    .map(t => t.trim())
    .filter(Boolean);
  }

  // make sure tags started with #, and only alphabets and numbers.
  function validateTags(arr) {
    const rule = /^#[a-zA-Z0-9]+$/;
    return arr.every(t => rule.test(t));
  }

  // 当用户在编辑器里点击“保存”时，会派发一个 { detail: { title, tags, content, image_path } }
  // 我们在这里收下，先做标签校验、再依次调用 PATCH 文章接口、然后更新 Taggings
  async function handlePublish(e) {
    const { title, tags, content, image_path } = e.detail;
    const tagArr = parseTags(tags);

    // 1. 标签格式校验
    if (!validateTags(tagArr)) {
      alert('All tags must start with # and contain only letters/numbers.');
      return;
    }

    // 2. PATCH /articles/:id 主表(标题/正文/图片路径)
    const patchBody = {
      title,
      content,
      image_path: image_path || 'images/default-image.jpg' 
      // 如果 user 连已有封面都没改，那么传回后端的就保留他原来的 image_path
      // load() 里拿到的 article.image_path，本质上是一个相对“images/…”的路径。
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

    // 3. 保证每个 #tag 都已经存在 tags 表里：先逐条 POST /tags {content:"#xxx"} （如果冲突后端会忽略）
    for (const tag of tagArr) {
      await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tag })
      }).catch(() => {}); // 冲突也无所谓
    }

    // 4. 拿最新的 tags 表里的所有记录，找到对应的 id 数组
    const allTags = await (await fetch(`${BASE_URL}/tags`)).json();
    const tagIds  = tagArr
      .map(t => {
        const found = allTags.find(x => x.content === t);
        return found ? found.id : null;
      })
      .filter(id => id != null);

    // 5. 先把这个文章下所有旧的 taggings 全部删掉
    //    “DELETE /articles/:id/tags” 后端目前不支持一次删完，必须删每个 tag。
    //    先查一遍已有 taggings
    const existingTaggings = await (await fetch(`${BASE_URL}/articles/${article.id}/tags`)).json();
    for (const { id: tid } of existingTaggings) {
      await fetch(`${BASE_URL}/articles/${article.id}/tags/${tid}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    }

    // 6. 然后把新的 tagIds 全部 POST /articles/:id/tags/:tid
    for (const tid of tagIds) {
      await fetch(`${BASE_URL}/articles/${article.id}/tags/${tid}`, {
        method: 'POST',
        credentials: 'include'
      });
    }

    alert('Article updated successfully!');
    // 最后跳转回详情页
    window.location.href = `/articles/${article.id}`;
  }
</script>

<ArticleEditor
  {apiKey}
  defaultTitle   ={article.title}
  defaultTags    ={tagStr}
  defaultContent ={article.content}
  defaultCover   ={article.image_path}
  onPublish      ={handlePublish}
/>
