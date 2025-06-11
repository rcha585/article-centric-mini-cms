<script>
  export let follower;

  function gotoAuthorArticles() {
    window.location.href =
      `/search?author=${encodeURIComponent(follower.username)}&id=${follower.id}`;
  }
</script>

<div class="follow-card">
  <div class="text">
    <div class="name">{follower.username}</div>
    {#if follower.intro}
      <div class="intro">{follower.intro}</div>
    {/if}
  </div>

  <button class="read-btn" on:click={gotoAuthorArticles}>See Author</button>
</div>

<style>
.follow-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,.08);
}

.text   { max-width: 70%; }
.name   { font-weight: 600; color: #254060; }

.intro  {
  font-size: .9rem;
  color: #60748a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.read-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: .9rem;
  transition: background-color .2s;
}
.read-btn:hover { background:#1252a1; }
</style>
