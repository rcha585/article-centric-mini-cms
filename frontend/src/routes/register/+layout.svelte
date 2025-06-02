<script>
  import "$lib/css/app.css";
  import { AUTH_URL } from "$lib/js/api-urls.js";

  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  $: path = $page.url.pathname;
  $: console.log(path);

  export let data;

  /**
   * Handle logout by sending a DELETE request to /api/auth, then invalidating.
   */
  async function handleLogout() {
    // TODO Implement this.
  }

  /* THIS IS FOR NOTIFICATIONS NUMBER */
  let notifications = 8; // Example. Replace with real data from load() or fetch later

function handleNotificationsClick() {
  // Redirect to notification page or toggle dropdown
  console.log("Go to notifications page");
}
</script>

<nav>
  <ul>
    <li><a href="/" class:active={path === "/"}>Home</a></li>
    <!-- TODO Only display the "about me" link if the user is logged in. -->
    <li><a href="/user" class:active={path.startsWith("/user")}>User</a></li>
    <li><a href="/article" class:active={$page.url.pathname.startsWith("/article")}>Article</a></li>
    <li><a href="/tags" class:active={$page.url.pathname.startsWith("/tags")}>Tags</a></li>
  </ul>
  <span />
  <ul>
    <!-- TODO Display the login link OR the logout button, not both (depending if the user is logged in). -->
    <li><button on:click={handleLogout}>Logout</button></li>
    <li><a href="/login" class:active={path.startsWith("/login")}>Login</a></li>

  </ul>
  <li class="notif-icon" on:click={handleNotificationsClick}>
  <div class="icon-wrapper">
    🛎️
    {#if notifications > 0}
      <span class="badge">{notifications}</span>
    {/if}
  </div>
</li>
</nav>

<div class="container">
  <slot />
</div>

<style>
  nav {
    background-color: rgb(20, 52, 238);
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 0 5px 3px lightgray;
    display: flex;

    & > ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 10px;
    }

    & li {
      padding: 10px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    & :is(a, button) {
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      text-decoration: none;
      background-color: transparent;
      border: 0;
      padding: 0;
      font-family: inherit;
      cursor: pointer;

      &.active {
        text-decoration: underline;
      }
    }

    & > span {
      flex-grow: 1;
    }
  }

  .container {
    width: 1200px;
    margin: 0 auto;

    @media (max-width: 1200px) {
      width: 100%;
    }
  }
</style>
