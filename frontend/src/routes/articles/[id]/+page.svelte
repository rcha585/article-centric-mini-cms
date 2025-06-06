<script>
  import { onMount } from 'svelte';

  export let data;

  let liked = false;
  let showComments = false;
  let newComment = "";
  let users = [];
  let filteredUsers = [];
  let showSuggestions = false;
  let mentionQuery = "";

  const article = data.article;
  const user = data.user;
  const tags = data.tags || [];
  let likes = data.likes || 0;
  let comments = data.comments ? [...data.comments] : [];

  function handleLike() {
    liked = !liked;
    likes += liked ? 1 : -1;
  }
  function toggleComments() {
    showComments = !showComments;
  }
  
  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  }

  function postComment() {
  if (!newComment.trim()) return;

  comments = [
    ...comments,
    {
      id: comments.length ? Math.max(...comments.map(c => c.id)) + 1 : 1,
      username: "currentuser",  // Replace with actual username if you have authentication
      content: newComment,
      created_at: new Date().toISOString()
    }
  ];
  newComment = "";
}

  // Fetch all users on mount
  onMount(async () => {
    const res = await fetch("/api/users"); // Adjust this URL to your backend!
    if (res.ok) {
      users = await res.json();
    }
  });
  

  function handleInput(e) {
  const cursorPos = e.target.selectionStart;
  const upToCursor = newComment.slice(0, cursorPos);
  const value = newComment.slice(0, cursorPos);

  // Try to find “@” plus any trailing letters (if any)
  const atMatch = upToCursor.match(/@([a-zA-Z0-9_]*)$/);

  if (atMatch) {
    // atMatch[1] is the part after the “@”
    mentionQuery = atMatch[1];
    if (mentionQuery.length > 0) {
      filteredUsers = users.filter(u =>
        u.username.toLowerCase().startsWith(mentionQuery.toLowerCase())
      );
    } else {
      // If they’ve only typed “@” (no characters after), show ALL users
      filteredUsers = users;
    }
      showSuggestions = filteredUsers.length > 0;
    } else {
    showSuggestions = false;
  }
}

function selectUsername(username) {
  // Replace the @mentionQuery with @username in the input
  newComment = newComment.replace(/@([a-zA-Z0-9_]*)$/, `@${username} `);
  showSuggestions = false;
  mentionQuery = "";
}

 // --- ADD THESE FOR SAFE HIGHLIGHTING ---

function escapeHtml(text) {
    // Prevent XSS by escaping HTML except our mentions
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

function highlightMentions(text) {
    // 1. Escape HTML
    // 2. Replace @username with <span class="mention">@username</span>
    return escapeHtml(text).replace(
      /@([a-zA-Z0-9_]+)/g,
      '<span class="mention">@$1</span>'
    );
  }

  function splitByMentions(text) {
    const parts = [];
    let lastIndex = 0;
    const regex = /@([a-zA-Z0-9_]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // If there was plain text before this mention, push it first
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), isMention: false });
      }
      // Push the mention itself
      parts.push({ text: match[0], isMention: true });
      lastIndex = match.index + match[0].length;
    }

    // If anything remains after the last mention, push it as plain text
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isMention: false });
    }

    return parts;
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
        {#if user}
          <span>· Written by {user.first_name} {user.last_name}</span>
        {/if}
      </div>

      <div class="author-row">
        <img class="author-avatar" src={"/" + (user?.avatar_path || "avatars/avatar1.png")} alt="author" />
        <div class="author-info">
          <div class="author-name">{user ? `${user.first_name} ${user.last_name}` : "Anonymous"}</div>
          <div class="author-followers">{user?.followers || "0"} followers</div>
        </div>
        <button class="btn btn-subscribe">Subscribe</button>
      </div>

      <div class="tags-row">
        <div class="tags-label">Tags:</div>
        <div class="tags-list">
          {#each tags as tag}
            <span class="tag">{tag.content}</span>
          {/each}
        </div>
      </div>

      <!-- if cannot find picture, use defualt picture -->
      <img
        class="article-image"
        src={article.image_path && article.image_path.trim()
          ? `http://localhost:3000/${article.image_path}`
          : "/default-image.jpg"}
        alt="cover"
        on:error={(e) => (e.target.src = "/default-image.jpg")}
      />
      <div class="article-content">{@html article.content}</div>

      <button class="btn btn-like {liked ? 'liked' : ''}" on:click={handleLike}>
        <span>{liked ? "❤️" : "🤍"}</span>
        {likes}
      </button>

      <div class="comments-section">
        <div class="comments-header">
          <span>Comments</span>
          <button class="btn btn-toggle" on:click={toggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>
        {#if showComments}
          {#if comments.length === 0}
            <div class="no-comments">No comments yet.</div>
          {:else}
            {#each comments as c}
              <div class="comment-item">
                <img class="comment-avatar" src={"/avatars/avatar" + ((c.id % 10) + 1) + ".png"} alt="avatar"/>
                <div>
                  <div class="comment-username">{c.username}</div>
                  <div class="comment-content">
                   {#each splitByMentions(c.content) as part}
                      {#if part.isMention}
                        <span class="mention">{part.text}</span>
                      {:else}
                        {part.text}
                      {/if}
                    {/each}
                  </div>
                  <div class="comment-date">{formatDate(c.created_at)}</div>
                </div>
              </div>
            {/each}
          {/if}
          
        <div class="comment-input-row">
            <input
              type="text"
              placeholder="Add a comment..."
              class="comment-input"
              bind:value={newComment}
              on:input={handleInput}
              on:keydown={(e) => {
                // Support Enter for submitting, ArrowDown for suggestions
                if (showSuggestions && e.key === "ArrowDown") {
                  // Focus first suggestion (optional, for advanced UX)
                  // (optional) move focus to the first suggestion
                  const first = document.querySelector('.mention-suggestions li');
                  if (first) first.focus();
                } else if (e.key === 'Enter' && !showSuggestions) {
                  postComment();
                }
              }}
            />
            <button class="btn btn-toggle" style="margin-left:8px;" on:click={postComment}>
              Comment
            </button>
            {#if showSuggestions}
              <ul class="mention-suggestions">
                {#each filteredUsers as u}
                  <li tabindex="0" on:click={() => selectUsername(u.username)}>{u.username}</li>
                {/each}
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
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background: linear-gradient(90deg, #1e3a8a 0%, #93c5fd 100%);
        padding: 48px 0;
    }

    .article-card {
        width: 80vw;
        max-width: 800px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        border: 1.5px solid rgba(255,255,255,0.3);
        box-shadow: 0 8px 32px rgba(0,0,0,0.14);
        padding: 2.3rem 2rem 2rem 2rem;
        margin-bottom: 40px;
        color: #222;
    }

    .article-title {
        font-size: 2.1rem;
        font-weight: 700;
        margin-bottom: .6rem;
        color: #fff;
        text-shadow: 0 2px 8px #1e40af20;
        text-align: center;
    }

    .article-meta {
        color: #e0e7ef;
        font-size: 1rem;
        margin-bottom: 1.2rem;
        font-weight: 400;
        text-align: center;
    }

    .author-row {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 1.2rem;
        justify-content: center;
    }
    .author-avatar {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #bfdbfe;
        background: #fff;
    }
    .author-info {
        text-align: left;
    }
    .author-name {
        font-weight: 600;
        color: #1e3a8a;
    }
    .author-followers {
        font-size: .97em;
        color: #7898ba;
    }
    .btn-subscribe {
        padding: 7px 24px;
        background: #e0edfa;
        color: #225ca3;
        border: none;
        border-radius: 7px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        box-shadow: 0 2px 12px #bae6fd33;
    }
    .btn-subscribe:hover {
        background: #bcdffb;
    }

    .tags-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 1.1rem;
        justify-content: center;
    }
    .tags-label {
        font-weight: 500;
        color: #1e3a8a;
    }
    .tag {
        background: #e0edfa;
        color: #225ca3;
        font-size: .99em;
        padding: 3px 13px;
        border-radius: 15px;
        border: 1px solid #b6cbec;
    }

    .article-image {
        width: 100%;
        max-height: 330px;
        object-fit: cover;
        border-radius: 8px;
        border: 1.5px solid #e6ecf5;
        margin: 18px 0;
        background: #fff;
        display: block;
    }

    .article-content {
        margin-bottom: 18px;
        font-size: 1.16em;
        line-height: 1.7;
        color: #2e3a4c;
        background: rgba(255,255,255,0.3);
        border-radius: 8px;
        padding: 1.1rem 1.2rem .5rem 1.2rem;
        min-height: 84px;
    }

    /* 错误卡片风格 */
    .error-card {
        border-color: #fecaca;
        background: rgba(255,255,255,0.33);
    }

    .btn-like {
        display: inline-flex;
        align-items: center;
        border: none;
        background: #fee2e2;
        color: #e11d48;
        cursor: pointer;
        font-size: 1em;
        gap: 4px;
        margin-top: 10px;
        padding: 7px 18px;
        border-radius: 8px;
        box-shadow: 0 2px 8px #fb71855a;
        transition: background-color .22s;
    }
    .btn-like.liked,
    .btn-like:hover {
        background: #fca5a5;
        color: #fff;
    }

    .comments-section {
        margin-top: 23px;
        border-top: 1.3px solid #e6ecf5;
        padding-top: 13px;
    }
    .comments-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        font-size: 1.09em;
        margin-bottom: 10px;
        color: #1e3a8a;
    }
    .btn-toggle {
        background: #e8f1fd;
        color: #2563eb;
        border: none;
        border-radius: 5px;
        padding: 6px 15px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        box-shadow: 0 1px 8px #93c5fd25;
    }
    .btn-toggle:hover {
        background: #bfdbfe;
    }
    .no-comments {
        color: #7898ba;
        font-size: .98em;
        margin-bottom: 9px;
    }
    .comment-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 10px 0;
    }
    .comment-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid #e6ecf5;
        background: #fff;
    }
    .comment-username {
        font-weight: 500;
        color: #315ca8;
        font-size: 1em;
        margin-bottom: 2px;
    }
    .comment-content {
        background: #f6f8fb;
        border-radius: 7px;
        padding: 4px 13px;
        font-size: .97em;
        color: #223350;
    }
    .comment-date {
        font-size: .88em;
        color: #94a3b8;
        margin-top: 2px;
    }
    .comment-input-row {
        display: flex;
        align-items: center;
        margin-top: 8px;
    }
    .comment-input {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1.3px solid #dde6f5;
        width: 210px;
        background: #fff;
        font-size: 1em;
        color: #1e293b;
        transition: border-color 0.22s;
    }
    .comment-input:focus {
        border-color: #60a5fa;
        outline: none;
    }

    .mention-suggestions {
        position: absolute;
        background: #fff;
        border: 1px solid #e0e7ef;
        border-radius: 6px;
        max-height: 130px;
        overflow-y: auto;
        box-shadow: 0 4px 24px #aaa7;
        margin-top: 5px;
        width: 210px;
        z-index: 10;
        list-style: none;
        padding: 0;
    }
      .mention-suggestions li {
        padding: 6px 12px;
        cursor: pointer;
        transition: background 0.12s;
    }
      .mention-suggestions li:hover {
        background: #c7ebff;
    }
      .comment-input-row {
        position: relative; /* So .mention-suggestions is positioned absolutely inside */
    }

      .mention {
        color: rgb(235, 37, 37);
        font-weight: 600;
        background: #e0f2fe;
        border-radius: 5px;
        padding: 1px 4px;
    }

</style>
