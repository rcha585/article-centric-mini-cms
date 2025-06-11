<script>
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { currentUser } from "$lib/stores/currentUser";

  const PUBLIC_API_BASE_URL = "http://localhost:3000/api";

  let username = "";
  let password = "";
  let showPassword = false;
  const errorMessage = writable(null);

  async function handleLogin() {
    errorMessage.set(null);

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        if (response.status === 400) {
          const txt = await response.text();
          errorMessage.set(txt || "Wrong username or password");
        } else if (response.status === 401) {
          errorMessage.set("Authentication failed. Please check your credentials.");
        } else {
          errorMessage.set("An unexpected error occurred. Please try again later.");
        }
        return;
      }

      const meResponse = await fetch(`${PUBLIC_API_BASE_URL}/auth/me`, {
        credentials: "include"
      });
      if (meResponse.ok) {
        const userData = await meResponse.json();
        currentUser.set(userData);
      } else {
        currentUser.set(null);
      }

      goto("/");
    } catch (error) {
      console.error("Login error:", error);
      errorMessage.set("Could not connect to the server. Please check your network.");
    }
  }
</script>


<div class="page-wrapper">
  <section class="left-panel">
    <div class="login-container">
      <h1>WELCOME BACK</h1>
      <p class="subtitle">Please enter your details.</p>

      {#if $errorMessage}
        <div class="error">{$errorMessage}</div>
      {/if}

      <form on:submit|preventDefault={handleLogin}>
        <div class="field">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            required
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          {#if showPassword}
            <input
              type="text"
              id="password"
              bind:value={password}
              required
            />
          {:else}
            <input
              type="password"
              id="password"
              bind:value={password}
              required
            />
          {/if}
        </div>

        <div class="show-password">
          <input type="checkbox" id="show-password" bind:checked={showPassword} />
          <label for="show-password">Show Password</label>
        </div>
        <button class="btn" type="submit" disabled={!username || !password}>Sign in</button>
      </form>

      <div class="signup-link">
        Don't have an account?
        <a href="/register">Sign up to free!</a>
      </div>
    </div>
  </section>

  <section class="right-panel">
    <img src="/reading.jpg" alt="Reading" class="login-image" />
  </section>
</div>

<style>

  .page-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    gap: 1rem;
    max-width: 1200px;    
    margin: 2rem 0 auto;
    padding: 2rem;
    height: 100vh;
    background: linear-gradient(90deg,#2d4a6e 30%,#7eb3d1 100%);
  }
  
  .left-panel {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .right-panel {
    display: flex;
    flex: 0 0 40%;
    max-width: 360px;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .login-container {
    background: rgba(255, 255, 255, 0.15);
    color: #111;
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    max-width: 360px;
    width: 100%;
    padding: 2rem 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .login-container h1 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    text-align: center;
    color: #f0f9ff;   
  }

  .login-container .subtitle {
    margin: 0;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    opacity: 0.85;
    text-align: center;
    color: #d0e7f7;
  }
  
  .login-container form > .field {
    margin-bottom: 1.25rem;
  }

  .login-container label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    color: #e5e7eb;
  }

  .login-container input[type="text"],
  .login-container input[type="password"] {
    width: 90%;
    padding: 0.6rem 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(61, 90, 128, 0.5);
    color: #ffffff;
    font-size: 1rem;
  }

  .login-container input:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
  }

  .login-container .show-password {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: #e5e7eb;
    font-size: 0.9rem;
  }
 
  .login-container .btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    background: #5c7a99;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .login-container .btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(96,165,250,0.6);
  }

  .login-container .btn:disabled {
    background: rgba(92, 122, 153, 0.5);
    cursor: not-allowed;
  }

  .login-container .btn:not(:disabled):hover {
    background: #3d5a80;
  }

  .login-container .error {
    background-color: rgba(239, 68, 68, 0.9);
    color: #ffffff;
    padding: 0.6rem;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .login-container .signup-link {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #c4e0f0;
  }

  .login-container .signup-link a {
    color: #98c1d9;
    text-decoration: none;
    font-weight: 500;
  }

  .login-container .signup-link a:hover {
    text-decoration: underline;
    color: #3d5a80;
  }

  .login-image {
    width: 100%;
    height: auto;
    max-height: none;
    object-fit: contain;
    filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.7));
    animation: imageGlow 3s ease-in-out infinite;
  }

  @media screen and (min-width: 1200px) {
    .right-panel {
      flex: 0 0 360px;
      max-width: 1200px; 
      margin: 0 auto;
    }
  }
</style>
