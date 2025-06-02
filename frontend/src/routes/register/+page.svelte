<!-- src/routes/register/+page.svelte -->
<script>
  let name = '';
  let email = '';
  let password = '';

  function handleRegister() {
    // TODO: call your registration API
    console.log('Registering:', { name, email, password });
  }
</script>

<form on:submit|preventDefault={handleRegister} class="register-form">
  <h2>Sign Up</h2>
  <label>
    Name
    <input type="text" bind:value={name} required />
  </label>
  <label>
    Email
    <input type="email" bind:value={email} required />
  </label>
  <label>
    Password
    <input type="password" bind:value={password} required />
  </label>
  <button type="submit">Register</button>
</form>

<style>
  .register-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    width: 340px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .register-form h2 {
    margin: 0 0 1rem 0;
    text-align: center;
  }
  .register-form label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
  .register-form input {
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .register-form button {
    padding: 0.5rem;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  .register-form button:hover {
    background: #1e8449;
  }
</style>
