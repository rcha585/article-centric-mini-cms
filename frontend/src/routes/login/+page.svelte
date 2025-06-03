<script>
<<<<<<< HEAD
  import { goto } from "$app/navigation";
  import { AUTH_URL, REGISTER_URL, USERNAME_CHECK_URL } from "$lib/js/api-urls.js";

  let isRegistering = false;

  // Login form
  let username = "";
  let password = "";
  let loginError = false;

  // Registration form
  let regName = "";
  let regDOB = "";
  let regUsername = "";
  let regPassword = "";
  let regPassword2 = "";
  let regBio = "";
  let regAvatar = "";
  let usernameAvailable = null;
  let regError = "";
  let regSuccess = "";

  $: passwordMismatch = regPassword && regPassword2 && regPassword !== regPassword2;

  async function handleLogin() {
    loginError = false;
    const response = await fetch(AUTH_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (response.status === 401) {
      loginError = true;
    } else {
      goto("/", { invalidateAll: true, replaceState: true });
    }
  }

  async function checkUsernameAvailability() {
    if (!regUsername) {
      usernameAvailable = null;
      return;
    }
    const res = await fetch(`${USERNAME_CHECK_URL}?username=${encodeURIComponent(regUsername)}`);
    const data = await res.json();
    usernameAvailable = data.available;
  }

  async function handleRegister() {
    regError = "";
    regSuccess = "";

    if (passwordMismatch) {
      regError = "Passwords do not match.";
      return;
    }

    if (!usernameAvailable) {
      regError = "Username is taken.";
      return;
    }

    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: regName,
        dob: regDOB,
        username: regUsername,
        password: regPassword,
        bio: regBio,
        avatar: regAvatar
      })
    });

    if (response.ok) {
      regSuccess = "Account created successfully. You may now log in.";
      isRegistering = false;
    } else {
      const data = await response.json();
      regError = data.error || "Registration failed.";
    }
  }
</script>

<svelte:head>
  <title>{isRegistering ? "Register" : "Login"}</title>
</svelte:head>

<h1>{isRegistering ? "Register" : "Login"}</h1>

<form on:submit|preventDefault={isRegistering ? handleRegister : handleLogin}>
  {#if isRegistering}
    <label for="name">Name:</label>
    <input type="text" name="name" bind:value={regName} required />

    <label for="dob">Date of Birth:</label>
    <input type="date" name="dob" bind:value={regDOB} required />

    <label for="regUsername">Username:</label>
    <input type="text" name="regUsername" bind:value={regUsername} on:input={checkUsernameAvailability} required />
    {#if regUsername}
      <span class="info">
        {#if usernameAvailable === true}
          ✅ Username available
        {:else if usernameAvailable === false}
          ❌ Username taken
        {/if}
      </span>
    {/if}

    <label for="bio">Bio:</label>
    <textarea name="bio" bind:value={regBio}></textarea>

    <label for="avatar">Avatar:</label>
    <select name="avatar" bind:value={regAvatar} required>
      <option value="">Select avatar</option>
      <option value="dragonite.png">Dragonite</option>
      <option value="pikachu.png">Pikachu</option>
      <option value="mewtwo.png">Mewtwo</option>
    </select>

    <label for="regPassword">Password:</label>
    <input type="password" name="regPassword" bind:value={regPassword} required />

    <label for="regPassword2">Confirm Password:</label>
    <input type="password" name="regPassword2" bind:value={regPassword2} required />

    {#if passwordMismatch}
      <span class="error">❌ Passwords do not match</span>
    {/if}

    {#if regError}
      <span class="error">{regError}</span>
    {/if}

    {#if regSuccess}
      <span class="success">{regSuccess}</span>
    {/if}

  {:else}
    <label for="username">Username:</label>
    <input type="text" name="username" bind:value={username} required />

    <label for="password">Password:</label>
    <input type="password" name="password" bind:value={password} required />

    {#if loginError}
      <span class="error">Could not log in with those credentials, please try again.</span>
    {/if}
  {/if}

  <button type="submit">{isRegistering ? "Register" : "Login"}</button>

  <p style="grid-column: 1 / 3;">
    {isRegistering ? "Already have an account?" : "Need an account?"}
    <a href="#" on:click|preventDefault={() => (isRegistering = !isRegistering)}>
      {isRegistering ? "Login here" : "Register here"}
    </a>
  </p>
</form>

<style>
  form {
    margin: auto;
    max-width: 500px;
    border: 1px dashed green;
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  button {
    grid-column: 1 / 3;
  }

  .error {
    grid-column: 1 / 3;
    font-weight: bold;
    color: darkred;
    background-color: lightcoral;
    padding: 5px;
    text-align: center;
  }

  .success {
    grid-column: 1 / 3;
    font-weight: bold;
    color: green;
    background-color: lightgreen;
    padding: 5px;
    text-align: center;
  }

  .info {
    grid-column: 1 / 3;
    font-size: 0.9rem;
    color: gray;
  }
</style>
=======
const PUBLIC_API_BASE_URL = "http://localhost:3000/api";
import { writable } from "svelte/store";
import { goto } from "$app/navigation";


let username = "";
let password = "";
let showPassword = false;

const errorMessage = writable(null);

async function handleLogin() {
    errorMessage.set(null);

    try {
        const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            goto("/");
        } else if (response.status === 400) {
            const text = await response.text();
            errorMessage.set(text || "Wrong username or password");
        } else if (response.status === 401) {
            errorMessage.set("Authentication failed. Please check your credentials.");
        } else {
            errorMessage.set("An unexpected error occurred. Please try again later.");
        }
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
                    <input type="text" id="username" bind:value={username} placeholder="Enter your username" required />
                </div>
                
                <div class="field">
                    <label for="password">Password</label>
                    {#if showPassword}
                    <input type="text" id="password" bind:value={password} placeholder="Enter your password" required />
                    {:else}
                    <input type="password" id="password" bind:value={password} placeholder="Enter your password" required />
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
        <img src="/reading.webp" alt="Reading" class="login-image" />
    </section>
</div>




<style>
.page-wrapper {
    display: flex;
    width: 100%;
    height: 100vh; 
    background: linear-gradient(90deg, #1e3a8a 0%, #93c5fd 100%);
}

.left-panel {
    flex: 1; 
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.right-panel {
    flex: 1; 
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 2rem;
}

.login-image {
    max-width: 100%;
    max-height: 100%;
}

.login-container {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    max-width: 360px;
    width: 100%;
    padding: 2rem 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    color: #111;
}

.login-container h1 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 2rem;
    text-align: center;
    color: #ffffff; 
}

.login-container .subtitle {
    margin: 0;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    opacity: 0.85;
    text-align: center;
    color: #f3f4f6; 
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
    color: #ffffff;
    font-size: 1rem;
}

.login-container input::placeholder {
    color: rgba(255, 255, 255, 0.7);
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
    background: #3b82f6; 
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-container .btn:disabled {
    background: rgba(59, 130, 246, 0.5);
    cursor: not-allowed;
}

.login-container .btn:not(:disabled):hover {
        background: #2563eb; 
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
    color: #f3f4f6;
}

.login-container .signup-link a {
    color: #bfdbfe;
    text-decoration: none;
    font-weight: 500;
}

.login-container .signup-link a:hover {
    text-decoration: underline;
}

.login-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

</style>
>>>>>>> origin/main
