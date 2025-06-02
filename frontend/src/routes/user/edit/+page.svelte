<!-- src/routes/user/edit/+page.svelte -->
<script>
  // In a real app, you’d load user’s current data in load() or from a store
  let name = 'Jane Doe';
  let bio = 'Front-end developer and content writer.';

  function saveProfile() {
    // TODO: send updated name/bio to your API
    console.log('Saving profile:', { name, bio });
  }
</script>

<section class="edit-profile-page">
  <h2>Edit Profile</h2>
  <label>
    Name
    <input type="text" bind:value={name} />
  </label>
  <label>
    Bio
    <textarea bind:value={bio}></textarea>
  </label>
  <button on:click={saveProfile}>Save Changes</button>
</section>

<style>
  .edit-profile-page {
    max-width: 600px;
    margin: 2rem auto;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .edit-profile-page h2 {
    margin: 0 0 1rem 0;
  }
  .edit-profile-page label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
  .edit-profile-page input,
  .edit-profile-page textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  .edit-profile-page button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .edit-profile-page button:hover {
    background: #1b2a38;
  }
</style>
