<script>
  import ArticleEditor from "$lib/components/ArticleEditor.svelte";

  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || "http://localhost:3000/api";

  async function handlePublish(article) {
    const tagArr = parseTags(article.tags);
    if (!validateTags(tagArr)) {
      alert("All Tags Must Start With # Sign, Please Change!");
      return;
    }

    const articleRes = await fetch(`${BASE_URL}/articles`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title,
        content: article.content,
        image_path: article.image_path || "placeholder.png"
      })
    });
    if (!articleRes.ok) {
      alert("Failed to publish: " + (await articleRes.text()));
      return;
    }

    //* ---------- Find articles list, find the newest one's id ---------- */
    //find the author.
    const meRes = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
    if (!meRes.ok) {
      alert("Cannot find user, please login again.");
      return;
    }
    const me = await meRes.json();

    //pull out this author's all articles.
    const listRes = await fetch(`${BASE_URL}/users/${me.id}/articles`, { credentials: "include" });
    const myList = await listRes.json();

    if (!Array.isArray(myList) || myList.length === 0) {
      alert("Cannot find recent article!");
      return;
    }

    const aid = myList.reduce((max, art) => (art.id > max ? art.id : max), myList[0].id);

    /* ---------- Tag manipulate ---------- */
    // create tags
    for (const tag of tagArr) {
      await fetch(`${BASE_URL}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tag })
      });
    }

    // pull tags table, find ids
    const allTags = await (await fetch(`${BASE_URL}/tags`)).json();
    const tagIds = tagArr
      .map((t) => allTags.find((x) => x.content === t))
      .filter(Boolean)
      .map((x) => x.id);

    // taggings
    for (const tid of tagIds) {
      await fetch(`${BASE_URL}/articles/${aid}/tags/${tid}`, {
        method: "POST",
        credentials: "include"
      });
    }

    alert("Yey! Article Published!");
  }

  function parseTags(tagStr) {
    return tagStr
      .split(/[\s\u3000]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  function validateTags(tagsArr) {
    const tagPattern = /^#[a-zA-Z0-9]+$/;
    for (const tag of tagsArr) {
      if (!tagPattern.test(tag)) {
        return false;
      }
    }
    return true;
  }

  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
</script>

<ArticleEditor {apiKey} onPublish={handlePublish} />
