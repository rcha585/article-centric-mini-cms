<!-- src/routes/+layout.svelte -->
<script>
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<!-- Always render the Navbar at the top -->
<Navbar />

<!-- The <slot /> renders whichever page is active -->
<slot />

<style>
  /* Example global reset or global styles can go here */
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f6fa;
    color: #2c3e50;
  }
</style>
