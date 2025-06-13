<script>
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { unviewedCount, newNotificationIds, myNotifications, fetchNotifications } from "../stores/notifications.js";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores/currentUser.js';
  import { onDestroy } from "svelte";
  import { get } from "svelte/store";
  import { writable } from 'svelte/store';

  let user;
  const unsubscribe = currentUser.subscribe(u => user = u);
  onDestroy(() => unsubscribe()); // Clean up subscription when component is destroyed{
  
  
  $: path = $page.url.pathname;

  /* ------ the below is for the notification bar ------ */

  // to check if the user has successully logged in -> user info should be recorded, 
  // this will be used as a condition to decide whether or not to show the "icon-bell" 🔔 on nav bar
  $: userinfo = $currentUser;
  $: if (userinfo) {
    console.log('userinfo:', userinfo);
  }

  // to help the page reload and go to target_url, without this function, 
  // the page won't reload -> fail to navigate to new page
  async function handleReadNoti(target_url, notification_id) {

    // Update all unread to read after the user clicked each notification child box
    const res = await fetch(`${PUBLIC_API_BASE_URL}/notifications/${notification_id}`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (!res.ok) {
      alert('Failed to update unviewed: ' + (await res.text()));
      return;
    }

    sessionStorage.setItem('showComments', 'true');
    window.location.href = target_url;
  }

  // this function is for handling the logic which relates to the notification box
  // Collect notifications, mark unviewed notification as viewed once user clicks the notification bell,
  // and store newNotificationIds so we can highlight them and differentiate them with old notifications
  async function handleClickNotification() {
    /* 
    step 1: collecting all the below info by using fetch API:
    + all history of notifications (myNotifications)
    + the number of unviewed Notifications (unviewdCount)
    */
		await fetchNotifications({fetch}); 

    // step 2: 
    // + filter out the unviewed notifications
    // + store the IDs of unviewed notifications so we can mark & highlight them later using CSS
    const unviewed = get(myNotifications).filter(n => n.is_viewed === 0);
    const ids = unviewed.map(n=>n.id);
    newNotificationIds.set(ids);

    // step 3: set the number of unviewed Notification to 0 after user clicked the notification bell icon
		unviewedCount.set(0);     // Clear unviewed

    // console log for checking
    console.log("new notifications id:", get(newNotificationIds));
    console.log("new notifications id length:", get(newNotificationIds).length);
    console.log("all notifications:", get(myNotifications));

    // step 4: Update all unviewed to viewed after the user clicked the notification bell icon
    const res = await fetch(`${PUBLIC_API_BASE_URL}/notifications`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (!res.ok) {
      alert('Failed to update unviewed: ' + (await res.text()));
      return;
    }
    
	}

  let showNotiDropdown = false;
  let notifWrapper;

  // When the user clicks the bell icon repeatedly, the notification box toggles between appearing and disappearing
  // at the same time calling function handleClickNotification 
  async function onClickNotification() {
    await handleClickNotification();
    showNotiDropdown = !showNotiDropdown;
  }

  // remove tag/html entity and select first few words from the article content/comment to appear on the notification box
  function truncateChars(text, charLimit) {
    // Create a temporary div to decode HTML entities
    const temp = document.createElement('div');
    temp.innerHTML = text;
    const decodedText = temp.textContent || temp.innerText || '';

    // Remove extra spaces and trim
    const strippedText = decodedText.replace(/\s+/g, ' ').trim();

    return strippedText.length > charLimit
      ? strippedText.slice(0, charLimit) + '...'
      : strippedText;
  }

  // for closing notification box when use click outside the box
  function handleClickOutside(event) {
    if (notifWrapper && !notifWrapper.contains(event.target)) {
      showNotiDropdown = false;
    }
  }

  // to trigger handlleClickOutside
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  
  /* ------ the below is for the login bar ------ */

  let search = "";

  // (added) track whether we do an exact or partial match
  // 'exact' means send the query literally; 'partial' means wrap in %…%
  const matchType = writable("partial");

  let showProfileDropdown = false;

  $: user = $currentUser;

  async function handleLogout() {
    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include' // Include cookies for authentication
      });
      if (response.ok) {
        currentUser.set(null); // Clear user data on logout
        window.location.href = '/login'; // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Initialize from sessionStorage to save the latest matchType for avoiding UX confusion
  onMount(() => {
    const saved = sessionStorage.getItem('matchType');
    if (saved) matchType.set(saved);
  });

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
    const finalQuery = $matchType === "partial"
      ? `%${trimmed}%`
      : trimmed;

    sessionStorage.setItem('matchType', $matchType);
    const searchUrl = `/search?q=${encodeURIComponent(finalQuery)}&match=${$matchType}`;
    window.location.href = searchUrl;
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
        class:selected={$matchType === "partial"}
        on:click|preventDefault={() => matchType.set("partial")}
      >
        Partial
      </button>
      <button
        type="button"
        class:selected={$matchType === "exact"}
        on:click|preventDefault={() => matchType.set("exact")}
      >
        Exact
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

      <!-- notification bell and notification box -->
      {#if userinfo}

      <div class="notif-wrapper" bind:this={notifWrapper}>
      
        <button class="notif-bell" on:click|preventDefault={onClickNotification}>
          <span class="icon-bell">🔔</span>
          {#if $unviewedCount > 0}
            <span class="notif-dot">{$unviewedCount}</span>
          {/if}
        </button>

        {#if showNotiDropdown}
        <div class="notif-box">
          <p>All notifications</p>

          <!-- if user has no notification -->
          {#if $myNotifications.length == 0}
          <p>You have no notifications. Subscribe to a user to receive their latest articles.</p>
          
          <!-- if user has notification(s), loop over notifications -->
          {:else}
          {#each $myNotifications as n}
          <div class="notification-card {$newNotificationIds.includes(n.id) ? 'highlight' : ''}">
            {#if n.comment_id}
            <img
              class="notification-cover"
              src={`/${n.commenter_avatar_path}`}
              alt={n.commenter_name}
            />
            {:else}
            <img
              class="notification-cover"
              src={`/${n.author_avatar_path}`}
              alt={n.author_name}
            />
            {/if}

            <div class="notification-content">
              {#if n.comment_id}
              <a 
              href={`/articles/${n.article_id}#commentid-${n.commenter_id}${n.comment_id}`} 
              class="notif-childbox" 
              on:click|preventDefault={() => {handleReadNoti(
                `/articles/${n.article_id}#commentid-${n.commenter_id}${n.comment_id}`,n.id)}}>
              <p class="notification-sender"><b>{n.commenter_name}</b> mentioned you in a comment to {n.article_title}</p>
              <p class="notification-preview">{truncateChars(n.comment_content,65)}</p>
              <p class="notification-date">{n.created_at}</p>
              </a>
              {:else}
              <a href={`/articles/${n.article_id}`} class="notif-childbox" 
              on:click|preventDefault={() => handleReadNoti(`/articles/${n.article_id}`,n.id)}>
              <p class="notification-sender"><b>{n.author_name}</b> published a new article: {n.article_title}</p>
              <p class="notification-preview">{truncateChars(n.article_content, 65)}</p>
              <p class="notification-date">{n.created_at}</p>
              </a>
              <!-- </div> -->
              {/if}
            
            </div>

            {#if n.is_read == 0}
              <span class="icon-unread">🔵</span>
            {/if}
            
          </div>
          {/each}
          {/if}
        </div>
        {/if}
      </div>
      {/if}

      <!-- user login -->
      {#if !user}
      <a href="/login" class="nav-login">Login</a>
      {:else}
      <button type="button" class="avatar-wrapper">
        <div class="avatar-outer">
          <img src={`/avatars/avatar${user.avatar_id}.png`} alt="Avatar" class="avatar-img-header" />
        </div>
      </button>

        <button class="nav-logout" on:click|preventDefault={handleLogout}>
          Logout
        </button>
      {/if}
    </div>
  </div>
</nav>


<style>
  /* Main navigation bar container*/
  .nav-bar {
    width: 100vw;
    background: linear-gradient(90deg,#3d5a80 30%,#98c1d9 100%);    
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 0;
    margin: 0;
    top: 0;
    left: 0;
    z-index: 100; 
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    gap: 12px;                   
    padding: 0 36px;
    max-width: 1200px;
    margin: 0 auto;
    height: 64px;
  }

  .nav-inner,
  .notif-wrapper {
    overflow: visible !important;
  }

  .nav-logo {
    font-size: 1.7rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.05em;
    text-shadow:
    0 0 4px rgba(255, 255, 255, 0.7),
    0 0 8px rgba(173, 216, 230, 0.4);   
    transition: transform 0.2s ease, text-shadow 0.2s ease;
    cursor: pointer;
  }

  .nav-logo:hover {
    transform: scale(1.05);
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
  }

  /* Search bar with positioned search icon */
  .nav-search {
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    position: relative; 
    margin-left: 0;
  }

  .nav-search input {
    flex: 1;
    width: 240px;
    border-radius: 16px;
    border: none;
    padding: 6px 32px 6px 14px;
    font-size: 1rem;
    outline: none;
    width: auto;
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
    color: #0054a6;
    cursor: pointer;
    padding: 2px 8px;
  }


  /* ========== (added) EXACT / PARTIAL TOGGLE ========== */
  .match-toggle {
    display: flex;
    gap: 6px;
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
    color: #0054a6;
    border-color: #fff;
    box-shadow: 0 0 8px rgba(255,255,255,0.5);
  }

  /* ========== NAV TABS ========== */
  .nav-tabs {
    display: flex;
    gap: 16px;
    margin-left: 0;
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
    position: relative;
    overflow: hidden;
  }

  .nav-tabs a:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #f3f6fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .nav-tabs a::after {
    content: "";
    position: absolute;
    bottom: 4px;
    left: 50%;
    width: 0;
    height: 2px;
    background: #fff;
    transition: width 0.3s ease, left 0.3s ease;
  }

  .nav-tabs a:hover::after,
  .nav-tabs a.active-tab::after {
    left: 25%;
    width: 50%;
  }

  .active-tab {
    background: rgba(255, 255, 255, 0.23);
    color: #22315c;
    font-weight: 700;
  }

  .nav-right {
    margin-left: 0; 
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .notif-wrapper {
    position: relative;
    display: inline-block;
    overflow: visible;
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
    width: 9px;
    height: 9px;
    background: #e14a5e;
    border-radius: 50%;
    border: 2px solid #fff;
    font-size: 8px;
    text-align: center;
    padding: 2px 2px;
    right: -10px;
  }

  /* ------ the below is for the notification box ------ */

  .notif-box {
    position: absolute;
    top: 100%; 
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
    animation: dropdown-in 0.15s ease-out forwards;
    max-height: 600px;      
    overflow-y: auto; 
  }

  .notification-card {
    width: 100%;
    max-width: 340px;
    display: grid;
    grid-template-columns: 50px 1fr 20px; 
    border-radius: 18px;
    overflow: hidden;
    font-size: 0.8rem;
    padding: 5px;
    margin: 5px;
    gap: 12px; 
    align-items: start; 
    background: rgba(255,255,255,0.75);
  }

  .notification-card p {
    margin: 0px;
    padding: 5px;
    line-height: 1.2;
  }

  .notification-card:hover {
    background: #fff;
    box-shadow: 0 4px 20px rgba(96, 165, 250, 0.4);
  }

  .notification-card.highlight {
    background: rgba(96, 165, 250, 0.2);
  }

  .notification-sender,
  .notification-preview,
  .notification-date {
    color: #1e3a8a;
  }

  .notification-preview {
    opacity: 0.85;
  }

  .notification-date {
    font-size: 0.75rem;
    color: #64748b;
  }

  .notif-box > p:first-child {
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 0.75rem;
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

  .icon-unread {
    display: grid;
    place-items: center;
    height: 10vh;
  }

  .nav-login, 
  .nav-logout {
    background: #fff;
    color: #0054a6;
    font-weight: 600;
    padding: 7px 24px;
    border-radius: 999px;
    margin-left: 10px;
    text-decoration: none;
    box-shadow: 0 2px 10px rgba(65, 100, 180, 0.07);
    transition: background-color 0.16s, color 0.16s;
  }

  .nav-login:hover, 
  .nav-logout:hover {
    background: #f2f7fe;
    color: #135aa0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,84,166,0.15);
  }
  
  .nav-logout {
    border: none;
    outline: none;
  }
  
  .avatar-wrapper {
    position: relative;
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-outer {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  }

  .avatar-img-header {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 6px rgba(0, 84, 166, 0.2);
  }
 
  .nav-tabs a,
  .nav-login,
  .nav-logout,
  .match-toggle button,
  .notif-bell {
    transition: background-color 0.25s, box-shadow 0.25s, transform 0.2s;
}

/* Responsive breakpoints - mobile adaptation */
/* ─── up to 1200px ─── */
@media screen and (max-width: 1200px) {
  .nav-inner {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 12px 24px;
    gap: 12px;            
    height: auto;
  }
  .nav-logo {
    order: 1;
    flex: 1 1 100%;
  }
  .nav-search {
    order: 2;
    flex: 0 0 200px;      
  }
  .match-toggle {
    order: 3;
    flex: 0 0 auto;
    gap: 6px;             
  }
  .nav-tabs {
    order: 4;
    flex: 1 1 auto;
    gap: 12px;
  }
  .nav-right {
    order: 5;
    flex: 0 0 auto;
    margin-left: auto;
  }
}

/* ─── up to 800px ─── */
@media screen and (max-width: 800px) {
  .nav-search {
    flex: 0 0 140px;      
  }
  .nav-search input {
    width: 100%;
  }
  .match-toggle {
    gap: 4px;
  }
  .nav-tabs {
    gap: 8px;
  }
}

/* ─── up to 600px ─── */
@media screen and (max-width: 600px) {
  .nav-search {
    order: 2;
    flex: 1 1 100%;       
  }
  .match-toggle, .nav-tabs {
    order: 3;
    flex: 1 1 100%;
    justify-content: space-around;
  }
  .nav-right {
    order: 4;
    flex: 1 1 100%;
    justify-content: flex-end;
  }
  .notif-box {
    position: fixed !important;
    top: 64px;                
    left: 50%;                
    transform: translateX(-50%); 
    width: 90vw;              
    max-width: 400px;       
    margin: 0;                
    border-radius: 12px;      
    max-height: calc(100vh - 64px - 16px); 
    overflow-y: auto;         
    background: rgba(240,248,255,0.95); 
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    z-index: 2000;                  
  }
}
</style>
