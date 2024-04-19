export default async function rootPage() {
    return `
    <nav class="bg-dark navbar">
    <div class="flex-grow-1">
      <ul id="nav-link-list" class="justify-content-start">
        <li>
          <a class="navbar-brand rounded img-light" href="/home">
            <img width="50" src="./assets/main_logo.png" alt="">
          </a>
          <li><a href="home" id="home-link">Home</a></li>'
          <li><a href="login" id="login-link">Login</a></li>'
          <li><a href="register" id="register-link">Register</a></li>'
          <li><a href="profile" id="profile-link">Profile</a></li>'
          <li><a href="localroom" id="local-link">Local</a></li>'
          <li><a href="friend" id="friend-link">Friends</a></li>'
          <li><a href="update" id="update-link">Update</a></li>'
          <li><a href="tournament" id="tournament-link">Tournament</a></li>'
          <li><a href="gamesearch" id="gamesearch-link">Games</a></li>'
        </li>
      </ul>
    </div>
    <div class="dropdown" id="dropID">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Language
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">FR</a></li>
        <li><a class="dropdown-item" href="#">EN</a></li>
        <li><a class="dropdown-item" href="#">PT</a></li>
      </ul>
    </div>
    <div class="px-5">
      <button class="btn btn-secondary" id="logout-button">Logout</button>
    </div>
  </nav>
  <main>
    <div id="content" class="text-center" >
    </div>
  </main>
</div>
`;
}
