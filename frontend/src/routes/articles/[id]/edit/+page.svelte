<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';
  import { updateArticle } from '$lib/api.js';

  export let data;
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  const article = data.article;

  async function handlePublish(updated) {
  try {
    await updateArticle(article.id, {
      title: updated.title,
      content: updated.content,
      image_path: updated.image_path || 'images/tmp.jpg'
    });
    alert('Success updated!');
    // future extension. after edit jump to other pages.
  } catch (e) {
    alert('Failed: ' + e.message);
  }
}
</script>

<ArticleEditor
  apiKey={apiKey}
  defaultTitle={article.title}
  defaultTags={article.tags.join(', ')}
  defaultContent={article.content}
  onPublish={handlePublish}
/>
