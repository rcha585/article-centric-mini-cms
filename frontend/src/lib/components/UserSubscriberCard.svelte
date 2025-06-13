<script>
  // Receive a `follower` object as a prop from the parent component.
  export let follower;
  // Navigate to the author’s page when the button is clicked.
  function gotoAuthor() {
    window.location.href = `/search?author_id=${follower.id}`;
  }
</script>
<!--
  The main container for each follower card.
  Uses flexbox to lay out avatar, info, and action button side by side.
-->

<!-- Container for username, subscriber count, and intro text -->
<div class="following-card">
  <img class="avatar" src={follower.avatarUrl} alt={follower.username} />
  <div class="info">
    <div class="row">
      <span class="label">Username :</span>
      <span class="username">{follower.username}</span>
    </div>
    <!-- Row showing how many subscribers this follower has -->
    <div class="row-subscribers">
      <span class="subscribers"><i>Subscribers:</i>
      <span class="count">{follower.subscribers ?? '--'}</span></span>
    </div>
    <div class="intro">{follower.intro}</div>
  </div>
  <div class="actions">
    <button class="see-author-btn" on:click={gotoAuthor}>See Author</button>
  </div>
</div>

<style>
.following-card {
  display: flex;
  align-items: center;
  background: #eaf4fc;
  border-radius: 22px;
  box-shadow: 0 3px 16px rgba(164,198,235,0.13);
  padding: 18px 24px;
  margin-bottom: 24px;
  min-height: 120px;
}

.avatar {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 7px #90c3e433;
  margin-right: 18px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.row {
  display: flex;
  align-items: baseline;
  font-size: 1.08rem;
  font-weight: 500;
  margin-bottom: 2px;
  gap: 10px;
}
.row-subscribers {
  margin-bottom: 5px;
}
.subscribers {
  color: #5a6ea0;
  font-size: 1.03rem;
  font-style: italic;
  font-weight: 500;
  margin-left: 0;
}
.count {
  font-weight: 700;
  color: #5066aa;
  font-style: normal;
  margin-left: 3px;
}

.label {
  color: #375a97;
  margin-right: 4px;
  font-weight: 500;
  font-size: 1em;
  letter-spacing: 0.2px;
}

.username {
  color: #23262f;
  font-weight: 700;
  font-size: 1.12em;
  margin-right: 9px;
}

.intro {
  font-size: 1.04rem;
  color: #2d384d;
  margin-top: 2px;
  font-weight: 400;
  white-space: pre-line;
  line-height: 1.5;
  padding-right: 12px;
  word-break: break-word;
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 18px;
  min-width: 110px;
}

.see-author-btn {
  background: #c62828;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 8px 18px;
  font-size: 1.01rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 7px #b8232333;
  transition: background-color 0.13s, box-shadow 0.13s;
  outline: none;
}
.see-author-btn:hover {
  background: #991818;
  box-shadow: 0 3px 14px #ae1e1e21;
}

/* Responsive layout for narrow screens */
@media (max-width: 700px) {
  .following-card { flex-direction: column; align-items: stretch; }
  .avatar { margin: 0 auto 8px auto; }
  .actions { margin-left: 0; margin-top: 14px; align-items: center; }
  .see-author-btn { width: 100%; }
}


</style>
