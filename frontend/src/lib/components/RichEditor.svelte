<script>
    // import a TinyMCE Rich Text Editor.
    import Editor from '@tinymce/tinymce-svelte';

    // "value" is the content of the edit area.
    export let value = '';
    export let apiKey;

    // default config.
    const editorInit = {
      height: 500,
      menubar: true,
      statusbar: true,
      toolbar_sticky: false,
      elementpath: false,
      plugins: 'wordcount lists link image code table',
      placeholder:'Here starts with your story~~',
      toolbar:'undo redo | bold italic underline | alignleft aligncenter alignright | ' +
      'bullist numlist outdent indent | link image table | code',
      branding: true
  };
</script>


<!-- initial config of TinyMCE editor -->
<Editor
    bind:value
    {apiKey}
    conf={editorInit}
/>
