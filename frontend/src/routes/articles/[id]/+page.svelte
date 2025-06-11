<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  const PUBLIC_API_BASE_URL = "http://localhost:3000/api";
  
  export let data;

  let newComment = "";
  let users = [];
  let filteredUsers = [];
  let showSuggestions = false;
  let mentionQuery = "";
  let mentionedUsers = [];

  // Initialize data
  let { article, user, tags = [], comments: initialComments = [],
     likesCount,  likedByMe,
     subCount,  subscribed,
     me } = data;

  let likes = likesCount;
  let liked = likedByMe;

  let showComments = false;
  let currentUserId = me?.id;
  let articleAuthorId = user?.id;
  
  // if the pageurl has # , it will change showComments to 
  // true so users can navigate to the comment section after clicking the notification
  if ($page.url.hash) {
    showComments = true;
    console.log("check showcomments",showComments);
  };

  let comments = [...initialComments];

  // onMount fetches & comment list if needed
  onMount(async () => {
    // Optionally fetch initial comments instead of data.comments
    try {
      const res2 = await fetch(`${PUBLIC_API_BASE_URL}/articles/${article.id}/comments`);
      if (res2.ok) {
        comments = await res2.json();
      }
    } catch (e) {
      console.error('Failed to load comments', e);
      comments = [];
    }

    // Fetch mentionable users
    try {
      const res3 = await fetch(`${PUBLIC_API_BASE_URL}/users`, {
        credentials: 'include'
      });
      if (res3.ok) users = await res3.json();
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  });

  // handleLike will sync backend and only can like once.
  async function handleLike() {
    if (!me) {
      alert("Please login to like!");
      return;
    }

    let res;

    if (!liked) {
      res = await fetch(`${PUBLIC_API_BASE_URL}/articles/${article.id}/likes`, {
        method: 'POST',
        credentials: 'include'
      });
    } else {
      res = await fetch(`${PUBLIC_API_BASE_URL}/articles/${article.id}/likes`, {
      method: 'DELETE',
      credentials: 'include'
      });
    }

    if (res.status === 401) {
      alert("Please login to like!");
      return;
    }

    if (res.ok || res.status === 409 || res.status === 404) {
      liked = !liked;
      likes += liked ? 1 : -1;
      return;
    }
    
    console.error("failed to like", res.status);
    alert("Failed to like");
  }

  // Toggle comments section
  function toggleComments() {
    showComments = !showComments;
  }

  // Format an ISO date string to locale date
  function formatDate(dateStr) {
    return dateStr ? new Date(dateStr).toLocaleDateString() : "";
  }

  function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString(); // Shows date and time, e.g., "2025-06-10, 11:44:52 AM"
}

  // // Post a new comment
  async function postComment() {
    console.log("postcomment called")
    if (!newComment.trim()) return;
    
    console.log("Posting to:", `${PUBLIC_API_BASE_URL}/articles/${article.id}/comments`);
    const response = await fetch(`${PUBLIC_API_BASE_URL}/articles/${article.id}/comments`, {
      method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include", // if you need session/cookie auth
    body: JSON.stringify({ content: newComment,
    mentioned_user_ids: mentionedUsers})
  });
    mentionedUsers = [];

    console.log("Response status:", response.status);

    if (response.ok) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const posted = await response.json();
    comments = [...comments, posted.comment || posted];
  } else {
    const text = await response.text();
    // display a toast, or re-fetch comments
    // alert("Comment posted!"); 
    // re-fetch the comments from the backend:
    try {
      const updated = await fetch(`${PUBLIC_API_BASE_URL}/articles/${article.id}/comments`);
      if (updated.ok) {
        comments = await updated.json();
      }
    } catch (e) {
      // fallback: do nothing or show error
    }
  }
  newComment = "";
} else {
  const text = await response.text();
  alert("Failed to post comment: " + text);
}

    //handle Enter key for input
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postComment();
    }
  }
  }

   /** Delete a comment by its ID */
  async function deleteComment(commentId) {
    if (!confirm("Really delete this comment?")) return;

    try {
      const res = await fetch(
        `${PUBLIC_API_BASE_URL}/comments/${commentId}`,{
          method: "DELETE",
          // headers: {"Content-Type": "application/json"},
          credentials: "include"
          // body: JSON.stringify({ content: newComment,
          // mentioned_user_ids: [] })
        }
      );

      if (res.ok) {
        // remove from the array so Svelte re-renders
        comments = comments.filter(c => c.comment_id !== commentId);
      } else {
        console.error("Delete failed:", res.status, await res.text());
        alert("Couldn't delete comment");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment");
    }
  }

 

  // Safe Highlighting Functions
  // Prevent XSS by escaping HTML
  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Highlight @mentions in text
  function highlightMentions(text) {
    return escapeHtml(text).replace(
      /@([\w]+)/g,
      '<span class="mention">@$1</span>'
    );
  }

  // Split text into parts: mention vs plain text
  function splitByMentions(text) {
    const parts = [];
    let lastIndex = 0;
    const regex = /@([\w]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), isMention: false });
      }
      parts.push({ text: match[0], isMention: true });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isMention: false });
    }
    return parts;
  }

  // Handle input events to show mention suggestions
  function handleInput(e) {
    const pos = e.target.selectionStart;
    const upToCursor = newComment.slice(0, pos);
    const match = upToCursor.match(/@([\w]*)$/);

    if (match) {
      mentionQuery = match[1];
      filteredUsers = mentionQuery
        ? users.filter(u => u.username.toLowerCase().startsWith(mentionQuery.toLowerCase()))
        : users;
      showSuggestions = filteredUsers.length > 0;
    } else {
      showSuggestions = false;
    }
  }

  // Insert selected username into comment input
  function selectUsername(username) {
    if (!mentionedUsers.includes(username)) {
      mentionedUsers.push(username.id);
    }
    newComment = newComment.replace(/@([\w]*)$/, `@${username.username} `);
    showSuggestions = false;
    mentionQuery = "";
  }

  // Fetch user list when component mounts
  onMount(async () => {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/users`, {
      credentials: 'include'
    });
    if (res.ok) users = await res.json();
    console.log("sss",users);
  });

  let subNumber = subCount;

  async function toggleSub() {
    if (!me) { alert("Login first"); return; }

    const method = subscribed ? "DELETE" : "POST";
    const res = await fetch(
      `${PUBLIC_API_BASE_URL}/subscriptions/${user.id}`,
      { method, credentials:"include" }
    );

    if (res.status === 401) { alert("Login"); return; }
    if (res.ok || res.status === 409 || res.status === 404) {
      subscribed = !subscribed;
      subNumber += subscribed ? 1 : -1;
      return;
    }
    alert("Failed");
  }
</script>

{#if data.error}
  <div class="article-page-wrapper">
    <div class="article-card error-card">
      <div class="center error">Article Not Found.</div>
      <a href="/" class="back-link">Return to articles list</a>
    </div>
  </div>
{:else}
  <div class="article-page-wrapper">
    <div class="article-card">
      <h1 class="article-title">{article.title}</h1>
      <div class="article-meta">
        <span>Published on {formatDate(article.created_at)}</span>
        {#if user}<span>Written by {user.username}</span>{/if}
      </div>

      <div class="author-subscribe">
        <div class="author-info">
          <img class="avatar" src={user?.avatarUrl ? `http://localhost:5173${user.avatarUrl}` : "/avatars/avatar-1.png"} alt="author" />
          <div>
            <div class="name">{user ? `${user.username}` : "Anonymous"}</div>
            <div class="followers">{subNumber} Subscribers</div>
          </div>
        </div>
        {#if me && me.id !== user.id}
          <button class="btn-subscribe"
                  class:subbed={subscribed}
                  on:click={toggleSub}>
            {#if subscribed}Subscribed{:else}Subscribe{/if}
          </button>
        {/if}
      </div>

      <div class="tags-row">
        <span>Tags:</span>
        {#each tags as tag}
          <a 
            href={`/search?tag=$${encodeURIComponent(tag.content)}&id=${tag.id}`}
            class="tag"
          >
            {`#${tag.content}`}
          </a>
        {/each}
      </div>

      <img
        class="article-image"
        src={article.image_path?.trim() ? `http://localhost:3000/${article.image_path}` : "/default-image.jpg"}
        alt="cover"
        on:error={(e) => (e.target.src = "/default-image.jpg")}
      />

      <div class="article-content">{@html article.content}</div>

      <!-- Likes feature -->
      <button class="btn-like" class:liked={me && liked} on:click={handleLike}>
        {#if me && liked} ❤️ {:else} 🤍 {/if} {likes}
      </button>

      <div class="comments-section">
        <div class="comments-header">
          <span>Comments</span>
          <button class="btn-toggle" on:click={toggleComments}>{showComments ? 'Hide' : 'Show'} Comments</button>
        </div>

        {#if showComments}
          {#if comments.length === 0}
            <div class="no-comments">No comments yet.</div>
          {:else}
            {#each comments as c}
              <div class="comment-item" id={"commentid-"+c.user_id+c.comment_id}>
                <img class="avatar-sm" src={`/${c.avatar_path}`} alt="avatar" />
                <div>
                  <div class="comment-user">{c.username}</div>
                  <div class="comment-content">
                    {#each splitByMentions(c.content) as part}
                      {#if part.isMention}<span class="mention">{part.text}</span>
                    {:else}
                      {part.text}
                    {/if}
                    {/each}
                  </div>
                  <div class="comment-meta">
                    <span class="comment-date">{formatDateTime(c.created_at)}</span>
                    {#if currentUserId === articleAuthorId || currentUserId === c.user_id}
                      <!-- ✂️ Delete button -->
                      <button class="btn-delete" on:click={() => deleteComment(c.comment_id)}>
                        Delete
                      </button>
                    {/if}
                </div>
              </div>
            </div>
            {/each}
          {/if}

          <div class="comment-input-row">
            <input
              type="text"
              placeholder="Add a comment..."
              bind:value={newComment}
              on:input={handleInput}
              on:keydown={(e) => {
                if (showSuggestions && e.key === 'ArrowDown') {
                  const first = document.querySelector('.mention-suggestions li');
                  first?.focus();
                } else if (e.key === 'Enter' && !showSuggestions) postComment();
              }}
            />
            <button class="btn-toggle" on:click={()=>{postComment()}}>Comment</button>

            {#if showSuggestions}
              <ul class="mention-suggestions">
                {#each filteredUsers as u}<li tabindex="0" on:click={() => selectUsername(u)}>{u.username}</li>{/each}
              </ul>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .article-page-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 48px 0;
    background: linear-gradient(90deg, #1e3a8a, #93c5fd);
  }

  .article-card {
    width: 80vw;
    max-width: 800px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1.5px solid rgba(255,255,255,0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.14);
    padding: 2rem;
    color: #212736;
  }

  h1.article-title {
    font-size: 2rem;
    font-weight: 700;
    color: #f6f6f6;
    margin-bottom: 8px;
  }

  .article-meta {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }

  .author-subscribe {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar, .avatar-sm {
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
    border: 1px solid #e6ecf5;
  }

  .avatar { width: 100px; height: 100px; border: 2px solid #bfdbfe; }
  .avatar-sm { width: 30px; height: 30px; }

  .name { font-weight: 600; color: #101c3e; }
  .followers { font-size: 1rem; color: #ffffff; }

  .btn-subscribe {
    background: #e0edfa;
    color: #2563eb;
    border: none;
    border-radius: 7px;
    padding: 8px 24px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 12px #bae6fd33;
    transition: background-color 0.2s;
  }
  .btn-subscribe:hover { background: #bcdffb; }

  .tags-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 1rem;
  }
  .tags-row a {
    text-decoration: none;
  }
  .tag { background: #e0edfa; color: #225ca3; padding: 3px 13px; border-radius: 15px; border: 1px solid #b6cbec; }

  .article-image {
    width: 100%;
    max-height: 330px;
    object-fit: cover;
    border-radius: 8px;
    margin: 18px 0;
    display: block;
  }

  .article-content {
    background: rgba(255,255,255,0.85);
    border-radius: 8px;
    padding: 1rem;
    line-height: 1.7;
    margin-bottom: 18px;
  }

  .btn-like {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 18px;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    cursor: pointer;
    box-shadow: 0 2px 8px #fb71855a;
    transition: background-color .22s;
    background: #fee2e2;
    color: #e11d48;
    margin-bottom: 20px;
  }
  .btn-like.liked,
  .btn-like:hover { background: #fca5a5; color: #fff; }

  .comments-section {
    border-top: 1px solid #e6ecf5;
    padding-top: 13px;
  }

  .comments-header {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    font-size: 1.1em;
    color: #1e3a8a;
    margin-bottom: 10px;
  }

  .comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  }

  .btn-delete {
  background: transparent;
  border: none;
  color: #e11d48;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0;
  }

  .btn-delete:hover {
  text-decoration: underline;
  }

  .btn-toggle {
    background: #e8f1fd;
    color: #2563eb;
    border: none;
    border-radius: 5px;
    padding: 6px 15px;
    cursor: pointer;
    box-shadow: 0 1px 8px #93c5fd25;
    transition: background-color 0.2s;
  }
  .btn-toggle:hover { background: #bfdbfe; }

  .no-comments { color: #7898ba; }

  .comment-item { display: flex; gap: 10px; margin: 10px 0; }

  .comment-user { font-weight: 500; color: #315ca8; }
  .comment-content { background: #f8f8f8; padding: 4px 13px; border-radius: 7px; }
  .comment-date { font-size: .88em; color: #94a3b8; margin-top: 2px; }

  .comment-input-row { position: relative; display: flex; gap: 8px; margin-top: 8px; }
  .comment-input { padding: 8px; border-radius: 6px; border: 1.3px solid #fff; width: 210px; }

  .mention-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    background: #fff;
    border: 1px solid #e0e7ef;
    border-radius: 6px;
    max-height: 130px;
    overflow-y: auto;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    width: 210px;
    z-index: 10;
    list-style: none;
    margin: 4px 0;
    padding: 0;
  }
  .mention-suggestions li { padding: 6px 12px; cursor: pointer; }
  .mention-suggestions li:hover { background: #c7ebff; }

  .mention { color: #eb2525; font-weight: 600; background: #fff; padding: 1px 4px; border-radius: 5px; }

  .error-card { background: rgba(255,255,255,0.33); border-color: #fecaca; }
</style>
