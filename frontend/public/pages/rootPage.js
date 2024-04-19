export default function rootPage() {
    return `
    <nav class="bg-dark navbar">
    <div class="flex-grow-1">
      <ul id="nav-link-list" class="justify-content-start">
        <li>
          <a class="navbar-brand rounded img-light" href="/home">
            <img width="50" src="./assets/main_logo.png" alt="">
          </a>
          <li><a href="home" id="home-link"></a></li>'
          <li><a href="login" id="login-link"></a></li>'
          <li><a href="register" id="register-link"></a></li>'
          <li><a href="profile" id="profile-link"></a></li>'
          <li><a href="friend" id="friend-link"></a></li>'
          <li><a href="tournament" id="tournament-link"></a></li>'
          <li><a href="gamesearch" id="gamesearch-link"></a></li>'
        </li>
      </ul>
    </div>
    <div class="dropdown" id="dropID">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Language
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item dropdown-lang-item" href="#">FR</a></li>
        <li><a class="dropdown-item dropdown-lang-item" href="#">EN</a></li>
        <li><a class="dropdown-item dropdown-lang-item" href="#">PT</a></li>
      </ul>
    </div>
    <div class="px-5">
      <button class="btn btn-secondary" id="logout-button"></button>
    </div>
  </nav>
  <main>
    <div id="content" class="text-center" >
    </div>
  </main>
</div>
`;
}

export function rootPageTraduction() {
  console.log("rootPage");
  const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
  let lang = "EN";
  if (cookie) {
    lang = cookie.split("=")[1];
  }

  let langdict = JSON.parse(`{
      "FR": {
          "home": "Accueil",
          "login": "Connexion",
          "register": "Inscription",
          "profile": "Profil",
          "friend": "Amis",
          "tournament": "Tournois",
          "gamesearch": "Jeux",
          "logout": "Déconnexion"
      },
      "EN": {
          "home": "Home",
          "login": "Login",
          "register": "Register",
          "profile": "Profile",
          "friend": "Friends",
          "tournament": "Tournament",
          "gamesearch": "Games",
          "logout": "Logout"
      },
      "PT": {
          "home": "Início",
          "login": "Conecte-se",
          "register": "Registrar",
          "profile": "Perfil",
          "friend": "Amigos",
          "tournament": "Torneio",
          "gamesearch": "Jogos",
          "logout": "Sair"
      }
  }`);

  let homeLink = document.querySelector("#home-link");
  let loginLink = document.querySelector("#login-link");
  let registerLink = document.querySelector("#register-link");
  let profileLink = document.querySelector("#profile-link");
  let friendLink = document.querySelector("#friend-link");
  let tournamentLink = document.querySelector("#tournament-link");
  let gamesearchLink = document.querySelector("#gamesearch-link");
  let logoutButton = document.querySelector("#logout-button");

  homeLink.innerHTML = langdict[lang]["home"];
  loginLink.innerHTML = langdict[lang]["login"];
  registerLink.innerHTML = langdict[lang]["register"];
  profileLink.innerHTML = langdict[lang]["profile"];
  friendLink.innerHTML = langdict[lang]["friend"];
  tournamentLink.innerHTML = langdict[lang]["tournament"];
  gamesearchLink.innerHTML = langdict[lang]["gamesearch"];
  logoutButton.innerHTML = langdict[lang]["logout"];
}