<script>
  export let data;
  import UserProfileSidebar from '$lib/components/UserProfileSidebar.svelte';
  import UserArticleCard from '$lib/components/UserArticleCard.svelte';
  import { onMount } from 'svelte';
  import { writable, derived} from 'svelte/store';
  const PUBLIC_IMAGES_URL = "http://localhost:3000/images";
  const PUBLIC_API_BASE_URL = "http://localhost:3000/api"; 


  let currentTab = "overview";

  let { user, myArticles, likedArticles, myComments } = data;
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

  // public loadMore function 
  function loadMore(tab) {
    if (tab === 'overview') {
      displayOverview = Math.min(myArticles.length, displayOverview + 2);
    } else if (tab === 'liked') {
      displayLiked = Math.min(likedArticles.length, displayLiked + 2);
    } else if (tab === 'comments') {
      displayComments = Math.min(myComments.length, displayComments + 2);
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
    newPassword.trim().length > 0 &&
    !$usernameTaken &&
    !$dobInvalid;


  onMount(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/avatars", {
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
      <button class:active={currentTab === "overview"} on:click={() => (currentTab = "overview")}
        >Overview</button
      >
      <button class:active={currentTab === "liked"} on:click={() => (currentTab = "liked")}
        >Liked</button
      >
      <button class:active={currentTab === "comments"} on:click={() => (currentTab = "comments")}
        >Comments</button
      >
    </div>

    {#if currentTab === "overview"}
      <div class="articles-feed">
        {#if myArticles.length === 0}
          <div class="empty-feed">No articles at the moment, write a new ~~</div>

        {:else}
          {#each myArticles.slice(0, displayCount) as article (article.id)}
            <UserArticleCard {article}
              on:edit={handleArticleEdit}
              on:readmore={handleReadMore}
              on:delete={handleDeleteArticle}
            />
          {/each}

          {#if displayCount < myArticles.length}
            <button type="button" class="load-more-text" on:click={loadMore}>
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
          {#each likedArticles as article (article.id)}
            <UserArticleCard {article} on:readmore={handleReadMore} />
          {/each}
        {/if}
      </div>
    {:else if currentTab === "comments"}
      <div class="comments-feed">
        {#if myComments.length === 0}
          <div class="empty-feed">No comment yet</div>
        {:else}
          {#each myComments as c}
            <div class="comment-block">
              <div class="comment-content">{c.content}</div>
              <div class="comment-meta">
                On: <span class="meta-title">{c.articleTitle}</span>
                <span class="meta-date">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
            </div>
          {/each}
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
        <button class="btn-change-image" on:click={()=> {const sel = document.getElementById('avatarSelect'); if (sel) sel.click();}}>
          Change Avatar </button>
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
        <input type="text" id="password" bind:value={newPassword} placeholder="Enter new password" required/>
        {:else}
        <input type="password" id="password" bind:value={newPassword} placeholder="Enter new password" required />
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

      {#if $formError}
        <div class="error-message">{$formError}</div>
      {/if}

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
    display: flex;
    max-width: 1000px;
    margin: 44px auto 0 auto;
    gap: 34px;
    align-items: flex-start;
    min-height: 70vh;
  }
  .user-page-main aside {
    flex: 0 0 280px;
  }
  .user-content {
    flex: 1 1 0;
    min-width: 0;
  }

  .user-tab-bar {
    display: flex;
    gap: 18px;
    margin-bottom: 26px;
    border-bottom: 1.5px solid #e1e7f2;
    padding-bottom: 4px;
  }
  .user-tab-bar button {
    background: none;
    border: none;
    padding: 6px 24px;
    font-size: 1.03rem;
    color: #466ab0;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    font-weight: 500;
    transition:
      background-color 0.13s,
      color 0.13s;
    outline: none;
  }
  .user-tab-bar button.active,
  .user-tab-bar button:hover {
    background: #f2f7ff;
    color: #1751a1;
    border-bottom: 2.5px solid #3788e7;
  }

  /* Feed style */
  .articles-feed {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .empty-feed {
    color: #b1b6c2;
    text-align: center;
    padding: 46px 0;
    font-size: 1.06rem;
  }

  .load-more-text {
  background: none;
  border: none;
  padding: 0;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
  margin: 16px auto;
  display: block;
}

.load-more-text:hover {
  color: rgba(0, 0, 0, 0.7);
}

/* comment style */
.comments-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.comment-block {
  background: #f6f8fa;
  border-radius: 7px;
  padding: 16px 22px;
  color: #244366;
  box-shadow: 0 1px 6px #b3cdf235;
}
.comment-content {
  font-size: 1rem;
  margin-bottom: 5px;
}
.comment-meta {
  font-size: 0.91rem;
  color: #8592ad;
}
.meta-title {
  color: #4077b7;
  font-weight: bold;
}
.meta-date {
  margin-left: 18px;
}
.edit-profile-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.popup-content {
  display: flex;
  background: linear-gradient(110deg, #eaf1fb 0%, #f7fafd 100%);
  border-radius: 18px;
  padding: 24px 32px;
  width: 760px;             
  max-width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  font-family: sans-serif;
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;   
  margin-right: 32px;
}

.avatar-img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.btn-change-image {
  background: #cfe8fb;
  color: #254060;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.98rem;
  cursor: pointer;
  margin-bottom: 12px;
  transition: background-color 0.2s, color 0.2s;
}

.btn-change-image:hover {
  background: #aad4f7;
  color: #1e3454;
}

.btn-delete-account {
  background: #fde6e5;
  color: #ce4242;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.98rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}
.btn-delete-account:hover {
  background: #eac1c1;
  color: #901616;
}

.profile-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.form-row label {
  width: 120px;  
  font-weight: 500;
  font-size: 0.98rem;
  color: #254060;
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
  color: #254060;
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

.popup-buttons .btn-save {
  background-color: #cfe8fb;
  color: #254060;
  box-shadow: 0 1px 3px rgba(25, 118, 210, 0.07);
}

.popup-buttons .btn-save:hover {
  background-color: #aad4f7;
  color: #1e3454;
}

.popup-buttons .btn-cancel {
  background-color: #f0f0f0;
  color: #444;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.popup-buttons .btn-cancel:hover {
  background-color: #d9d9d9;
  color: #222;
}
@media (max-width: 768px) {
  .popup-content {
    flex-direction: column;
    width: 90%;
    padding: 16px;
  }
  .avatar-container {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
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

input.invalid,
textarea.invalid,
select.invalid {
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

.error-message {
  margin-top: 0.3rem;
  color: #e74c3c;        
  font-size: 0.85rem;   
  line-height: 1.2;
}
.btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

