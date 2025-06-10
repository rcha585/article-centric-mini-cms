<script>
  const PUBLIC_API_BASE_URL = "http://localhost:3000/api";
  const PUBLIC_IMAGES_URL = "http://localhost:3000/images";

  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";

  let avatarList = [
    { id: 1, path: '/avatars/avatar1.png' },
    { id: 2, path: '/avatars/avatar2.png' },
    { id: 3, path: '/avatars/avatar3.png' },
    { id: 4, path: '/avatars/avatar4.png' },
    { id: 5, path: '/avatars/avatar5.png' },
    { id: 6, path: '/avatars/avatar6.png' },
    { id: 7, path: '/avatars/avatar7.png' },
    { id: 8, path: '/avatars/avatar8.png' },
    { id: 9, path: '/avatars/avatar9.png' },
    { id: 10, path: '/avatars/avatar10.png' }
  ];
  let selectedAvatarId = 1;

  let username = "";
  let lastName = "";
  let firstName = "";
  let password = "";
  let confirmPassword = "";
  let dateOfBirth = "";
  let description = "";

  let isPasswordVisible = false;
  let isConfirmPasswordVisible = false;
  let passwordInput;
  let confirmPasswordInput;
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const dd = String(now.getDate()).padStart(2, '0');
  const today = `${yyyy}-${mm}-${dd}`; // Format as YYYY-MM-DD


  function togglePasswordVisibility() {
    isPasswordVisible = !isPasswordVisible;
    if (passwordInput) {
      passwordInput.type = isPasswordVisible ? "text" : "password";
    }
  }

  function toggleConfirmPasswordVisibility() {
    isConfirmPasswordVisible = !isConfirmPasswordVisible;
    if (confirmPasswordInput) {
      confirmPasswordInput.type = isConfirmPasswordVisible ? "text" : "password";
    }
  }

  const usernameTaken = writable(false);
  const passwordMismatch = writable(false);
  const isSubmitting = writable(false);
  const formError = writable(null);

  let showSuccess = false;

  function selectAvatar(id) {
    selectedAvatarId = id;
  }

  let checkTimeout;
  $: {
    clearTimeout(checkTimeout);
    const name = username.trim();
    if (name.length>=3) {
      checkTimeout = setTimeout(() => {
        checkUsernameAvailability(name);
      }, 300);
    } else {
      usernameTaken.set(false);
    }
  }

  async function checkUsernameAvailability(name) {
    try {
      const response = await fetch(
        `${PUBLIC_API_BASE_URL}/users/check-username?username=${encodeURIComponent(name)}`,

      );
      usernameTaken.set(response.status === 200);
    } catch (error) {
      console.error("Error checking username availability", error);
      usernameTaken.set(false);
    }
  }

  $: passwordMismatch.set(
    password !== "" && confirmPassword !== "" && password !== confirmPassword
  );

  async function handleRegister(event) {
    event.preventDefault();
    formError.set(null);
    if (dateOfBirth && new Date(dateOfBirth) > new Date(today)) {
      formError.set("Date of birth cannot be in the future");
      return;
    }

    if ($usernameTaken) {
      formError.set("Username is already taken");
      return;
    }

    if ($passwordMismatch) {
      formError.set("Passwords do not match");
      return;
    }

    if (!dateOfBirth) {
      formError.set("Please select your date of birth");
      return;
    }

    isSubmitting.set(true);

    try {
      const payload = {
        username: username.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        password: password,
        date_of_birth: dateOfBirth,
        description: description.trim(),
        avatar_id: selectedAvatarId
      };

      const response = await fetch(`${PUBLIC_API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showSuccess = true;
      } else if (response.status === 400) {
        const json = await response.json();
        formError.set(json.errors ? json.errors.join(", ") : "Invalid input data");
      } else if (response.status === 409) {
        formError.set("Username is already taken, please choose another one.");
      } else {
        formError.set("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      formError.set("Could not connect to the server. Please check your network.");
    } finally {
      isSubmitting.set(false);
    }
  }

  function backToLogin() {
    goto("/login");
  }
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<div class="register-container">
  <div class="register-box">
    <h1>SIGN UP</h1>
    <p>Let's get you all set up so you can access your personal account.</p>
  </div>

  {#if $formError}
    <div class="error-message">
      <p>{$formError}</p>
    </div>
  {/if}

  <form on:submit|preventDefault={handleRegister}>
    <div class="two-columns">
      <div class="column">
        <div class="field">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            placeholder="Please choose a username"
            required
          />
          {#if $usernameTaken && username.trim().length}
            <div class="field-error">Username is already taken.</div>
          {/if}
        </div>

        <div class="field">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            bind:value={lastName}
            placeholder="Please enter your last name"
            required
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input
              bind:this={passwordInput}
              type="password"
              id="password"
              bind:value={password}
              placeholder="Please enter your password"
              required
            />
            <button type="button" class="toggle-password" on:click={togglePasswordVisibility}>
              {#if isPasswordVisible}👁️{:else}🙈{/if}
            </button>
          </div>
        </div>

        <div class="field">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-wrapper">
            <input
              bind:this={confirmPasswordInput}
              type="password"
              id="confirmPassword"
              bind:value={confirmPassword}
              placeholder="Please confirm your password"
              required
            />
            <button
              type="button"
              class="toggle-password"
              on:click={toggleConfirmPasswordVisibility}
            >
              {#if isConfirmPasswordVisible}👁️{:else}🙈{/if}
            </button>
          </div>

          {#if $passwordMismatch}
            <div class="field-error">Passwords do not match</div>
          {/if}
        </div>
      </div>

      <div class="column">
        <div class="field">
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            bind:value={firstName}
            placeholder="Please enter your first name"
            required
          />
        </div>

        <div class="field">
          <label for="dateOfBirth">Date of Birth</label>
          <input type="date" id="dateOfBirth" bind:value={dateOfBirth} max={today} required />
        </div>

        <div class="field">
          <label for="description">Description</label>
          <textarea id="description" bind:value={description} placeholder="A short bio" required
          ></textarea>
        </div>

        <div class="field">
          <label for="avatarSelect">Choose an avatar</label>
          <div class="avatar-preview">
              {#each avatarList as a (a.id)}
                {#if a.id === selectedAvatarId}
                  <img src={a.path} alt="Avatar preview" width="64" height="64"/>
                {/if}
              {/each}
          </div>
          
          <select id="avatarSelect" bind:value={selectedAvatarId} class="field">
            {#each avatarList as a (a.id)}
              <option value={a.id}>Avatar {a.id}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <button
      type="submit"
      class="btn"
      disabled={$isSubmitting || $usernameTaken || $passwordMismatch || !dateOfBirth}
    >
      {#if $isSubmitting}
        Creating account...{:else}Create account
      {/if}
    </button>
  </form>
</div>

{#if showSuccess}
  <div class="modal-overlay">
    <div class="modal">
      <h1>Registration Successful!</h1>
      <p>Your account has been created successfully.</p>
      <button class="modal-btn" on:click={backToLogin}>Back to Login</button>
    </div>
  </div>
{/if}

<style>
  .register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to right, #34495e, #7f8c8d);
    color: #2c3e50;
    padding: 1rem;
  }

  .register-box {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    width: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 1rem;
  }

  .register-box h1 {
    margin: 0;
    font-size: 2rem;
    color: #2c3e50;
    text-align: center;
  }
  .register-box p {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .error-message {
    background-color: #e74c3c;
    color: white;
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    width: 600px;
    text-align: center;
  }

  .two-columns {
    display: flex;
    gap: 1rem;
    width: 600px;
    margin-bottom: 1rem;
  }

  .column {
    flex: 1;
  }
  .field {
    margin-bottom: 1rem;
  }
  .field label {
    display: block;
    margin-bottom: 0.3rem;
    color: #34495e;
    font-size: 0.9rem;
  }
  .field input,
  .field textarea,
  .field select {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid #bdc3c7;
    border-radius: 0.3rem;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .field input:focus,
  .field textarea:focus,
  .field select:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 0 2px rgba(41, 128, 185, 0.2);
  }
  .field-error {
    margin-top: 0.3rem;
    color: #e74c3c;
    font-size: 0.8rem;
  }

  .avatar-preview {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  .avatar-preview img {
    border-radius: 50%;
    border: 2px solid #2980b9;
  }

  .btn {
    width: 600px;
    max-width: 100%;
    background-color: #2980b9;
    color: white;
    padding: 0.7rem;
    border: none;
    border-radius: 0.3rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }

  .btn:hover:not(:disabled) {
    background-color: #3498db;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  }
  .modal p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  .modal-btn {
    background-color: #2980b9;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 0.3rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .modal-btn:hover {
    background-color: #3498db;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-wrapper input {
    flex: 1;
    padding-right: 2rem;
  }

  .toggle-password {
    position: absolute;
    right: 0.6rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #34495e;
  }
</style>
