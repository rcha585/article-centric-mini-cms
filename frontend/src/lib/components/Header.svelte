<script>
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { unviewedCount, newNotificationIds } from "../js/notifications.js";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores/currentUser.js';
  import { onDestroy } from "svelte";

  $: path = $page.url.pathname;

  let user;
  const unsubscribe = currentUser.subscribe(u => user = u);
  onDestroy(() => unsubscribe()); // Clean up subscription when component is destroyed{

  /* ------ the below is for the notification bar ------ */

  function handleReadNoti(target_url) {
    window.location.href = target_url;
  }

  async function handleClickNotification() {
		// Fetch full list
		// const res = await fetch(`${PUBLIC_API_BASE_URL}/notifications/`, { credentials: 'include' });
    const [notiResArticles, notiResComments] = await Promise.all([
                fetch(`${PUBLIC_API_BASE_URL}/notifications/articles`, {credentials: 'include'}),
                fetch(`${PUBLIC_API_BASE_URL}/notifications/comments`, {credentials: 'include'}),
            ]);
		// const all = await res.json();
    const [myArticlesNotifications, myCommentsNotifications] = await Promise.all([
                    notiResArticles.json(),
                    notiResComments.json()
                ]);
    
    const all = [...myArticlesNotifications, ...myCommentsNotifications];

		// Extract IDs of unread
		const unviewed = all.filter(n => n.is_viewed === 0);
		const ids = unviewed.map(n => n.id);

		newNotificationIds.set(ids); // Used to store notification_id
    console.log("all notifications:",all);
    console.log("new notifications:",unviewed);
		unviewedCount.set(0);     // Clear unviewed

    // Update all unviewed to viewed
    const res = await fetch(`${PUBLIC_API_BASE_URL}/notifications`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (!res.ok) {
      alert('Failed to update unviewed: ' + (await res.text()));
      return;
    }
    
	}

  let highlightIds = [];
  $: highlightIds = $newNotificationIds;

  let showNotiDropdown = false;
  let notifWrapper;

  async function onClickNotification() {
    await handleClickNotification(); // Mark as viewed or store newNotificationIds
    showNotiDropdown = !showNotiDropdown;
  }

  function truncateChars(text, charLimit) {
  return text.length > charLimit ? text.slice(0, charLimit) + '...' : text;
  }

  function handleClickOutside(event) {
    if (notifWrapper && !notifWrapper.contains(event.target)) {
      showNotiDropdown = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  export let myNotifications = [];
  
  /* ------ the below is for the login bar ------ */

  let search = "";

  // (added) track whether we do an exact or partial match
  // 'exact' means send the query literally; 'partial' means wrap in %…%
  let matchType = "exact";

  let showProfileDropdown = false;

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
        currentUser.set(null); // Clear user data on logout
        goto('/'); 
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Modified handleSearch to wrap with %…% if matchType==='partial'
  function handleSearch(e) {
    e.preventDefault();
    
    const trimmed = search.trim();
    if (!trimmed) {
      // If input is empty, just go to /search (no q parameter)
      goto(`/search`);
      return;
    }

    // If partial, wrap in %...%
    const finalQuery = matchType === "partial"
      ? `%${trimmed}%`
      : trimmed;

    goto(`/search?q=${encodeURIComponent(finalQuery)}`);
  
    // Build the final URL based on matchType:
    //   If matchType==="partial", we do ?key=<term>&match=partial
    //   If matchType==="exact", we do ?key=<term>&match=exact
    const finalURL = `${PUBLIC_API_BASE_URL}/articles/?key=${encodeURIComponent(
      trimmed
    )}&match=${matchType}`;
  }
</script>

<nav class="nav-bar">
  <div class="nav-inner">
    <div class="nav-logo">Blog Article</div>
    <!-- search feature -->
    <form class="nav-search" on:submit|preventDefault={handleSearch}>
      <input
        type="text"
        placeholder="Search here..."
        bind:value={search}
        aria-label="Search"
      />
      <button type="submit" aria-label="Search">🔍</button>
    </form>

    <!-- (added) EXACT / PARTIAL TOGGLE BUTTONS -->
    <div class="match-toggle">
      <button
        type="button"
        class:selected={matchType === "exact"}
        on:click={() => (matchType = "exact")}
      >
        Exact
      </button>
      <button
        type="button"
        class:selected={matchType === "partial"}
        on:click={() => (matchType = "partial")}
      >
        Partial
      </button>
    </div>


    <!-- main navigation, path need modify -->
    <div class="nav-tabs">
      <a href="/" class:active-tab={path === "/"}>Articles</a>
      <a href="/tags" class:active-tab={path.startsWith("/tags")}>Tags</a>
      <a href="/user" class:active-tab={path.startsWith("/user")}>Me</a>
    </div>


    <!-- ========== RIGHT SIDE (Notifications & Profile) ========== -->
    <div class="nav-right">
      <div class="notif-wrapper" bind:this={notifWrapper}>
      
        <button class="notif-bell" on:click={onClickNotification}>
          <span class="icon-bell">🔔</span>
          {#if $unviewedCount > 0}
            <span class="notif-dot">{$unviewedCount}</span>
          {/if}
        </button>

        {#if showNotiDropdown}
        <div class="notif-box">
          <!-- loop over notifications -->
          <p>All notifications (to remove): {myNotifications.length}</p>
          {#each myNotifications as n}
          <div class="notification-card {highlightIds.includes(n.id) ? 'highlight' : ''}">
            <img
              class="notification-cover"
              src={n.author_avatar_path || n.commenter_avatar_path || '/default-cover.png'}
              alt={n.article_title}
            />
            
            <div class="notification-content">
              {#if n.comment_id}
              <a href="/" class="notif-childbox">
              <p class="notification-sender"><b>{n.commenter_name}</b> added a comment to {n.article_title}</p>
              <p class="notification-preview">{truncateChars(n.comment_content,50)}</p>
              <p class="notification-date">{n.created_at}</p>
              </a>
              {:else}
              <a href={`/articles/${n.article_id}`} class="notif-childbox" on:click={() => handleReadNoti(`/articles/${n.article_id}`)}>
              <p class="notification-sender"><b>{n.author_name}</b> published a new article: {n.article_title}</p>
              <p class="notification-preview">{truncateChars(n.article_content, 50)}</p>
              <p class="notification-date">{n.created_at}</p>
              </a>
              <!-- </div> -->
              {/if}
            
            </div>
            
          </div>
          {/each}
        </div>
        {/if}
      </div>

      {#if !user}
      <a href="/login" class="nav-login">Login</a>
      {:else}
      <button type="button" class="avatar-wrapper" on:click={() => showProfileDropdown = !showProfileDropdown}>
        <img src={`/avatars/${user.avatar_id}.png`} alt="Avatar" class="avatar-img-header" />
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
    box-shadow: 0 2px 8px rgba(65, 100, 180, 0.06);
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
    box-shadow: 0 1px 4px rgba(70, 131, 234, 0.08);
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


  /* ========== (added) EXACT / PARTIAL TOGGLE ========== */
  .match-toggle {
    display: flex;
    gap: 0.5rem;
    margin-left: 16px;
  }
  .match-toggle button {
    all: unset;
    padding: 4px 8px;
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    font-size: 0.9rem;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  .match-toggle button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  .match-toggle button.selected {
    background-color: #fff;
    color: #4683ea;
    border-color: #fff;
  }


  /* ========== NAV TABS ========== */
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
    transition:
      background-color 0.15s,
      color 0.15s;
  }
  .nav-tabs a:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #f3f6fa;
  }
  .active-tab {
    background: rgba(255, 255, 255, 0.23);
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
    box-shadow: 0 2px 10px rgba(65, 100, 180, 0.07);
    transition:
      background-color 0.16s,
      color 0.16s;
  }
  .nav-login:hover {
    background: #f2f7fe;
    color: #135aa0;
  }

  .notif-bell {
    all: unset;
    cursor: pointer;
    position: relative;
    color: #fff;
    font-size: 1.26em;
    margin-right: 5px;
    text-decoration: none;
  }
  .notif-dot {
    position: absolute;
    top: 1px;
    /* right: 1px; */
    width: 9px;
    height: 9px;
    background: #e14a5e;
    border-radius: 50%;
    border: 2px solid #fff;
    /* Paige edits to make the dot slightly on the right of the bell with Text */
    font-size: 8px;
    text-align: center;
    padding: 2px 2px;
    right: -10px;
  }

  /* ------ the below is for the notification box ------ */
 
  .notif-box {
  position: absolute;
  top: 100%; /* Just below the bell */
  right: 0;
  background: white;
  color: black;
  min-width: 350px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 12px;

  max-height: 600px;       /* <-- add this */
  overflow-y: auto; 
  }
  .notif-wrapper {
  position: relative;
  display: inline-block;
}
.notification-card {
    width: 100%;
    max-width: 340px;
    display: grid;
    grid-template-columns: 50px 1fr; 
    /* flex-direction: column; */
    border-radius: 18px;
    overflow: hidden;
    font-size: 0.8rem;
    padding: 5px;
    margin: 5px;
    gap: 12px; /* space between columns */
    align-items: start; /* align items at the top */
  }
  .notification-card p {
  margin: 0px;
  padding: 5px;
  line-height: 1.2;
  }
  .notification-card:hover {
    box-shadow: 0 6px 24px rgba(30, 50, 80, 0.16);
  }

  .notification-card.highlight {
  background-color: #d1e7fd; /* example: light blue background */
  }

  .notification-cover {
    width: 100%;
    height: 50px;
    object-fit: cover;
    object-position: center;
    background: #f3f3f3;
    border-bottom: 1px solid #e5e6e8;
    border-radius: 50px;
  }

  .notif-childbox {
    all: unset;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

/* ------ the below is for the login bar ------ */
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
