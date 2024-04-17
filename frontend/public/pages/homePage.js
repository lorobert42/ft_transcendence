export default function homePage() {
  //get language cookie and set it to EN if not set
  const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
  let lang = "EN";
  if (cookie) {
    lang = cookie.split("=")[1];
  }
  console.log(lang);

  let langdict = JSON.parse(`{
      "FR": {
          "title": "Bienvenue sur Transcendence",
          "description": "Bienvenue sur Transcendence, le jeu de pong en ligne. Jouez contre vos amis ou contre l'IA."
      },
      "EN": {
          "title": "Profile Page",
          "description": "Welcome to Transcendence, the online pong game. Play against your friends or against the AI."
      },
      "PT": {
          "title": "Pagina de perfil",
          "description": "Bem-vindo ao Transcendence, o jogo de pong online. Jogue contra seus amigos ou contra a IA."
      }
  }`);

  return `
  <!-- Hero Section -->
  <div class="text-dark theme-switch text-center py-2">
      <h1>${langdict[lang]['title']}</h1>
  </div>

  <!-- Content Sections -->
  <div class="container text-dark theme-switch">
  <a class="navbar-brand" href="#">
  <img
    src="./assets/main_logo.png"
    alt=""
    height="30"
    width="30"
    class="rounded img-light theme-switch"
  />
</a>
  <p class="text-center py-5">
  ${langdict[lang]['description']}
  </p>
  </div>
`;
}
