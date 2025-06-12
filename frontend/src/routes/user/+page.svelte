<script>
  export let data;
  import UserProfileSidebar from '$lib/components/UserProfileSidebar.svelte';
  import UserArticleCard from '$lib/components/UserArticleCard.svelte';
  import UserSubscriberCard from '../../lib/components/UserSubscriberCard.svelte';
  import { onMount } from 'svelte';
  import { writable, derived} from 'svelte/store';
  const PUBLIC_IMAGES_URL = "http://localhost:3000/images";
  const PUBLIC_API_BASE_URL = "http://localhost:3000/api"; 

  let overviewSortDir = 'desc';
  let likedSortDir = 'desc';
  let commentsSortDir = 'desc'; 

  // sorting logic
  $: sortedMyArticles = [...myArticles].sort((a, b) => {
    const da = new Date(a.createdAt || a.created_at);
    const db = new Date(b.createdAt || b.created_at);
    return overviewSortDir === 'desc' ? db - da : da - db;
  });
  $: sortedLikedArticles = [...likedArticles].sort((a, b) => {
    const da = new Date(a.createdAt || a.created_at);
    const db = new Date(b.createdAt || b.created_at);
    return likedSortDir === 'desc' ? db - da : da - db;
  });
  $: sortedMyComments = [...myComments].sort((a, b) => {
    const da = new Date(a.createdAt || a.created_at);
    const db = new Date(b.createdAt || b.created_at);
    return commentsSortDir === 'desc' ? db - da : da - db;
  });

  let currentTab = "overview";

  let { user, myArticles, likedArticles, myComments, followingUsers } = data;
  let showEditProfile = writable(false);
  let firstName = user.firstName || "";
  let lastName = user.lastName || "";
  let description = user.introduction || "";
  let selectedAvatarId = user.avatar_id || 1;
  let avatars = [];
  
  // all display 2 card in each tab
  let displayOverview = 2;
  let displayLiked = 2;
  let displayComments = 2;
  let displayFollow = 3;

  // public loadMore function 
  function loadMore(tab) {
    if (tab === 'overview') {
      displayOverview = Math.min(myArticles.length, displayOverview + 2);
    } else if (tab === 'liked') {
      displayLiked = Math.min(likedArticles.length, displayLiked + 2);
    } else if (tab === 'comments') {
      displayComments = Math.min(myComments.length, displayComments + 2);
    } else if (tab === 'following') {
      displayFollow = Math.min(followingUsers.length, displayFollow + 3);
    }
  }

  let dateOfBirth = '';
  $ : if (user.date_of_birth) {
    dateOfBirth = user.date_of_birth.split("T")[0];
  }
   const today = new Date().toISOString().split("T")[0];
  $: dobInvalid.set(
    !!dateOfBirth && dateOfBirth > today
  );
  const usernameTaken = writable(false);
  const dobInvalid = writable(false);
  const isSubmitting = writable(false);
  const formError = writable(null);
  const originalUsername = user.username;
  let username = originalUsername;
  let checkTimeout;
  $: {
    clearTimeout(checkTimeout);
    const name = username.trim();
    if (name && name !== originalUsername && name.length >= 3) {
      checkTimeout = setTimeout(() => checkUsernameAvailability(name), 300);
    } else {
      usernameTaken.set(false);
    }
  }
  async function checkUsernameAvailability(name) {
    try {
      const res = await fetch(
        `${PUBLIC_API_BASE_URL}/users/check-username?username=${encodeURIComponent(name)}`
      );
      usernameTaken.set(res.status === 200);
    } catch (err) {
      console.error("Username check failed", err);
      usernameTaken.set(false);
    }
  }
  // require every field non-empty, DOB valid, username not taken
  let canSave = false;
  $: canSave =
    !$isSubmitting &&
    username.trim().length > 0 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    description.trim().length > 0 &&
    dateOfBirth &&
    !$usernameTaken &&
    !$dobInvalid;

  onMount(async () => {
    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/avatars`, {
        credentials: 'include',
      });
      if (response.ok) {
        avatars = await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
    }
  });

  let newPassword = '';
  let showPassword = false;

  // delete article
  async function handleDeleteArticle(e) {
    const artId = e.detail.id;
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`${PUBLIC_API_BASE_URL}/articles/${artId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.status === 204) {
        // delete backend article. remove from array.
        myArticles = myArticles.filter((a) => a.id !== artId);
        alert("Article deleted successfully!");
      } else if (res.status === 403) {
        alert("You are not allowed to delete this article.");
      } else if (res.status === 404) {
        alert("Article not found.");
      } else {
        alert("Failed to delete article. Please try again later.");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("An error occurred while deleting. Please try again later.");
    }
  }

  // Handle edit profile button click
  function toggleEditProfile() {
    showEditProfile.update(value => !value);
  }

  async function handleSaveChanges() {
    if (!canSave) {
      alert("Please fill in all required fields correctly.");
      return;
    }
    const payload = {
      username: username.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      description: description.trim(),  
      avatar_id: selectedAvatarId,
      date_of_birth: dateOfBirth
    };

    if (newPassword.trim().length > 0) {
      payload.password = newPassword.trim();
    }
    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });    
      if (response.ok) {
          alert("Profile updated successfully!");
          showEditProfile.set(false);
          window.location.reload();
        } else if (response.status === 400) {
          const errorJson = await response.json();
          alert("Validation error: " + (errorJson.message || "Please check your input."));
        } else if (response.status === 409) {
          alert("Username already exists. Please choose a different username.");
        } else {
          alert("Failed to update profile. Please try again later.");
        }
      } catch (error) {
      console.error("Error saving profile:", error);
      formError.set("An error occurred while saving your profile. Please try again later.");
      return;
    } finally {
      isSubmitting.set(false);
    }
  }

  // realise delete account
  async function handleDeleteAccount() {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone."))return;
      try {
        const response = await fetch(`${PUBLIC_API_BASE_URL}/users/${user.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.status === 204) {
          alert("Account deleted successfully.");
          window.location.href = "/"; // Redirect to home page after deletion
        } else if (response.status === 403) {
          alert("You are not allowed to delete this account.");
        } else {
          alert("Failed to delete account. Please try again later.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("An error occurred while deleting your account. Please try again later.");
      } finally {
        isSubmitting.set(false);
      }
  }


  // Edit profile in here, add delete profile button.
  function handleEditProfile() {
    alert("Wait for profile edited and delete account here");
  }

  function handleWriteArticle() {
    window.location.href = "/articles/new";
  }
  function handleArticleEdit(e) {
    window.location.href = `/articles/${e.detail.id}/edit`;
  }
  function handleReadMore(e) {
    window.location.href = `/articles/${e.detail.id}`;
  }

  // Delete Comment
  async function handleDeleteComment(commentId) {
   if (!confirm("Delete this comment?")) return;
   try {
     const res = await fetch(
       `${PUBLIC_API_BASE_URL}/comments/${commentId}`,
       { method: "DELETE", credentials: "include" }
     );
     if (res.status === 204) {
       myComments = myComments.filter((c) => c.id !== commentId);
       alert("Comment deleted.");
     } else if (res.status === 403) {
       alert("You can't delete this comment.");
     } else {
       alert("Failed to delete comment.");
     }
   } catch (err) {
     console.error("delete comment error", err);
     alert("Network error when deleting.");
   }
  }
</script>

<div class="user-page-main">
  <aside>
    <UserProfileSidebar
      {user}
      on:editProfile={toggleEditProfile}
      on:writeArticle={handleWriteArticle}
    />
  </aside>

  <section class="user-content">
    <div class="user-tab-bar">
      <button class:active={currentTab === "overview"} on:click={() => (currentTab = "overview")}>
      Overview</button>
      <button class:active={currentTab === "liked"} on:click={() => (currentTab = "liked")}>
      Liked</button>
      <button class:active={currentTab === "comments"} on:click={() => (currentTab = "comments")}>
      Comments</button>
      <button class:active={currentTab === "following"} on:click={() => (currentTab = "following")}>
      Following</button>

      <!-- ===== Add a sort button, not showing when switch to followers tab ===== -->
      {#if currentTab !== "following"}
        <button
          class="sort-btn-inline"
          on:click={() => {
            if (currentTab === "overview") overviewSortDir = overviewSortDir === 'desc' ? 'asc' : 'desc';
            if (currentTab === "liked") likedSortDir = likedSortDir === 'desc' ? 'asc' : 'desc';
            if (currentTab === "comments") commentsSortDir = commentsSortDir === 'desc' ? 'asc' : 'desc';
          }}>

          Sort by Time
          {currentTab === "overview"
            ? (overviewSortDir === 'asc' ? ' ▲' : ' ▼')
            : currentTab === "liked"
            ? (likedSortDir === 'asc' ? ' ▲' : ' ▼')
            : (commentsSortDir === 'asc' ? ' ▲' : ' ▼')}
        </button>
      {/if}
    </div>


    {#if currentTab === "overview"}
      <div class="articles-feed">
        {#if myArticles.length === 0}
          <div class="empty-feed">No articles at the moment, write a new ~~</div>
        {:else}
          {#each sortedMyArticles.slice(0, displayOverview) as article (article.id)}
            <UserArticleCard {article}
              canEdit={true}
              canDelete={true}
              on:edit={handleArticleEdit}
              on:readmore={handleReadMore}
              on:delete={handleDeleteArticle}
            />
          {/each}

          {#if displayOverview  < myArticles.length}
            <button type="button" class="load-more-text" on:click={() => loadMore('overview')}>
              Load more...
            </button>
          {/if}

        {/if}
      </div>
    {:else if currentTab === "liked"}
      <div class="articles-feed">
        {#if likedArticles.length === 0}
          <div class="empty-feed">Have no liked</div>
        {:else}
          {#each sortedLikedArticles.slice(0, displayLiked) as article (article.id)}
            <UserArticleCard {article} 
            canEdit={false}
            canDelete={false}
            on:readmore={handleReadMore} />
          {/each}
          {#if displayLiked < likedArticles.length}
            <button type="button" class="load-more-text" on:click={() => loadMore('liked')}>
              Load more...
            </button>
          {/if}
        {/if}
      </div>
    {:else if currentTab === "comments"}
      <div class="comments-feed">
        {#if myComments.length === 0}
          <div class="empty-feed">No comment yet</div>
        {:else}
          {#each sortedMyComments.slice(0, displayComments) as c}
            <div class="comment-block">
              <div class="comment-content">{c.content}</div>
              <div class="comment-meta">
                On Article: 
                <a class="meta-title-link" href={`/articles/${c.articleId}`}>
                  {c.articleTitle}
                </a>
                <span class="meta-date">{new Date(c.createdAt).toLocaleDateString()}</span>

                <div class="comment-actions">
                  <button class="delete-btn" on:click={() => handleDeleteComment(c.id)}>
                    Delete Comment
                  </button>
                </div>
              </div>
            </div>
          {/each}
          {#if displayComments < myComments.length}
            <button type="button" class="load-more-text" on:click={() => loadMore('comments')}>
              Load more...
            </button>
          {/if}
        {/if}
      </div>
      {:else if currentTab === "following"}
        <div class="follow-feed">
          {#if followingUsers.length === 0}
            <div class="empty-feed">You aren't following anyone yet.</div>
          {:else}
            {#each followingUsers.slice(0, displayFollow) as follower (follower.id)}
              <UserSubscriberCard follower={follower} />
            {/each}

            {#if displayFollow < followingUsers.length}
              <button type="button" class="load-more-text" on:click={() => loadMore('following')}>
                Load more...
              </button>
            {/if}
          {/if}
        </div>
    {/if}

  </section>
</div>

{#if $showEditProfile}
  <div class="edit-profile-popup">
    <div class="popup-content">
      <div class="avatar-container">
        <img class="avatar-img" src={`http://localhost:5173/avatars/avatar${selectedAvatarId}.png`} alt="Avatar" />
        <div class="select-overlay">
          <select bind:value={selectedAvatarId} class="btn-block-select">
            <option value={null} disabled>Change Avatar ▾</option>
              {#each avatars as a}
                <option value={a.id}>{a.avatar_path.split('/').pop()}</option>
              {/each}
          </select>
        </div>
        <button class="btn-delete-account" on:click={handleDeleteAccount}>Delete Account</button>
      </div>
      
      <div class="profile-form">
        <div class="form-row">
          <span class="static-field">User ID:</span>
        <div class="static-field">{user.id}</div>
      </div>

      <div class="form-row">
        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={username} class:invalid={$usernameTaken} required />
      </div>
      {#if $usernameTaken}
        <div class="error-message">Username is already taken.</div>
      {/if}

      <div class="form-row">
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" bind:value={firstName} required/>
      </div>

      <div class="form-row">    
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" bind:value={lastName} required />
      </div>

      <div class="form-row">
        <label for="dateOfBirth">Date of Birth:</label>
        <input type="date" id="dateOfBirth" bind:value={dateOfBirth} max={today} class:invalid={$dobInvalid} required/>
        {#if $dobInvalid}
          <div class="error-message">Date of birth cannot be in the future.</div>
        {/if}
      </div>

      <div class="form-row">
        <label for="password">Password:</label>
        {#if showPassword}
        <input type="text" id="password" bind:value={newPassword} placeholder="Enter new password" />
        {:else}
        <input type="password" id="password" bind:value={newPassword} placeholder="Enter new password" />
        {/if}
        
        <button type="button" class="btn-toggle-pwd" on:click={() => showPassword = !showPassword} title={showPassword ? 'Hide' : 'Show'}>
          {#if showPassword} 👁️ {:else} 🙈 {/if}
        </button>
      </div>

      {#if $formError}
        <div class="error-message">{$formError}</div>
      {/if}


      <div class="form-row textarea-row">
        <label for="description">Description:</label>
        <textarea id="description" bind:value={description}></textarea>
      </div>

      <div class="hidden-select">
        <select id="avatarSelect" bind:value={selectedAvatarId}>
          <option value={null} disabled>Select an avatar</option>
          {#each avatars as a}
            <option value={a.id}>{a.avatar_path.split('/').pop()}</option>
          {/each}
        </select>
      </div>

      <div class="popup-buttons">
        <button class="btn-save" on:click={handleSaveChanges} disabled={$isSubmitting}>{$isSubmitting ? "Saving…" : "Save Changes"} </button>
        <button class="btn-cancel" on:click={toggleEditProfile}>Cancel</button>
      </div>
    </div>
  </div>
</div>
{/if}
  

<style>
  .user-page-main {
    background: linear-gradient(90deg, #3d5a80 30%, #98c1d9 100%);
    color: #2b2b3c;
    padding: 24px;
    min-height: calc(100vh - 64px);
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    max-width: 1200px;
    min-width: 320px;
    margin: 2rem 0 auto;
    border-radius: 12px;
  }

  .user-page-main::before {
    content: "";
    position: absolute;
    top: 0;
    right: -50px;
    width: 300px;
    height: 100%;
    background: radial-gradient(circle at top left, rgba(255,255,255,0.2), transparent);
    transform: rotate(15deg);
    pointer-events: none;
  }

  .user-page-main aside {
    position: relative;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.25);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 24px;
    flex: 1 1 280px;
    width: 100%;
    min-width: 200px;
  }

  .user-content {
    position: relative;
    flex: 2 1 0;
    min-width: 240px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.25);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 32px;
    overflow-x: visible;
  }

  .user-tab-bar {
    display: flex;
    flex-wrap: nowrap;       
    justify-content: space-between;
    box-sizing: border-box;   
    width: 100%;              
    padding: 0 16px;
    margin-bottom: 24px;
    background: rgba(255,255,255,0.3);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    overflow: hidden;         
  }

  .user-tab-bar button {
    flex: 1 1 0;              
    min-width: 0;            
    text-align: center;
    background: none;
    border: none;
    padding: 8px 0;          
    font-weight: 600;
    color: #ffffffcc;
    transition: color 0.2s, background-color 0.2s;
  }

  .user-tab-bar button.active,
  .user-tab-bar button:hover {
    background: rgba(255,255,255,0.5);
    color: #2d4a6e;
    border-radius: 6px;
  }


  /* Feed style */
  .articles-feed,
  .comments-feed {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .articles-feed {
    padding-bottom: 2rem;
  }

  :global(.articles-feed > div) {
    min-width: 0;
    overflow-x: auto;
  }

  :global(.articles-feed > div:hover),
  .comment-block:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  }

  .load-more-text {
    text-align: center;
    margin: 24px auto;
    background: none;
    border: none;
    color: #ffffffbb;
    cursor: pointer;
    font-size: 1rem;
    text-decoration: underline;
  }

  .load-more-text:hover {
    color: #ffffff;
  }

  /* comment style */
  .comments-feed {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

 .empty-feed {
  text-align: center;
  padding: 80px 0;
  color: #ffffffaa;
  font-size: 1.1rem;
}

.comment-block {
  background: #f6f8fa;
  border-radius: 7px;
  padding: 16px 22px;
  color: #244366;
  box-shadow: 0 1px 6px #b3cdf235;
}

:global(.articles-feed > div),
.comment-block {
  position: relative;
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.comment-actions .delete-btn {
  background: #fde6e5;
  color: #ce4242;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  margin-left: auto;
}

.comment-actions .delete-btn:hover {
  background: #eac1c1;
}

.comment-content {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #244366;
}

.comment-meta {
  font-size: 0.9rem;
  color: #8592ad;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-meta .meta-date {
  margin-left: 12px;
}

.meta-title-link {
  text-decoration: none;
  font-size: 1.08em;
  color: #1a4b8c;
  font-weight: 600;
  transition: color 0.18s;
}

.meta-title-link:hover {
  color: #336dcc;
  text-decoration: underline;
}

.edit-profile-popup {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow: auto;
}

.popup-content {
  display: flex;
  flex-wrap: wrap;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 32px;
  width: 800px;
  max-width: 95%;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
}

.avatar-container {
  flex: 0 0 auto;
  text-align: center;
  margin-right: 32px;
  max-width: 100%;
  min-width: 160px;
  margin-top: 12px;
}

.avatar-img {
  width: 160px;
  height: 160px; 
  max-width: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.btn-save,
.btn-cancel,
.btn-delete-account {
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-save { background: #5c7a99; color: #fff; }
.btn-save:hover { background: #3d5a80; }
.btn-cancel { background: rgba(255,255,255,0.4); color: #2b2b3c; }
.btn-cancel:hover { background: rgba(255,255,255,0.6); }
.btn-delete-account { background: #fde6e5; color: #ce4242; }
.btn-delete-account:hover { background: #eac1c1; }

.btn-delete-account {
  margin: 20px 0; 
}

.profile-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.profile-form label {
  width: 140px;
  font-weight: 500;
  color: #ffffffcc;
}

.static-field {
  flex: 1;
  font-size: 0.98rem;
  color: #254060;
  padding: 6px 12px;
  background: #f0f4fa;
  border: 1px solid #d4e3f6;
  border-radius: 6px;
}

.form-row input[type="text"],
.form-row input[type="password"] {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #d4e3f6;
  border-radius: 6px;
  font-size: 0.96rem;
  color: #254060;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-row input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

.textarea-row {
  align-items: flex-start;  
}

.textarea-row textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d4e3f6;
  border-radius: 6px;
  font-size: 0.96rem;
  color: #1f3958;
  background: #fff;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.textarea-row textarea:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

.select-overlay .btn-block-select {
  width: 100%;
  max-width: 140px;
  padding: 14px 18px;
  font-size: 0.95em;
  background: #f8fafd;
  border: none;
  border-radius: 13px;
  box-shadow: 0 2px 12px #b6cbe220;
  color: #25507c;
  font-weight: 500;
  margin: 0 auto 16px auto;
  display: block;
  transition: background-color 0.18s, box-shadow 0.2s;
  outline: none;
  cursor: pointer;
}

.select-overlay .btn-block-select:focus,
.select-overlay .btn-block-select:hover {
  background: #e3effc;
  box-shadow: 0 4px 18px #b6cbe233;
}

.form-row input[type="date"] {
  width: 100%;
  max-width: 130px;
  padding: 14px 18px;
  font-size: 0.95em;
  background: #f8fafd;
  border: none;
  border-radius: 10px;
  color: #25507c;
  font-weight: 600;
  transition: background-color 0.18s, box-shadow 0.2s;
  outline: none;
  cursor: pointer;
}

.form-row input[type="date"]:focus,
.form-row input[type="date"]:hover {
  background: #e3effc;
  box-shadow: 0 4px 18px #b6cbe233;
}

.form-row label {
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 6px;
}

#avatarSelect {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #d4e3f6;
  border-radius: 6px;
  background: #fff;
  font-size: 0.96rem;
  color: #254060;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

#avatarSelect:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
}

.popup-buttons {
  display: flex;
  justify-content: flex-end; 
  gap: 12px;                 
  margin-top: 20px;          
}

.popup-buttons button {
  padding: 8px 18px;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-toggle-pwd {
  margin-left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.2s;
}

.btn-toggle-pwd:hover {
  color: #333;
}
.hidden-select {
  display: none;
}

.error-message {
  margin-top: 0.3rem;
  color: #e74c3c;        
  font-size: 0.85rem;   
  line-height: 1.2;
}

input.invalid{
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

input:invalid:focus,
textarea:invalid:focus,
select:invalid:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}


@media (max-width: 768px) {
  .user-page-main {
    flex-wrap: wrap;
    justify-content: center;
  }
  .user-page-main aside {
    flex: 0 0 280px;     
    max-width: 100%;     
    margin: 0 auto;      
    box-sizing: border-box;
  }
  .user-content {
    flex: 1 1 100%;     
  }
  .popup-content {
    flex-direction: column;
    width: 92vw;
    padding: 16px;
  }
  .avatar-container {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
    min-width: 0;
    padding: 12px 6px;
    border-radius: 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar-img {
    width: 85px; 
    height: 85px;
    margin: 0 auto 12px;
  }

   .edit-profile-popup {
    align-items: flex-start;
    padding: 16px 16px 16px 16px;
  }

  .profile-form {
    width: 100%;
  }
  .form-row {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 12px;
  }
  .form-row label {
    width: 100%;
    margin-bottom: 4px;
  }
  .popup-buttons {
    flex-direction: column;
    gap: 7px;
    align-items: stretch;
    width: 100%;
    margin-top: 18px;
  }
}

@media (min-width: 768px) {
  .user-page-main {
    flex-direction: row;
    max-width: 1200px;
    padding: 0.5rem;
    gap: 1rem;
  }
  .user-page-main aside {
    flex: 0 0 280px;
  }
  .user-content {
    flex: 1;
  }
}

@media (max-width: 700px) {
  .user-tab-bar {
    flex-wrap: wrap;
    gap: 4px;
    padding: 0 2px;
  }
  .user-tab-bar button {
    min-width: 90px;
    margin-bottom: 4px;
    font-size: 1rem;
    padding: 7px 0;
  }
}

@media (max-width: 768px) {
  .comments-feed {
    gap: 8px;
    padding: 0 2px;
  }
  .comment-block {
    padding: 12px 7px;
    font-size: 0.97rem;
  }
  .comment-content {
    font-size: 0.98rem;
    word-break: break-word;
    line-height: 1.4;
  }
  .comment-meta {
    flex-direction: column;
    align-items: flex-start;
    font-size: 0.91rem;
    gap: 3px;
  }
  .meta-title-link {
    font-size: 1rem;
  }
  .comment-actions {
    width: 100%;
    margin-top: 6px;
    display: flex;
    justify-content: flex-end;
  }
  .comment-actions .delete-btn {
    font-size: 0.98rem;
    padding: 7px 13px;
  }
}
</style>