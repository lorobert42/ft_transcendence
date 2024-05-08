export default function gameCreation() {
	const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
    let lang = "EN";
    if (cookie) {
        lang = cookie.split("=")[1];
    }

    let langdict = JSON.parse(`{
        "FR": {
            "title": "Créez votre jeu",
			"pickplayer": "Choisissez un joueur :",
			"searchplayer": "Rechercher un joueur...",
			"creategame": "Créer une partie :",
			"startgame": "Commencer le jeu"
        },
        "EN": {
            "title": "Create Your Game",
            "pickplayer": "Choose a Player:",
            "searchplayer": "Search player...",
            "creategame": "Create Game:",
            "startgame": "Start Game"
		},
        "PT": {
            "title": "Criar o seu jogo",
			"pickplayer": "Escolha um jogador:",
			"searchplayer": "Buscar jogador...",
			"creategame": "Criar jogo:",
			"startgame": "Iniciar o jogo"
		}
    }`);
   return `
    <div class="text-center">
    <h2>${langdict[lang]['title']}</h2>
    <form id="gameForm">
        <div class="mb-3">
            <label for="playerSelect" class="form-label">${langdict[lang]['pickplayer']}</label>
            <input class="form-control mb-1" type="text" id="searchInput" placeholder="${langdict[lang]['searchplayer']}">
            <select class="form-select" id="playerSelect" size="5">
            </select>
        </div>
        <button type="button" id="gameCreateSubmit" class="btn btn-primary">${langdict[lang]['creategame']}</button>
    </form>
    </div>`;
}