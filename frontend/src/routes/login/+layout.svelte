<!-- src/routes/login/+layout.svelte -->
<!-- Note: we do NOT import Navbar here. This is a “blank” layout. -->
<slot />

<style>
  /* Center the login form, for example */
  body {
    background: #ecf0f1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>
