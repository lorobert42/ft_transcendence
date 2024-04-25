export function setNavbar(isLogged) {
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const profileLink = document.getElementById("profile-link");
  const friendLink = document.getElementById("friend-link");
  const tournamentLink = document.getElementById("tournament-link");
  const gamesearchLink = document.getElementById("gamesearch-link");
  const logoutButton = document.getElementById("logout-button");

  if (isLogged) {
    loginLink.classList.add("d-none");
    registerLink.classList.add("d-none");
    profileLink.classList.remove("d-none");
    friendLink.classList.remove("d-none");
    tournamentLink.classList.remove("d-none");
    gamesearchLink.classList.remove("d-none");
    logoutButton.classList.remove("d-none");
  } else {
    loginLink.classList.remove("d-none");
    registerLink.classList.remove("d-none");
    profileLink.classList.add("d-none");
    friendLink.classList.add("d-none");
    tournamentLink.classList.add("d-none");
    gamesearchLink.classList.add("d-none");
    logoutButton.classList.add("d-none");
  }
}