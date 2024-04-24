import { getLang } from "../js/utils/getLang.js";

export function rootPageTraduction() {
  const lang = getLang();
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