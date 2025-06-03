<<<<<<< HEAD
<!-- src/routes/user/+page.svelte -->
<script>
  // In a real app, you’d fetch the current user’s data in a load function or via a store
  let currentUser = {
    name: 'Jane Doe',
    avatar: '/avatars/jane_doe.jpg',
    bio: 'Front-end developer and content writer.'
  };
</script>

<section class="profile-page">
  <img src={currentUser.avatar} alt="Avatar" class="profile-avatar" />
  <h2>{currentUser.name}</h2>
  <p>{currentUser.bio}</p>
  <a href="/user/edit" class="edit-profile-link">Edit Profile</a>
</section>

<style>
  .profile-page {
    max-width: 600px;
    margin: 2rem auto;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    text-align: center;
  }
  .profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
  }
  .edit-profile-link {
    display: inline-block;
    margin-top: 1rem;
    color: #2980b9;
    text-decoration: none;
  }
  .edit-profile-link:hover {
    text-decoration: underline;
  }
=======
<script>
  export let data;
  import UserProfileSidebar from '$lib/components/UserProfileSidebar.svelte';
  import UserArticleCard from '$lib/components/UserArticleCard.svelte';

  let currentTab = "overview";

  let { user, myArticles, likedArticles, myComments } = data;

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
      on:editProfile={handleEditProfile}
      on:writeArticle={handleWriteArticle}
    />
  </aside>

  
  <section class="user-content">
    
    <div class="user-tab-bar">
      <button
        class:active={currentTab === "overview"}
        on:click={() => currentTab = "overview"}
      >Overview</button>
      <button
        class:active={currentTab === "liked"}
        on:click={() => currentTab = "liked"}
      >Liked</button>
      <button
        class:active={currentTab === "comments"}
        on:click={() => currentTab = "comments"}
      >Comments</button>
    </div>

    {#if currentTab === 'overview'}
      <div class="articles-feed">
        {#if myArticles.length === 0}
          <div class="empty-feed">No articles at the moment, write a new ~~</div>
        {:else}
          {#each myArticles as article (article.id)}
            <UserArticleCard {article}
              on:edit={handleArticleEdit}
              on:readmore={handleReadMore}
            />
          {/each}
          <!-- Load More, future extension -->
          <button class="load-more-btn">Load More</button>
        {/if}
      </div>
    {:else if currentTab === 'liked'}
      <div class="articles-feed">
        {#if likedArticles.length === 0}
          <div class="empty-feed">Have no liked</div>
        {:else}
          {#each likedArticles as article (article.id)}
            <UserArticleCard {article} on:readmore={handleReadMore} />
          {/each}
        {/if}
      </div>
    {:else if currentTab === 'comments'}
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
  transition: background-color 0.13s, color 0.13s;
  outline: none;
}
.user-tab-bar button.active,
.user-tab-bar button:hover {
  background: #f2f7ff;
  color: #1751a1;
  border-bottom: 2.5px solid #3788e7;
}

/* Feed区样式 */
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

.load-more-btn {
  margin: 24px auto 0 auto;
  display: block;
  background: #2567c5;
  color: #fff;
  padding: 9px 36px;
  border-radius: 99px;
  font-size: 1.04rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #b3cdf240;
  transition: background-color 0.16s;
}
.load-more-btn:hover {
  background-color: #14437b;
}

/* 评论区样式 */
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
>>>>>>> origin/main
</style>
