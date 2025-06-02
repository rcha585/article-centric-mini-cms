<!-- src/routes/user/+page.svelte -->
<script>
  // In a real app, you’d fetch the current user’s data in a load function or via a store
  let currentUser = {
    name: 'Jane Doe',
    avatar: '/avatars/jane_doe.jpg',
    bio: 'Front-end developer and content writer.'
  };
</script>

<section class="profile-page">
  <img src={currentUser.avatar} alt="Avatar" class="profile-avatar" />
  <h2>{currentUser.name}</h2>
  <p>{currentUser.bio}</p>
  <a href="/user/edit" class="edit-profile-link">Edit Profile</a>
</section>

<style>
  .profile-page {
    max-width: 600px;
    margin: 2rem auto;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    text-align: center;
  }
  .profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
  }
  .edit-profile-link {
    display: inline-block;
    margin-top: 1rem;
    color: #2980b9;
    text-decoration: none;
  }
  .edit-profile-link:hover {
    text-decoration: underline;
  }
</style>
