<script>
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
