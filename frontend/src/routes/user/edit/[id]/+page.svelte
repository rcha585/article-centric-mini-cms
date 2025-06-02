<!-- src/routes/users/[id]/+page.svelte -->
<script context="module">
  /** 
   * Example load() to fetch “other user” data:
   * export async function load({ params, fetch }) {
   *   const userId = params.id;
   *   const res = await fetch(`/api/users/${userId}`);
   *   const userData = await res.json();
   *   return { props: { userData } };
   * }
   */
</script>

<script>
  // Replace this with actual data from load()
  export let userData = {
    id: '123',
    name: 'Samuel Jackson',
    avatar: '/avatars/sam_jackson.jpg',
    bio: 'Music blogger and producer.'
  };
</script>

<section class="other-profile-page">
  <img src={userData.avatar} alt="Avatar" class="profile-avatar" />
  <h2>{userData.name}</h2>
  <p>{userData.bio}</p>
</section>

<style>
  .other-profile-page {
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
</style>
