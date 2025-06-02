<!-- src/lib/components/Navbar.svelte -->
<script>
  import { page } from '$app/stores';
  $: currentPath = $page.url.pathname;
</script>

<nav class="navbar">
  <ul class="nav-list">
    <li>
      <a href="/" class:active={currentPath === '/'}>Home</a>
    </li>
    <li>
      <a href="/articles" class:active={currentPath.startsWith('/articles')}>Articles</a>
    </li>
    <li>
      <a href="/tags" class:active={currentPath.startsWith('/tags')}>Tags</a>
    </li>
    <li>
      <a href="/notifications" class:active={currentPath.startsWith('/notifications')}>Notifications</a>
    </li>
    <li>
      <a href="/user" class:active={currentPath.startsWith('/user')}>My Profile</a>
    </li>
  </ul>
</nav>

<style>
  .navbar {
    background: #2c3e50;
    padding: 0.5rem 1rem;
  }
  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1rem;
  }
  .nav-list a {
    color: #ecf0f1;
    text-decoration: none;
    font-weight: 500;
  }
  .nav-list a.active {
    border-bottom: 2px solid #ecf0f1;
  }
</style>
