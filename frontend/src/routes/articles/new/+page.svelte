<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte';

  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

  async function handlePublish(article) {
  const res = await fetch('/api/articles', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article)
  });
    if (!res.ok) {
      alert('Failed to publish: ' + (await res.text()));
    } else {
      alert('Published!');
    }
  }

  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
</script>

<ArticleEditor {apiKey} onPublish={handlePublish} />