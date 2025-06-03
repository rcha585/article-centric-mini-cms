<script>
  export let user;

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function editProfile() { dispatch('editProfile'); }
  function writeArticle() { dispatch('writeArticle'); }
</script>

<div class="user-sidebar">
  <img class="avatar" src={user.avatar} alt="Avatar" />
  <div class="username">{user.username}</div>
  <div class="intro">{user.introduction}</div>
  
  <button class="edit-btn" on:click={editProfile}>Edit Profile</button>

  <div class="stats">
    <div class="stat liked">
      <span class="icon">❤️</span>
      <span>Liked Posts: {user.likedPosts.toLocaleString()}</span>
    </div>
    <div class="stat subscribers">
      <span class="icon">👤</span>
      <span>Subscribers: {user.subscribers.toLocaleString()}</span>
    </div>
  </div>

  <button class="write-btn" on:click={writeArticle}>Write Article</button>
</div>

<style>
.user-sidebar {
  background: linear-gradient(135deg, #e6ecf6 0%, #f3f7fb 100%);
  border-radius: 12px;
  padding: 32px 16px 24px 16px;
  max-width: 280px;
  box-shadow: 0 2px 16px rgba(60,100,180,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(60,100,180,0.08);
}

.username {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #222f44;
}

.intro {
  color: #48516b;
  font-size: 0.96rem;
  text-align: center;
  margin-bottom: 18px;
  line-height: 1.5;
  min-height: 44px;
}

.edit-btn {
  background: #fff;
  border: 1px solid #a4b5ce;
  border-radius: 8px;
  color: #4567a0;
  padding: 4px 18px;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background-color 0.16s;
}
.edit-btn:hover {
  background: #e8f0fe;
}

.stats {
  width: 100%;
  margin-bottom: 22px;
}
.stat {
  display: flex;
  align-items: center;
  font-size: 0.98rem;
  color: #495a78;
  margin-bottom: 7px;
}
.stat .icon {
  font-size: 1.12rem;
  margin-right: 8px;
}

.write-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 12px 32px;
  font-size: 1.05rem;
  font-weight: bold;
  margin-top: 10px;
  box-shadow: 0 1px 6px rgba(25,118,210,0.10);
  cursor: pointer;
  transition: background-color 0.17s;
}
.write-btn:hover {
  background: #1256a0;
}
</style>
