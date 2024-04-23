export default function gameSearch() {
    //get language cookie and set it to EN if not set
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
    let lang = "EN";
    if (cookie) {
        lang = cookie.split("=")[1];
    }

    let langdict = JSON.parse(`{
        "FR": {
            "pendinggames": "Jeux en Attente",
            "gamecreation": "Créer un Jeu",
            "createlocal": "Créer un Jeu en Local",
            "createremote": "Créer un Jeu en Remote",
            "createtournament": "Créer un Tournois",
            "search": "Chercher un Jeu"
        },
        "EN": {
            "pendinggames": "Pending Games",
            "gamecreation": "Game Creation",
            "createlocal": "Create Local",
            "createremote": "Create Remote",
            "createtournament": "Create Tournament",
            "search": "Search Game"
        },
        "PT": {
            "pendinggames": "Jogos pendentes",
            "gamecreation": "Criação de jogos",
            "createlocal": "Criar local",
            "createremote": "Criar Remoto",
            "createtournament": "Criar torneio",
            "search": "Procurar jogo"
		}
    }`);

	return `<div class="row">
        <div class="col-md-6">
            <h1>${langdict[lang]['pendinggames']}</h1>
            <input type="text" id="game-search" class="form-control mb-3" placeholder="${langdict[lang]['search']}">
            <ul id="game-list" class="list-group"></ul>
        </div>
        <div class="col-md-6">
            <h2>${langdict[lang]['gamecreation']}</h2>
            <ul id="game-create" class="list-group">
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" href="/localroom" class="btn btn-primary" id="create-local-game">${langdict[lang]['createlocal']}</button>
            </li>
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary" id="create-remote-game">${langdict[lang]['createremote']}</button>
            </li>
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary" id="create-tournament">${langdict[lang]['createtournament']}</button>
            </ul>
        </div>
    </div>`;
}
