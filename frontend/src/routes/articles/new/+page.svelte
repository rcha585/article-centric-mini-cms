<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';
  import { createArticle } from '$lib/api.js'; 

  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  async function handlePublish(data) {
    try {
      const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await createArticle({
        ...data,
        created_at,
        image_path: data.image_path || 'images/tmp.jpg',
      });
      alert('Publish!');
      // future extension.
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  }
</script>

<ArticleEditor {apiKey} onPublish={handlePublish} />