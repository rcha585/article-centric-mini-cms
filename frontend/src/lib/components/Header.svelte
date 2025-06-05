<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  $: path = $page.url.pathname;
  
  // default value, future extension.
  let user = null;

  let showProfileDropdown = false;
  const PUBLIC_API_BASE_URL = "http://localhost:3000/api"; 

  // Placeholder: set to false or implement logic to check for unread notifications
  let hasUnread = false;

  onMount(async () => {
    // Fetch user data from the API
    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/me`, {
        credentials: 'include' // Include cookies for authentication
      });
      if (response.ok) {
        user = await response.json();
      } else {
        user = null; // Clear user data if the request fails
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      user = null; // Clear user data on error
    }
  });

  async function handleLogout() {
    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include' // Include cookies for authentication
      });
      if (response.ok) {
        user = null; // Clear user data on logout
        goto('/'); 
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
</script>

<nav class="nav-bar">
  <div class="nav-inner">
    <div class="nav-logo">Blog Article</div>
    <!-- search feature, future extension -->
    <form class="nav-search">
      <input type="text" placeholder="Search here..." />
      <button type="submit">🔍</button>
    </form>
    <!-- main navigation, path need modify -->
    <div class="nav-tabs">
      <a href="/"      class:active-tab={path === '/'}>Articles</a>
      <a href="/tags"  class:active-tab={path.startsWith('/tags')}>Tags</a>
      <a href="/user"  class:active-tab={path.startsWith('/user')}>Me</a>
    </div>
    
    <div class="nav-right">
      <a href="/notifications" class="notif-bell">
        <span class="icon-bell">🔔</span>
        {#if hasUnread}
          <span class="notif-dot"></span>
        {/if}
      </a>

      {#if !user}
      <a href="/login" class="nav-login">Login</a>
      {:else}
      <button type="button" class="avatar-wrapper" on:click={() => showProfileDropdown = !showProfileDropdown}>
        <img src={`${PUBLIC_API_BASE_URL}/avatars/${user.avatar_id}.png`} alt="Avatar" class="avatar-img-header" />
        </button>
    
        {#if showProfileDropdown}
          <div class="avatar-dropdown">
            <button on:click={handleLogout}>Logout</button>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</nav>

<style>
  .nav-bar {
    width: 100vw;
    background: linear-gradient(90deg, #39c4fa 0%, #4683ea 100%);
    box-shadow: 0 2px 8px rgba(65,100,180,0.06);
    padding: 0;

    margin: 0;
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 36px;
  }

  .nav-logo {
    font-size: 1.7rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.05em;
  }
  .nav-search {
    margin-left: 32px;
    position: relative;
  }
  .nav-search input {
    border-radius: 16px;
    border: none;
    padding: 6px 32px 6px 14px;
    font-size: 1rem;
    outline: none;
    width: 190px;
    background: #fff;
    color: #2b2b3c;
    box-shadow: 0 1px 4px rgba(70,131,234,0.08);
  }
  .nav-search button {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: none;
    font-size: 1.07em;
    color: #4683ea;
    cursor: pointer;
    padding: 2px 8px;
  }

  .nav-tabs {
    display: flex;
    gap: 30px;
    margin-left: 80px;
  }
  .nav-tabs a {
    color: #fff;
    font-size: 1.08rem;
    font-weight: 500;
    text-decoration: none;
    padding: 6px 16px;
    border-radius: 9px;
    transition: background-color 0.15s, color 0.15s;
  }
  .nav-tabs a:hover {
    background: rgba(255,255,255,0.18);
    color: #f3f6fa;
  }
  .active-tab {
    background: rgba(255,255,255,0.23);
    color: #22315c;
    font-weight: 700;
  }

  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .nav-login {
    background: #fff;
    color: #2770ca;
    font-weight: 600;
    padding: 7px 24px;
    border-radius: 999px;
    margin-left: 10px;
    text-decoration: none;
    box-shadow: 0 2px 10px rgba(65,100,180,0.07);
    transition: background-color 0.16s, color 0.16s;
  }
  .nav-login:hover {
    background: #f2f7fe;
    color: #135aa0;
  }

  .notif-bell {
    position: relative;
    color: #fff;
    font-size: 1.26em;
    margin-right: 5px;
    text-decoration: none;
  }
  .notif-dot {
    position: absolute;
    top: 1px;
    right: 1px;
    width: 9px;
    height: 9px;
    background: #e14a5e;
    border-radius: 50%;
    border: 2px solid #fff;
  }
  .avatar-img-header {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  .avatar-wrapper {
    position: relative;
  }
  .avatar-dropdown {
    position: absolute;
    top: 60px; /* 让菜单靠近 Header 下方 */
    right: 10px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  .avatar-dropdown button {
    padding: 8px 16px;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .avatar-dropdown button:hover {
    background: #f2f7ff;
  }
</style>
